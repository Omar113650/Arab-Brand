import asyncio

from ..hf_client import call_ai, generate_logo_image
from ..parsers import parse_json, parse_svg, sanitize_svg, fallback_svg
from ..prompts import (
    SYS_BRAND,
    SYS_LOGO_PROMPT,
    SYS_LOGO,
    SYS_SOCIAL,
    SYS_LANDING,
    SYS_BROCHURE,
    SYS_COMPETITORS,
    SYS_OBJECTIONS,
    SYS_PRODUCT_FOCUS,
    SYS_LAUNCH_PLAN,
    SYS_SWOT,
    SYS_AGE_SEGMENTS,
    SYS_BUSINESS_OVERVIEW,
    SYS_AGE_PREFERENCES,
    SYS_FAQ,
)

STYLE_MAP = {
    "modern": "عصري",
    "luxury": "فاخر",
    "youth": "شبابي",
    "minimal": "بسيط",
    "arabic": "تراثي",
    "tech": "تقني",
}

COLOR_MAP = {
    "gold": "ذهبي",
    "navy": "كحلي",
    "green": "أخضر",
    "red": "أحمر",
    "purple": "بنفسجي",
    "teal": "تيل",
    "black": "أسود",
    "coral": "مرجاني",
}


async def _call_ai_async(system_prompt: str, user_msg: str) -> str:
    return await asyncio.to_thread(call_ai, system_prompt, user_msg)


async def _safe_call(system_prompt: str, user_msg: str) -> str:
    try:
        return await _call_ai_async(system_prompt, user_msg)
    except Exception as e:
        print(f"Task failed: {e}")
        return ""


async def _safe_logo(prompt: str):
    try:
        return await asyncio.to_thread(generate_logo_image, prompt)
    except Exception as e:
        print(f"Logo generation failed: {e}")
        return None


async def _staggered(coro, delay: float):
    """بيأخر بدء المهمة بعدد ثواني معين، عشان نوزع الضغط على Groq rate limit."""
    if delay:
        await asyncio.sleep(delay)
    return await coro


