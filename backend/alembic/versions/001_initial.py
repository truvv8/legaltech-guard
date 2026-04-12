"""Initial schema

Revision ID: 001
Revises:
Create Date: 2025-12-20
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Users
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("company_name", sa.String(255)),
        sa.Column("phone", sa.String(50)),
        sa.Column("role", sa.String(50), server_default="investor"),
        sa.Column("language", sa.String(10), server_default="ru"),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true")),
        sa.Column("is_verified", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("notes", sa.Text()),
    )

    # Cases
    op.create_table(
        "cases",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("investor_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("assigned_lawyer_id", sa.UUID(), sa.ForeignKey("users.id")),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("description_encrypted", sa.Text(), nullable=False),
        sa.Column("violation_type", sa.String(100), nullable=False),
        sa.Column("region", sa.String(100)),
        sa.Column("status", sa.String(50), server_default="new"),
        sa.Column("priority", sa.String(20), server_default="normal"),
        sa.Column("ai_draft", sa.Text()),
        sa.Column("ai_analysis", sa.Text()),
        sa.Column("legal_references", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Case documents
    op.create_table(
        "case_documents",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("case_id", sa.UUID(), sa.ForeignKey("cases.id"), nullable=False),
        sa.Column("filename", sa.String(500), nullable=False),
        sa.Column("file_path_encrypted", sa.Text(), nullable=False),
        sa.Column("file_type", sa.String(50), nullable=False),
        sa.Column("uploaded_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Case events
    op.create_table(
        "case_events",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("case_id", sa.UUID(), sa.ForeignKey("cases.id"), nullable=False),
        sa.Column("actor_id", sa.UUID(), sa.ForeignKey("users.id")),
        sa.Column("event_type", sa.String(100), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Knowledge chunks with vector embeddings
    op.create_table(
        "knowledge_chunks",
        sa.Column("id", sa.UUID(), primary_key=True),
        sa.Column("source_type", sa.String(50), nullable=False),
        sa.Column("source_name", sa.String(500), nullable=False),
        sa.Column("section", sa.String(500)),
        sa.Column("article_number", sa.String(50)),
        sa.Column("chunk_index", sa.Integer(), server_default="0"),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(384)),
        sa.Column("language", sa.String(10), server_default="ru"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    # Create index for vector similarity search
    op.execute(
        "CREATE INDEX idx_knowledge_embedding ON knowledge_chunks "
        "USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)"
    )


def downgrade() -> None:
    op.drop_table("knowledge_chunks")
    op.drop_table("case_events")
    op.drop_table("case_documents")
    op.drop_table("cases")
    op.drop_table("users")
    op.execute("DROP EXTENSION IF EXISTS vector")
