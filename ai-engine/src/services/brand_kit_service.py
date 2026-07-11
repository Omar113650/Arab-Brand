

























# import asyncio
# from typing import Optional
# from ..hf_client import generate_logo_image
# from ..parsers import parse_svg, sanitize_svg, fallback_svg
# from ..prompts import SYS_BRAND, SYS_LOGO_PROMPT, SYS_LOGO, SYS_SOCIAL, SYS_LANDING
# from . import standalone_service as ss
# from .ai_helpers import build_context, generate, safe, staggered, call

# STYLE_MAP = {
#     "modern": "عصري",
#     "luxury": "فاخر",
#     "youth": "شبابي",
#     "minimal": "بسيط",
#     "arabic": "تراثي",
#     "tech": "تقني",
# }

# COLOR_MAP = {
#     "gold": "ذهبي",
#     "navy": "كحلي",
#     "green": "أخضر",
#     "red": "أحمر",
#     "purple": "بنفسجي",
#     "teal": "تيل",
#     "black": "أسود",
#     "coral": "مرجاني",
# }

# # Brand Identity الأساسي فيه أسماء + ألوان + رسائل + قصة + استراتيجية... schema كبير نسبياً
# BRAND_IDENTITY_MAX_TOKENS = 6000


# async def _safe_logo(prompt: str):
#     try:
#         return await asyncio.to_thread(generate_logo_image, prompt)
#     except Exception as e:
#         print(f"[brand_kit_service] Logo generation failed: {e}")
#         return None


# async def generate_full_brand_kit(
#     idea: str,
#     brand_name: Optional[str],
#     style: str,
#     colors: list[str],
#     lang: str = "ar",
# ) -> dict:
#     style_name = STYLE_MAP.get(style, style)
#     col_names = "، ".join(COLOR_MAP.get(c, c) for c in colors)

#     base = f"""فكرة المشروع بالتفصيل: {idea}
# {"اسم البراند المحدد: " + brand_name if brand_name else "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
# الأسلوب البصري المطلوب: {style_name}
# {"الألوان المفضلة: " + col_names if col_names else ""}
# تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة."""

#     # ── Phase 1: Brand Identity ──
#     print("Phase 1: Generating Brand Identity...")
#     brand = await generate(
#         SYS_BRAND(lang),
#         base,
#         "ولّد Brand Kit كامل احترافي ومخصص لهذا المشروع.",
#         max_tokens=BRAND_IDENTITY_MAX_TOKENS,
#         task_name="brand_identity",
#     )
#     if not brand:
#         raise ValueError("فشل تحليل Brand JSON من AI")

#     colors_list = brand.get("colors") or []
#     primary = colors_list[0]["hex"] if len(colors_list) > 0 else "#C9973A"
#     secondary = colors_list[1]["hex"] if len(colors_list) > 1 else "#13131E"
#     accent = colors_list[2]["hex"] if len(colors_list) > 2 else "#FFFFFF"

#     names_list = [n if isinstance(n, str) else n.get("name") for n in (brand.get("names") or [])]
#     display_name = brand_name or brand.get("recommendedName") or (names_list[0] if names_list else "Brand")

#     # ── Phase 2: Logo Prompt ──
#     # ملاحظة: SYS_LOGO_PROMPT و SYS_LOGO ثابتين (strings) مش دوال، فمينفعش نضيف لهم ()
#     logo_prompt_raw = await call(
#         SYS_LOGO_PROMPT,
#         f"""Brand Name: {display_name}
# Brand Industry/Idea: {idea[:200]}
# Visual Style: {style_name}
# Primary Color: {primary}
# Secondary Color: {secondary}
# Accent Color: {accent}
# Brand Personality: {(brand.get("voice") or {}).get("tone", "professional")}
# Write a tailored visual logo generation prompt. Important: ICON ONLY, absolutely NO text/letters.""",
#     )
#     logo_prompt = (
#         logo_prompt_raw.replace("```", "")
#         .strip("\"'` \n")
#         .encode("ascii", "ignore")
#         .decode()[:500]
#         .strip()
#     )