async def generate_full_brand_kit(idea: str, brand_name: str | None, style: str, colors: list[str]) -> dict:
    style_name = STYLE_MAP.get(style, style)
    col_names = "، ".join(COLOR_MAP.get(c, c) for c in colors)

    base = f"""فكرة المشروع بالتفصيل: {idea}
{"اسم البراند المحدد: " + brand_name if brand_name else "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
الأسلوب البصري المطلوب: {style_name}
{"الألوان المفضلة: " + col_names if col_names else ""}
تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة."""

    # ── Phase 1: Brand Identity ──
    print("Phase 1: Generating Brand Identity...")
    brand_raw = await _call_ai_async(SYS_BRAND, base + "\nولّد Brand Kit كامل احترافي ومخصص لهذا المشروع.")
    brand = parse_json(brand_raw)
    if not brand:
        raise ValueError("فشل تحليل Brand JSON من AI")

    colors_list = brand.get("colors") or []
    primary = colors_list[0]["hex"] if len(colors_list) > 0 else "#C9973A"
    secondary = colors_list[1]["hex"] if len(colors_list) > 1 else "#13131E"
    accent = colors_list[2]["hex"] if len(colors_list) > 2 else "#FFFFFF"

    names_list = [n if isinstance(n, str) else n.get("name") for n in (brand.get("names") or [])]
    display_name = brand_name or brand.get("recommendedName") or (names_list[0] if names_list else "Brand")

    # ── Phase 2: Logo Prompt ──
    logo_prompt_raw = await _call_ai_async(
        SYS_LOGO_PROMPT,
        f"""Brand Name: {display_name}
Brand Industry/Idea: {idea[:200]}
Visual Style: {style_name}
Primary Color: {primary}
Secondary Color: {secondary}
Accent Color: {accent}
Brand Personality: {(brand.get("voice") or {}).get("tone", "professional")}
Write a tailored visual logo generation prompt. Important: ICON ONLY, absolutely NO text/letters.""",
    )
    logo_prompt = (
        logo_prompt_raw.replace("```", "")
        .strip("\"'` \n")
        .encode("ascii", "ignore")
        .decode()[:500]
        .strip()
    )

    # ── Phase 3: كل المهام بالتوازي، لكن بفاصل زمني تصاعدي عشان نتفادى Groq rate limit ──
    print("Phase 3: Launching all content tasks (staggered)...")

    strategy = brand.get("strategy") or {}
    brand_context = f"""{base}
البراند: {display_name}
الشعار والرسالة: {(brand.get("tagline") or {}).get("ar", "")}
القيمة الفريدة: {strategy.get("value", "")}
الجمهور المستهدف: {strategy.get("audience", "")}
التموضع: {strategy.get("positioning", "")}
الرسائل التسويقية: {" | ".join(brand.get("messages") or [])}"""

    (
        logo_res,
        social_raw,
        landing_raw,
        brochure_raw,
        competitors_raw,
        objections_raw,
        product_focus_raw,
        launch_plan_raw,
        swot_raw,
        age_segments_raw,
        business_overview_raw,
        age_preferences_raw,
        faq_raw,
    ) = await asyncio.gather(
        _safe_logo(logo_prompt),  # اللوجو مش بيستهلك من Groq، يبدأ فوراً
        _staggered(_safe_call(SYS_SOCIAL, f"{brand_context}\nاصنع محتوى سوشيال مميز ومخصص لهذا البراند."), 0),
        _staggered(_safe_call(SYS_LANDING, f"{brand_context}\nاصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند."), 4),
        _staggered(_safe_call(SYS_BROCHURE, f"{brand_context}\nاصنع محتوى بروشور احترافي ومخصص لهذا البراند."), 8),
        _staggered(_safe_call(
            SYS_COMPETITORS,
            f"فكرة المشروع: {idea}\nالبراند: {display_name}\nالسوق المستهدف: {strategy.get('audience', '')}\n"
            f"التموضع: {strategy.get('positioning', '')}\nحلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.",
        ), 12),
        _staggered(_safe_call(
            SYS_OBJECTIONS,
            f"{brand_context}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة لهذا البراند والمشروع تحديداً.",
        ), 16),
        _staggered(_safe_call(
            SYS_PRODUCT_FOCUS,
            f"{brand_context}\nاقترح المنتجات والخدمات الممكنة لهذا البراند وحدد الأولوية الذكية للبدء.",
        ), 20),
        _staggered(_safe_call(SYS_LAUNCH_PLAN, f"{brand_context}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند في السوق العربي."), 24),
        _staggered(_safe_call(
            SYS_SWOT,
            f"{brand_context}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح وعملي لهذا المشروع في السوق العربي.",
        ), 28),
        _staggered(_safe_call(
            SYS_AGE_SEGMENTS,
            f"{brand_context}\nقسّم السوق لشرائح عمرية مناسبة لهذا البراند وقدم استراتيجية توسع تدريجية.",
        ), 32),
        _staggered(_safe_call(
            SYS_BUSINESS_OVERVIEW,
            f"{brand_context}\nاشرح هذا البيزنس بعمق: من هو، لمين، بيحل مشاكل مين، وليه يختاروه.",
        ), 36),
        _staggered(_safe_call(
            SYS_AGE_PREFERENCES,
            f"{brand_context}\nحلل تفضيلات كل شريحة عمرية بخصوص هذا البراند وقدم توصيات عملية.",
        ), 40),
        _staggered(_safe_call(
            SYS_FAQ,
            f"{brand_context}\nاستوقع 10 أسئلة حقيقية سيطرحها العملاء وأجب عليها بصوت هذا البراند.",
        ), 44),
    )

    # ── معالجة اللوجو ──
    if logo_res:
        logo = logo_res
        logo_format = "image"
    else:
        print("FLUX skipped/failed, generating SVG fallback...")
        svg_raw = await _call_ai_async(
            SYS_LOGO,
            f"Brand Name: {display_name}\nStyle: {style_name}\nPrimary Color: {primary}\nSecondary Color: {secondary}\n"
            f"Brand Idea: {idea[:120]}\nCreate a unique minimal geometric SVG logo that reflects this brand's identity.",
        )
        parsed = parse_svg(svg_raw)
        logo = sanitize_svg(parsed) if parsed else fallback_svg(display_name, primary, secondary)
        logo_format = "svg"

    return {
        "brand": brand,
        "logo": logo,
        "logoFormat": logo_format,
        "social": parse_json(social_raw),
        "landing": parse_json(landing_raw),
        "brochureContent": parse_json(brochure_raw) or {},
        "competitors": parse_json(competitors_raw) or {},
        "objections": parse_json(objections_raw) or {},
        "productFocus": parse_json(product_focus_raw) or {},
        "launchPlan": parse_json(launch_plan_raw) or {},
        "swot": parse_json(swot_raw) or {},
        "ageSegments": parse_json(age_segments_raw) or {},
        "businessOverview": parse_json(business_overview_raw) or {},
        "agePreferences": parse_json(age_preferences_raw) or {},
        "faq": parse_json(faq_raw) or {},
    }