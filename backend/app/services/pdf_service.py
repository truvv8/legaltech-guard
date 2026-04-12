import logging
from datetime import datetime, timezone

from jinja2 import Template

logger = logging.getLogger(__name__)

COMPLAINT_TEMPLATE = """
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.6; margin: 40px 60px; color: #000; }
  .header { text-align: right; margin-bottom: 30px; }
  .header p { margin: 2px 0; }
  .title { text-align: center; font-weight: bold; font-size: 16pt; margin: 30px 0 20px; }
  .body p { text-indent: 40px; text-align: justify; }
  .signature { margin-top: 40px; }
  .footer { margin-top: 20px; font-size: 10pt; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
</style>
</head>
<body>
  <div class="header">
    <p><strong>В Комитет по защите прав инвесторов</strong></p>
    <p><strong>Генеральной прокуратуры Республики Казахстан</strong></p>
    <p>г. Астана</p>
  </div>

  <div class="title">ОБРАЩЕНИЕ</div>

  <div class="body">
    {{ draft_content }}
  </div>

  <div class="signature">
    <p>С уважением,</p>
    <p>___________________________</p>
    <p>Дата: {{ date }}</p>
  </div>

  <div class="footer">
    <p>Документ подготовлен при содействии FD Group Legal AI System</p>
    <p>Конфиденциально. Не подлежит разглашению третьим лицам.</p>
  </div>
</body>
</html>
"""


def generate_complaint_html(draft_content: str) -> str:
    """Generate HTML for the complaint document."""
    template = Template(COMPLAINT_TEMPLATE)
    date_str = datetime.now(timezone.utc).strftime("%d.%m.%Y")
    paragraphs = draft_content.split("\n")
    formatted = "\n".join(f"<p>{p.strip()}</p>" for p in paragraphs if p.strip())
    return template.render(draft_content=formatted, date=date_str)


def generate_complaint_pdf(draft_content: str) -> bytes:
    """Generate PDF from complaint draft using WeasyPrint."""
    try:
        from weasyprint import HTML
        html_content = generate_complaint_html(draft_content)
        return HTML(string=html_content).write_pdf()
    except ImportError:
        logger.error("WeasyPrint not installed, returning empty PDF")
        return b""
    except Exception as e:
        logger.error("PDF generation failed: %s", e)
        return b""