#     # ── Phase 3: كل المهام بالتوازي، بفاصل زمني تصاعدي عشان نتفادى rate limit ──
#     print("Phase 3: Launching all content tasks (staggered)...")

#     strategy = brand.get("strategy") or {}
#     tagline = (brand.get("tagline") or {}).get("ar", "")
#     audience = strategy.get("audience", "")
#     positioning = strategy.get("positioning", "")
#     value = strategy.get("value", "")
#     messages = brand.get("messages") or []

#     # نفس السياق الغني بيتبعت لكل المهام (بما فيها social/landing اللي مخصوصين هنا)
#     brand_context = build_context(
#         idea, display_name, audience=audience, positioning=positioning,
#         value=value, tagline=tagline, style=style_name, messages=messages,
#     )

#     (
#         logo_res,
#         social,
#         landing,
#         brochure,
#         competitors,
#         objections,
#         product_focus,
#         launch_plan,
#         swot,
#         age_segments,
#         business_overview,
#         age_preferences,
#         faq,
#     ) = await asyncio.gather(
#         _safe_logo(logo_prompt),  # اللوجو مش بيستهلك من Groq، يبدأ فوراً
#         staggered(safe(
#             generate(SYS_SOCIAL(lang), brand_context, "اصنع محتوى سوشيال مميز ومخصص لهذا البراند.", task_name="social"),
#             "social",
#         ), 0),
#         staggered(safe(
#             generate(SYS_LANDING(lang), brand_context, "اصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.", task_name="landing"),
#             "landing",
#         ), 4),
#         staggered(safe(ss.generate_brochure_only(idea, display_name, tagline, value, audience, messages, style_name, lang), "brochure"), 8),
#         staggered(safe(ss.generate_competitors_only(idea, display_name, audience, positioning, style_name, lang), "competitors"), 12),
#         staggered(safe(ss.generate_objections_only(idea, display_name, audience, value, positioning, style_name, lang), "objections"), 16),
#         staggered(safe(ss.generate_product_focus_only(idea, display_name, audience, value, style_name, lang), "product_focus"), 20),
#         staggered(safe(ss.generate_launch_plan_only(idea, display_name, audience, value, positioning, tagline, style_name, lang), "launch_plan"), 24),
#         staggered(safe(ss.generate_swot_only(idea, display_name, audience, value, positioning, style_name, lang), "swot"), 28),
#         staggered(safe(ss.generate_age_segments_only(idea, display_name, audience, positioning, value, style_name, lang), "age_segments"), 32),
#         staggered(safe(ss.generate_business_overview_only(idea, display_name, audience, positioning, value, tagline, style_name, lang), "business_overview"), 36),
#         staggered(safe(ss.generate_age_preferences_only(idea, display_name, audience, positioning, value, style_name, lang), "age_preferences"), 40),
#         staggered(safe(ss.generate_faq_only(idea, display_name, audience, value, positioning, tagline, style_name, lang), "faq"), 44),
#     )

#     # ── معالجة اللوجو ──
#     if logo_res:
#         logo = logo_res
#         logo_format = "image"
#     else:
#         print("FLUX skipped/failed, generating SVG fallback...")
#         svg_raw = await call(
#             SYS_LOGO,
#             f"Brand Name: {display_name}\nStyle: {style_name}\nPrimary Color: {primary}\nSecondary Color: {secondary}\n"
#             f"Brand Idea: {idea[:120]}\nCreate a unique minimal geometric SVG logo that reflects this brand's identity.",
#         )
#         parsed_svg = parse_svg(svg_raw)
#         logo = sanitize_svg(parsed_svg) if parsed_svg else fallback_svg(display_name, primary, secondary)
#         logo_format = "svg"

