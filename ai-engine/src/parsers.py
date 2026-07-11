import json
import re
from typing import Optional
from xml.sax.saxutils import escape as xml_escape

from json_repair import repair_json


def _strip_code_fences(raw: str) -> str:
    """يشيل أي code fence (```json, ```svg, ```xml, ``` عادي...) بشكل عام."""
    clean = re.sub(r"```[a-zA-Z]*\n?", "", raw)
    clean = clean.replace("```", "")
    # BOM أو مسافات غريبة ممكن تيجي من بعض الموديلات
    return clean.strip().lstrip("\ufeff")


def parse_json(raw: str):
    """يشيل code fences ويطلع أول object/array صالح من رد الموديل، ويصلح الأخطاء البسيطة تلقائيًا."""
    if not raw:
        return None

    try:
        clean = _strip_code_fences(raw)
        match = re.search(r"[{\[]", clean)
        if not match:
            return None

        candidate = clean[match.start():]

        # المحاولة الأولى: decode مباشر (بيتجاهل أي نص زيادة بعد الـ JSON الصحيح تلقائيًا)
        try:
            decoder = json.JSONDecoder()
            obj, _ = decoder.raw_decode(candidate)
            return obj
        except json.JSONDecodeError as e:
            print(f"[parsers] Initial parse failed, trying auto-repair: {e}")

        # المحاولة الثانية: json_repair بيصلح فواصل ناقصة/زيادة، quotes، أقواس مش مقفولة...
        try:
            repaired = repair_json(candidate)
            if repaired:
                return json.loads(repaired)
        except Exception as e:
            print(f"[parsers] repair_json failed: {e}")

        return None

    except Exception as e:
        print(f"[parsers] Unexpected parse_json error: {e}")
        return None


def parse_svg(raw: str) -> Optional[str]:
    """يطلع أول <svg>...</svg> كامل من رد الموديل. لو الرد مقطوع (مفيش إغلاق)، بيرجع None
    عشان الـ caller يستخدم fallback_svg بدل ما يعرض SVG ناقص/مكسور."""
    if not raw:
        return None

    clean = _strip_code_fences(raw)
    start = clean.find("<svg")
    if start < 0:
        return None

    end = clean.rfind("</svg>")
    if end < 0:
        print("[parsers] SVG response has no closing </svg> tag — likely truncated, discarding")
        return None

    end += len("</svg>")
    return clean[start:end].strip()


# أي attribute اسمه بادئ ب on (onload, onclick, onerror...) = event handler خطر
_EVENT_ATTR_RE = re.compile(r'\son[a-zA-Z]+\s*=\s*(".*?"|\'.*?\')', re.IGNORECASE | re.DOTALL)
_SCRIPT_TAG_RE = re.compile(r"<script\b.*?>.*?</script\s*>", re.IGNORECASE | re.DOTALL)
_FOREIGN_OBJECT_RE = re.compile(r"<foreignObject\b.*?>.*?</foreignObject\s*>", re.IGNORECASE | re.DOTALL)
_JS_URI_RE = re.compile(r'((?:xlink:)?href|src)\s*=\s*(["\'])\s*javascript:.*?\2', re.IGNORECASE)


def _strip_dangerous_svg_content(svg: str) -> str:
    """يشيل أي عنصر ممكن يستخدم لـ XSS لو الـ SVG بيتعرض مباشرة في المتصفح
    (زي dangerouslySetInnerHTML). دايماً نطبقها حتى لو الـ prompt بيقول 'no scripts',
    لأن ده دفاع من نوع defense-in-depth ضد أي جواب غير متوقع من الموديل."""
    svg = _SCRIPT_TAG_RE.sub("", svg)
    svg = _FOREIGN_OBJECT_RE.sub("", svg)
    svg = _EVENT_ATTR_RE.sub("", svg)
    svg = _JS_URI_RE.sub("", svg)
    return svg


def sanitize_svg(raw: str) -> str:
    """ينضّف الـ SVG من محتوى خطر (XSS) ويضمن وجود xmlns/viewBox.
    يرجع "" لو الناتج بعد التنضيف مش SVG صالح، عشان الـ caller يستخدم fallback."""
    if not raw or "<svg" not in raw:
        return ""

    svg = _strip_dangerous_svg_content(raw.strip())

    if "<svg" not in svg:
        # كل محتوى الـ svg كان خطر وتم حذفه بالكامل
        return ""

    if "xmlns" not in svg:
        svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
    if "viewBox" not in svg:
        svg = svg.replace("<svg", '<svg viewBox="0 0 300 300"', 1)

    return svg


def fallback_svg(name: str, primary: str, secondary: str) -> str:
    """SVG بسيط وآمن 100% (مصنوع محليًا، بدون أي مدخل من الموديل) كـ fallback أخير.
    نعمل escape للاسم لأنه بييجي من المستخدم (brand_name) وممكن يحتوي على &, <, >, \" ."""
    safe_name = xml_escape((name or "Brand"))
    init = xml_escape((name or "BR")[:2].upper())
    return f"""<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="{secondary}"/>
  <circle cx="150" cy="115" r="68" fill="{primary}" opacity=".12"/>
  <circle cx="150" cy="115" r="50" fill="{primary}" opacity=".2"/>
  <circle cx="150" cy="115" r="36" fill="{primary}"/>
  <text x="150" y="127" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="{secondary}">{init}</text>
  <text x="150" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="600" fill="{primary}">{safe_name}</text>
  <rect x="80" y="218" width="140" height="1.5" fill="{primary}" opacity=".35" rx="1"/>
</svg>"""