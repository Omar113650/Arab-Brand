import json
import re
from typing import Optional
from json_repair import repair_json

def parse_json(raw: str):
    """يشيل code fences ويطلع أول object/array صالح من رد الموديل، ويصلح الأخطاء البسيطة تلقائيًا."""
    try:
        if not raw:
            return None
        clean = re.sub(r"```json\n?", "", raw)
        clean = re.sub(r"```\n?", "", clean).strip()
        match = re.search(r"[{\[]", clean)
        if not match:
            return None

        candidate = clean[match.start():]

        # المحاولة الأولى: parsing عادي (بيوقف عند أول JSON صحيح)
        try:
            decoder = json.JSONDecoder()
            obj, _ = decoder.raw_decode(candidate)
            return obj
        except json.JSONDecodeError as e:
            print(f"Initial parse failed, trying auto-repair: {e}")

        # المحاولة الثانية: تصليح تلقائي للأخطاء الشائعة (فاصلة ناقصة، quotes غلط...)
        repaired = repair_json(candidate)
        return json.loads(repaired)

    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected parse_json error: {e}")
        return None




def parse_svg(raw: str) -> Optional[str]:
    if not raw:
        return None
    clean = raw
    for fence in ("```xml", "```html", "```svg", "```"):
        clean = clean.replace(fence, "")
    clean = clean.strip()
    idx = clean.find("<svg")
    return clean[idx:].strip() if idx >= 0 else None







def sanitize_svg(raw: str) -> str:
    if not raw or "<svg" not in raw:
        return ""
    svg = raw.strip()
    if "xmlns" not in svg:
        svg = svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"', 1)
    if "viewBox" not in svg:
        svg = svg.replace("<svg", '<svg viewBox="0 0 300 300"', 1)
    return svg


def fallback_svg(name: str, primary: str, secondary: str) -> str:
    init = (name or "BR")[:2].upper()
    return f"""<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="{secondary}"/>
  <circle cx="150" cy="115" r="68" fill="{primary}" opacity=".12"/>
  <circle cx="150" cy="115" r="50" fill="{primary}" opacity=".2"/>
  <circle cx="150" cy="115" r="36" fill="{primary}"/>
  <text x="150" y="127" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="{secondary}">{init}</text>
  <text x="150" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="600" fill="{primary}">{name}</text>
  <rect x="80" y="218" width="140" height="1.5" fill="{primary}" opacity=".35" rx="1"/>
</svg>"""
