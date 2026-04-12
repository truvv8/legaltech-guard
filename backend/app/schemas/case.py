from datetime import datetime

from pydantic import BaseModel


class CaseCreateRequest(BaseModel):
    title: str
    description: str
    violation_type: str  # corruption | illegal_inspection | account_blocking | permit_denial | property_seizure | other
    region: str | None = None
    priority: str = "normal"


class SOSReportRequest(BaseModel):
    title: str
    description: str
    violation_type: str
    region: str | None = None


class CaseResponse(BaseModel):
    id: str
    title: str
    violation_type: str
    region: str | None
    status: str
    priority: str
    ai_analysis: str | None
    legal_references: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CaseDetailResponse(CaseResponse):
    description: str
    ai_draft: str | None
    documents: list["DocumentResponse"]
    events: list["EventResponse"]


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    uploaded_at: datetime

    model_config = {"from_attributes": True}


class EventResponse(BaseModel):
    id: str
    event_type: str
    description: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AIAnalysisResponse(BaseModel):
    case_id: str
    violation_type: str
    applicable_laws: list[str]
    analysis_summary: str
    draft_complaint: str
    recommended_actions: list[str]