#     return {
#         "brand": brand,
#         "logo": logo,
#         "logoFormat": logo_format,
#         "social": social or {},
#         "landing": landing or {},
#         "brochureContent": brochure or {},
#         "competitors": competitors or {},
#         "objections": objections or {},
#         "productFocus": product_focus or {},
#         "launchPlan": launch_plan or {},
#         "swot": swot or {},
#         "ageSegments": age_segments or {},
#         "businessOverview": business_overview or {},
#         "agePreferences": age_preferences or {},
#         "faq": faq or {},
#     }





























import asyncio
from typing import Optional
from ..hf_client import generate_logo_image
from ..parsers import parse_svg, sanitize_svg, fallback_svg
from ..prompts import SYS_BRAND, SYS_LOGO_PROMPT, SYS_LOGO, SYS_SOCIAL, SYS_LANDING
from . import standalone_service as ss
from .ai_helpers import build_context, generate, safe, staggered, call, model_for

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

# Brand Identity الأساسي فيه أسماء + ألوان + رسائل + قصة + استراتيجية... schema كبير نسبياً
BRAND_IDENTITY_MAX_TOKENS = 6000


async def _safe_logo(prompt: str):
    try:
        return await asyncio.to_thread(generate_logo_image, prompt)
    except Exception as e:
        print(f"[brand_kit_service] Logo generation failed: {e}")
        return None


