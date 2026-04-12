import json
import logging

import ollama
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.knowledge import KnowledgeChunk

logger = logging.getLogger(__name__)
settings = get_settings()

SYSTEM_PROMPT = """Ты — Senior Legal AI Assistant компании FD Group, специализирующийся на защите иностранных инвестиций и взаимодействии с Комитетом по защите прав инвесторов Генпрокуратуры РК.

Твоя цель: Анализировать жалобы инвесторов и генерировать юридически безупречные черновики обращений в Прокуратуру.

Твои принципы:
1. Строгость и лаконичность: Используй официальный юридический стиль Казахстана. Никакой "воды" и оценочных суждений, только факты и ссылки на НПА.
2. База знаний: Твои главные документы — Предпринимательский кодекс РК, Закон "О прокуратуре", Указ Президента №1125 (о прокурорском фильтре).
3. Алгоритм ответа:
   - Определи характер нарушения (коррупция, незаконная проверка, блокировка счетов, отказ в разрешении, изъятие имущества).
   - Найди соответствующую статью в предоставленном контексте из базы знаний.
   - Сформируй структуру документа:
     а) Описание инцидента
     б) Ссылка на нарушение закона
     в) Просьба о применении мер прокурорского реагирования
4. Конфиденциальность: Никогда не упоминай данные других клиентов в ответах.
5. Язык: Если инвестор пишет на английском, проанализируй проблему и подготовь черновик на русском для юриста FD Group, предоставив инвестору краткое резюме на английском.

При формировании обращения всегда указывай:
- Полное наименование органа, в который направляется обращение
- Ссылки на конкретные статьи НПА
- Четкое описание нарушенного права инвестора
- Просительную часть с конкретными мерами реагирования"""

ANALYSIS_PROMPT_TEMPLATE = """Проанализируй следующую жалобу инвестора и подготовь юридический анализ.

ЖАЛОБА ИНВЕСТОРА:
Тип нарушения: {violation_type}
Регион: {region}
Описание: {description}

РЕЛЕВАНТНЫЕ НОРМАТИВНЫЕ АКТЫ ИЗ БАЗЫ ЗНАНИЙ:
{context}

Подготовь ответ СТРОГО в следующем JSON-формате:
{{
  "violation_type": "тип нарушения",
  "applicable_laws": ["список применимых статей НПА"],
  "analysis_summary": "краткий юридический анализ ситуации",
  "draft_complaint": "полный текст черновика жалобы в Комитет по защите прав инвесторов Генпрокуратуры РК",
  "recommended_actions": ["список рекомендуемых действий"]
}}

Ответ должен быть ТОЛЬКО в JSON-формате, без дополнительного текста."""

VIOLATION_TYPE_MAP = {
    "corruption": "Коррупция / Вымогательство",
    "illegal_inspection": "Незаконная проверка предпринимательской деятельности",
    "account_blocking": "Незаконная блокировка банковских счетов",
    "permit_denial": "Необоснованный отказ в выдаче разрешений",
    "property_seizure": "Незаконное изъятие имущества",
    "other": "Иное нарушение прав инвестора",
}


async def get_relevant_context(db: AsyncSession, query: str, violation_type: str, limit: int = 5) -> str:
    """Retrieve relevant legal knowledge chunks using pgvector similarity search."""
    try:
        embedding = _get_embedding(query)
        stmt = (
            select(KnowledgeChunk)
            .order_by(KnowledgeChunk.embedding.cosine_distance(embedding))
            .limit(limit)
        )
        result = await db.execute(stmt)
        chunks = result.scalars().all()

        if not chunks:
            return _get_fallback_context(violation_type)

        context_parts = []
        for chunk in chunks:
            header = f"[{chunk.source_name}]"
            if chunk.article_number:
                header += f" Статья {chunk.article_number}"
            context_parts.append(f"{header}\n{chunk.content}")
        return "\n\n---\n\n".join(context_parts)
    except Exception as e:
        logger.warning("Vector search failed, using fallback context: %s", e)
        return _get_fallback_context(violation_type)


def _get_embedding(text: str) -> list[float]:
    """Generate embedding using Ollama's embedding model."""
    response = ollama.embed(model="all-minilm", input=text)
    return response["embeddings"][0]


