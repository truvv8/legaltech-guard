import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

TELEGRAM_API = "https://api.telegram.org/bot{token}/sendMessage"


async def send_telegram_notification(message: str, parse_mode: str = "HTML") -> bool:
    """Send notification to FD Group lawyer's Telegram channel."""
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        logger.warning("Telegram not configured, skipping notification")
        return False

    url = TELEGRAM_API.format(token=settings.TELEGRAM_BOT_TOKEN)
    payload = {
        "chat_id": settings.TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": parse_mode,
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(url, json=payload)
            resp.raise_for_status()
            return True
    except Exception as e:
        logger.error("Telegram notification failed: %s", e)
        return False


async def notify_new_case(case_id: str, title: str, violation_type: str, priority: str, region: str | None):
    """Notify lawyers about a new case."""
    priority_emoji = {"sos": "🚨", "high": "⚠️", "normal": "📋", "low": "📝"}.get(priority, "📋")
    msg = (
        f"{priority_emoji} <b>НОВОЕ ОБРАЩЕНИЕ</b>\n\n"
        f"<b>ID:</b> {case_id[:8]}...\n"
        f"<b>Тема:</b> {title}\n"
        f"<b>Тип нарушения:</b> {violation_type}\n"
        f"<b>Регион:</b> {region or 'Не указан'}\n"
        f"<b>Приоритет:</b> {priority.upper()}\n\n"
        f"Откройте дашборд для просмотра полного анализа."
    )
    await send_telegram_notification(msg)


async def notify_sos(case_id: str, title: str, description_preview: str):
    """Urgent SOS notification."""
    msg = (
        f"🚨🚨🚨 <b>SOS — БАРЬЕР ДЛЯ ИНВЕСТОРА</b> 🚨🚨🚨\n\n"
        f"<b>ID:</b> {case_id[:8]}...\n"
        f"<b>Тема:</b> {title}\n"
        f"<b>Описание:</b> {description_preview[:200]}...\n\n"
        f"<b>ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ РЕАКЦИЯ</b>"
    )
    await send_telegram_notification(msg)