async def generate_full_brand_kit(
    idea: str,
    brand_name: Optional[str],
    style: str,
    colors: list[str],
    lang: str = "ar",
) -> dict:
    style_name = STYLE_MAP.get(style, style)
    col_names = "، ".join(COLOR_MAP.get(c, c) for c in colors)

    base = f"""فكرة المشروع بالتفصيل: {idea}
{"اسم البراند المحدد: " + brand_name if brand_name else "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
الأسلوب البصري المطلوب: {style_name}
{"الألوان المفضلة: " + col_names if col_names else ""}
تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة."""

    # ── Phase 1: Brand Identity ──
    print("Phase 1: Generating Brand Identity...")
    brand = await generate(
        SYS_BRAND(lang),
        base,
        "ولّد Brand Kit كامل احترافي ومخصص لهذا المشروع.",
        max_tokens=BRAND_IDENTITY_MAX_TOKENS,
        task_name="brand_identity",
    )
    if not brand:
        raise ValueError("فشل تحليل Brand JSON من AI")

    colors_list = brand.get("colors") or []
    primary = colors_list[0]["hex"] if len(colors_list) > 0 else "#C9973A"
    secondary = colors_list[1]["hex"] if len(colors_list) > 1 else "#13131E"
    accent = colors_list[2]["hex"] if len(colors_list) > 2 else "#FFFFFF"

    names_list = [n if isinstance(n, str) else n.get("name") for n in (brand.get("names") or [])]
    display_name = brand_name or brand.get("recommendedName") or (names_list[0] if names_list else "Brand")

    # ── Phase 2: Logo Prompt ──
    # ملاحظة: SYS_LOGO_PROMPT و SYS_LOGO ثابتين (strings) مش دوال، فمينفعش نضيف لهم ()
    logo_prompt_raw = await call(
        SYS_LOGO_PROMPT,
        f"""Brand Name: {display_name}
Brand Industry/Idea: {idea[:200]}
Visual Style: {style_name}
Primary Color: {primary}
Secondary Color: {secondary}
Accent Color: {accent}
Brand Personality: {(brand.get("voice") or {}).get("tone", "professional")}
Write a tailored visual logo generation prompt. Important: ICON ONLY, absolutely NO text/letters.""",
        groq_model=model_for("logo_prompt"),
    )
    logo_prompt = (
        logo_prompt_raw.replace("```", "")
        .strip("\"'` \n")
        .encode("ascii", "ignore")
        .decode()[:500]
        .strip()
    )

    # ── Phase 3: كل المهام بالتوازي، بفاصل زمني تصاعدي عشان نتفادى rate limit ──
    print("Phase 3: Launching all content tasks (staggered)...")

    strategy = brand.get("strategy") or {}
    tagline = (brand.get("tagline") or {}).get("ar", "")
    audience = strategy.get("audience", "")
    positioning = strategy.get("positioning", "")
    value = strategy.get("value", "")
    messages = brand.get("messages") or []

    # نفس السياق الغني بيتبعت لكل المهام (بما فيها social/landing اللي مخصوصين هنا)
    brand_context = build_context(
        idea, display_name, audience=audience, positioning=positioning,
        value=value, tagline=tagline, style=style_name, messages=messages,
    )

    (
        logo_res,
        social,
        landing,
        brochure,
        competitors,
        objections,
        product_focus,
        launch_plan,
        swot,
        age_segments,
        business_overview,
        age_preferences,
        faq,
    ) = await asyncio.gather(
        _safe_logo(logo_prompt),  # اللوجو مش بيستهلك من Groq، يبدأ فوراً
        staggered(safe(
            generate(SYS_SOCIAL(lang), brand_context, "اصنع محتوى سوشيال مميز ومخصص لهذا البراند.", task_name="social"),
            "social",
        ), 0),
        staggered(safe(
            generate(SYS_LANDING(lang), brand_context, "اصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.", task_name="landing"),
            "landing",
        ), 4),
        staggered(safe(ss.generate_brochure_only(idea, display_name, tagline, value, audience, messages, style_name, lang), "brochure"), 8),
        staggered(safe(ss.generate_competitors_only(idea, display_name, audience, positioning, style_name, lang), "competitors"), 12),
        staggered(safe(ss.generate_objections_only(idea, display_name, audience, value, positioning, style_name, lang), "objections"), 16),
        staggered(safe(ss.generate_product_focus_only(idea, display_name, audience, value, style_name, lang), "product_focus"), 20),
        staggered(safe(ss.generate_launch_plan_only(idea, display_name, audience, value, positioning, tagline, style_name, lang), "launch_plan"), 24),
        staggered(safe(ss.generate_swot_only(idea, display_name, audience, value, positioning, style_name, lang), "swot"), 28),
        staggered(safe(ss.generate_age_segments_only(idea, display_name, audience, positioning, value, style_name, lang), "age_segments"), 32),
        staggered(safe(ss.generate_business_overview_only(idea, display_name, audience, positioning, value, tagline, style_name, lang), "business_overview"), 36),
        staggered(safe(ss.generate_age_preferences_only(idea, display_name, audience, positioning, value, style_name, lang), "age_preferences"), 40),
        staggered(safe(ss.generate_faq_only(idea, display_name, audience, value, positioning, tagline, style_name, lang), "faq"), 44),
    )

    # ── معالجة اللوجو ──
    if logo_res:
        logo = logo_res
        logo_format = "image"
    else:
        print("FLUX skipped/failed, generating SVG fallback...")
        svg_raw = await call(
            SYS_LOGO,
            f"Brand Name: {display_name}\nStyle: {style_name}\nPrimary Color: {primary}\nSecondary Color: {secondary}\n"
            f"Brand Idea: {idea[:120]}\nCreate a unique minimal geometric SVG logo that reflects this brand's identity.",
            groq_model=model_for("logo_svg"),
        )
        parsed_svg = parse_svg(svg_raw)
        logo = sanitize_svg(parsed_svg) if parsed_svg else fallback_svg(display_name, primary, secondary)
        logo_format = "svg"

    return {
        "brand": brand,
        "logo": logo,
        "logoFormat": logo_format,
        "social": social or {},
        "landing": landing or {},
        "brochureContent": brochure or {},
        "competitors": competitors or {},
        "objections": objections or {},
        "productFocus": product_focus or {},
        "launchPlan": launch_plan or {},
        "swot": swot or {},
        "ageSegments": age_segments or {},
        "businessOverview": business_overview or {},
        "agePreferences": age_preferences or {},
        "faq": faq or {},
    }