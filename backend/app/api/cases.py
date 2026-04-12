import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_lawyer
from app.core.database import get_db
from app.core.security import decrypt_data, encrypt_data
from app.models.case import Case, CaseEvent
from app.models.user import User
from app.schemas.case import (
    AIAnalysisResponse,
    CaseCreateRequest,
    CaseDetailResponse,
    CaseResponse,
    DocumentResponse,
    EventResponse,
    SOSReportRequest,
)
from app.services.ai_service import analyze_case
from app.services.pdf_service import generate_complaint_pdf
from app.services.telegram_service import notify_new_case, notify_sos

router = APIRouter(prefix="/cases", tags=["Cases"])


async def _run_ai_analysis(case_id: uuid.UUID, description: str, violation_type: str, region: str | None):
    """Background task: run AI analysis and update case."""
    from app.core.database import async_session

    async with async_session() as db:
        result = await analyze_case(db, description, violation_type, region)
        case = await db.get(Case, case_id)
        if case:
            case.ai_analysis = result.get("analysis_summary", "")
            case.ai_draft = result.get("draft_complaint", "")
            case.legal_references = "\n".join(result.get("applicable_laws", []))
            case.status = "ai_analyzed"
            event = CaseEvent(
                case_id=case_id,
                event_type="ai_analysis_complete",
                description="ИИ-анализ завершен. Черновик жалобы подготовлен.",
            )
            db.add(event)
            await db.commit()


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    req: CaseCreateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = Case(
        investor_id=user.id,
        title=req.title,
        description_encrypted=encrypt_data(req.description),
        violation_type=req.violation_type,
        region=req.region,
        priority=req.priority,
    )
    db.add(case)
    event = CaseEvent(
        case_id=case.id,
        actor_id=user.id,
        event_type="created",
        description=f"Обращение создано инвестором: {req.title}",
    )
    db.add(event)
    await db.flush()

    background_tasks.add_task(_run_ai_analysis, case.id, req.description, req.violation_type, req.region)
    background_tasks.add_task(notify_new_case, str(case.id), req.title, req.violation_type, req.priority, req.region)

    return CaseResponse(
        id=str(case.id),
        title=case.title,
        violation_type=case.violation_type,
        region=case.region,
        status=case.status,
        priority=case.priority,
        ai_analysis=case.ai_analysis,
        legal_references=case.legal_references,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )


@router.post("/sos", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def sos_report(
    req: SOSReportRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = Case(
        investor_id=user.id,
        title=f"[SOS] {req.title}",
        description_encrypted=encrypt_data(req.description),
        violation_type=req.violation_type,
        region=req.region,
        priority="sos",
    )
    db.add(case)
    event = CaseEvent(
        case_id=case.id,
        actor_id=user.id,
        event_type="created",
        description=f"🚨 SOS-обращение: {req.title}",
    )
    db.add(event)
    await db.flush()

    background_tasks.add_task(_run_ai_analysis, case.id, req.description, req.violation_type, req.region)
    background_tasks.add_task(notify_sos, str(case.id), req.title, req.description[:200])

    return CaseResponse(
        id=str(case.id),
        title=case.title,
        violation_type=case.violation_type,
        region=case.region,
        status=case.status,
        priority=case.priority,
        ai_analysis=case.ai_analysis,
        legal_references=case.legal_references,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )


@router.get("", response_model=list[CaseResponse])
async def list_cases(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role in ("lawyer", "prosecutor"):
        result = await db.execute(select(Case).order_by(Case.created_at.desc()))
    else:
        result = await db.execute(select(Case).where(Case.investor_id == user.id).order_by(Case.created_at.desc()))
    cases = result.scalars().all()
    return [
        CaseResponse(
            id=str(c.id), title=c.title, violation_type=c.violation_type, region=c.region,
            status=c.status, priority=c.priority, ai_analysis=c.ai_analysis,
            legal_references=c.legal_references, created_at=c.created_at, updated_at=c.updated_at,
        )
        for c in cases
    ]


@router.get("/{case_id}", response_model=CaseDetailResponse)
async def get_case(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.role == "investor" and case.investor_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    description = decrypt_data(case.description_encrypted)
    return CaseDetailResponse(
        id=str(case.id), title=case.title, description=description,
        violation_type=case.violation_type, region=case.region,
        status=case.status, priority=case.priority,
        ai_analysis=case.ai_analysis, ai_draft=case.ai_draft,
        legal_references=case.legal_references,
        created_at=case.created_at, updated_at=case.updated_at,
        documents=[DocumentResponse(id=str(d.id), filename=d.filename, file_type=d.file_type, uploaded_at=d.uploaded_at) for d in case.documents],
        events=[EventResponse(id=str(e.id), event_type=e.event_type, description=e.description, created_at=e.created_at) for e in case.events],
    )


@router.patch("/{case_id}/status")
async def update_case_status(
    case_id: uuid.UUID,
    new_status: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_lawyer),
):
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    old_status = case.status
    case.status = new_status
    event = CaseEvent(
        case_id=case.id,
        actor_id=user.id,
        event_type="status_change",
        description=f"Статус изменен: {old_status} → {new_status}",
    )
    db.add(event)
    return {"status": "updated", "old": old_status, "new": new_status}


@router.get("/{case_id}/pdf")
async def download_complaint_pdf(
    case_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    case = await db.get(Case, case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if user.role == "investor" and case.investor_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if not case.ai_draft:
        raise HTTPException(status_code=400, detail="AI draft not yet generated")

    pdf_bytes = generate_complaint_pdf(case.ai_draft)
    if not pdf_bytes:
        raise HTTPException(status_code=500, detail="PDF generation failed")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=complaint_{str(case_id)[:8]}.pdf"},
    )
