from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import require_lawyer
from app.core.database import get_db
from app.models.knowledge import KnowledgeChunk
from app.models.user import User

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])


class IngestRequest(BaseModel):
    source_type: str  # law | decree | regulation | template | case_archive | contact
    source_name: str
    content: str
    section: str | None = None
    article_number: str | None = None
    language: str = "ru"


class IngestResponse(BaseModel):
    chunks_created: int
    source_name: str


@router.post("/ingest", response_model=IngestResponse)
async def ingest_document(
    req: IngestRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(require_lawyer),
):
    """Ingest a document into the knowledge base, splitting into chunks and generating embeddings."""
    import ollama as ollama_client

    chunks = _split_text(req.content, chunk_size=1000, overlap=200)
    created = 0

    for i, chunk_text in enumerate(chunks):
        try:
            resp = ollama_client.embed(model="all-minilm", input=chunk_text)
            embedding = resp["embeddings"][0]
        except Exception:
            embedding = None

        chunk = KnowledgeChunk(
            source_type=req.source_type,
            source_name=req.source_name,
            section=req.section,
            article_number=req.article_number,
            chunk_index=i,
            content=chunk_text,
            embedding=embedding,
            language=req.language,
        )
        db.add(chunk)
        created += 1

    await db.flush()
    return IngestResponse(chunks_created=created, source_name=req.source_name)


def _split_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
    """Split text into overlapping chunks by paragraphs."""
    paragraphs = text.split("\n\n")
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) > chunk_size and current:
            chunks.append(current.strip())
            # Keep overlap
            words = current.split()
            overlap_words = words[-overlap // 5:] if len(words) > overlap // 5 else words
            current = " ".join(overlap_words) + "\n\n" + para
        else:
            current = current + "\n\n" + para if current else para

    if current.strip():
        chunks.append(current.strip())

    return chunks if chunks else [text]