def _get_fallback_context(violation_type: str) -> str:
    """Fallback context when vector search is unavailable."""
    contexts = {
        "corruption": (
            "Предпринимательский кодекс РК, Глава 28 — Защита прав предпринимателей.\n"
            "Уголовный кодекс РК, Статья 366 — Получение взятки.\n"
            "Закон РК «О прокуратуре», Статья 28 — Надзор за законностью.\n"
            "Указ Президента РК №1125 от 17.12.2025 — О Комитете по защите прав инвесторов."
        ),
        "illegal_inspection": (
            "Предпринимательский кодекс РК, Статья 144 — Основания для проверки.\n"
            "Предпринимательский кодекс РК, Статья 154 — Гарантии при проверках.\n"
            "Закон РК «О прокуратуре», Статья 28 — Прокурорский надзор.\n"
            "Указ Президента РК №1125 — Прокурорский фильтр для защиты инвесторов."
        ),
        "account_blocking": (
            "Предпринимательский кодекс РК, Глава 28 — Защита прав.\n"
            "Гражданский кодекс РК, Статья 741 — Банковский счет.\n"
            "Закон РК «О платежах и переводах», Статья 48 — Ограничения по счетам.\n"
            "Указ Президента РК №1125 — Защита инвестиционной деятельности."
        ),
        "permit_denial": (
            "Предпринимательский кодекс РК, Статья 27 — Право на получение разрешений.\n"
            "Закон РК «О разрешениях и уведомлениях», Статья 20 — Основания для отказа.\n"
            "Закон РК «О прокуратуре» — Надзор за законностью актов госорганов.\n"
            "Указ Президента РК №1125 — Комитет по защите прав инвесторов."
        ),
        "property_seizure": (
            "Конституция РК, Статья 26 — Защита права собственности.\n"
            "Гражданский кодекс РК, Статья 249 — Основания изъятия.\n"
            "Предпринимательский кодекс РК — Гарантии защиты инвестиций.\n"
            "Указ Президента РК №1125 — Прокурорский фильтр."
        ),
    }
    return contexts.get(violation_type, contexts["corruption"])


async def analyze_case(db: AsyncSession, description: str, violation_type: str, region: str | None) -> dict:
    """Run full AI analysis on an investor complaint."""
    context = await get_relevant_context(db, description, violation_type)
    violation_label = VIOLATION_TYPE_MAP.get(violation_type, violation_type)

    prompt = ANALYSIS_PROMPT_TEMPLATE.format(
        violation_type=violation_label,
        region=region or "Не указан",
        description=description,
        context=context,
    )

    try:
        response = ollama.chat(
            model=settings.OLLAMA_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            options={"temperature": 0.2, "num_predict": 4096},
        )
        content = response["message"]["content"]

        # Extract JSON from response
        start = content.find("{")
        end = content.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(content[start:end])
        return {
            "violation_type": violation_label,
            "applicable_laws": [],
            "analysis_summary": content,
            "draft_complaint": content,
            "recommended_actions": ["Обратиться к юристу FD Group для уточнения"],
        }
    except Exception as e:
        logger.error("AI analysis failed: %s", e)
        return {
            "violation_type": violation_label,
            "applicable_laws": [],
            "analysis_summary": f"Автоматический анализ временно недоступен. Ошибка: {e}",
            "draft_complaint": "",
            "recommended_actions": ["Обратиться к юристу FD Group напрямую"],
        }


async def chat_with_ai(db: AsyncSession, user_message: str, case_context: str | None = None) -> str:
    """Interactive chat with the legal AI assistant."""
    context = ""
    if case_context:
        try:
            context = await get_relevant_context(db, user_message, "other")
        except Exception:
            context = ""

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if context:
        messages.append({
            "role": "system",
            "content": f"Релевантный контекст из базы знаний:\n{context}",
        })
    messages.append({"role": "user", "content": user_message})

    try:
        response = ollama.chat(
            model=settings.OLLAMA_MODEL,
            messages=messages,
            options={"temperature": 0.3, "num_predict": 2048},
        )
        return response["message"]["content"]
    except Exception as e:
        logger.error("Chat failed: %s", e)
        return f"Система временно недоступна. Пожалуйста, обратитесь к юристу FD Group напрямую. Ошибка: {e}"
