
# توليد كل جزء لوحده (standalone) - بيستخدم _ai_helpers المشترك مع brand_kit_service
# عشان نتجنب تكرار منطق بناء السياق والـ retry في مكانين.

from .ai_helpers import build_context, generate, HEAVY_TASKS_MAX_TOKENS
from ..prompts import (
    SYS_COMPETITORS,
    SYS_BROCHURE,
    SYS_OBJECTIONS,
    SYS_PRODUCT_FOCUS,
    SYS_LAUNCH_PLAN,
    SYS_SWOT,
    SYS_AGE_SEGMENTS,
    SYS_BUSINESS_OVERVIEW,
    SYS_AGE_PREFERENCES,
    SYS_FAQ,
    SYS_EXTRA_SOCIAL,
)


async def generate_competitors_only(idea, brand_name, audience, positioning, style="", lang="ar"):
    context = build_context(idea, brand_name, audience=audience, positioning=positioning, style=style)
    return await generate(
        SYS_COMPETITORS(lang),
        context,
        "حلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.",
        task_name="competitors",
    )


async def generate_brochure_only(idea, brand_name, tagline, value, audience, messages, style, lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, value=value, tagline=tagline, style=style, messages=messages
    )
    return await generate(
        SYS_BROCHURE(lang),
        context,
        "اصنع محتوى بروشور احترافي ومخصص لهذا البراند.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="brochure",
    )


async def generate_objections_only(idea, brand_name, audience, value, positioning, style="", lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, style=style
    )
    return await generate(
        SYS_OBJECTIONS(lang),
        context,
        "اصنع ردود احترافية على اعتراضات العملاء المتوقعة.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="objections",
    )


async def generate_product_focus_only(idea, brand_name, audience, value, style, lang="ar"):
    context = build_context(idea, brand_name, audience=audience, value=value, style=style)
    return await generate(
        SYS_PRODUCT_FOCUS(lang),
        context,
        "اقترح المنتجات والخدمات الممكنة وحدد الأولوية الذكية للبدء.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="product_focus",
    )


async def generate_launch_plan_only(idea, brand_name, audience, value, positioning, tagline, style="", lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, tagline=tagline, style=style
    )
    return await generate(
        SYS_LAUNCH_PLAN(lang),
        context,
        "ضع خطة إطلاق تفصيلية وعملية لهذا البراند.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="launch_plan",
    )


async def generate_swot_only(idea, brand_name, audience, value, positioning, style="", lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, style=style
    )
    return await generate(
        SYS_SWOT(lang),
        context,
        "قدم تحليل SWOT شامل وتحليل مخاطر صريح لهذا المشروع في السوق العربي.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="swot",
    )


async def generate_age_segments_only(idea, brand_name, audience, positioning, value, style, lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, style=style
    )
    return await generate(
        SYS_AGE_SEGMENTS(lang),
        context,
        "قسّم السوق لشرائح عمرية مناسبة وقدم استراتيجية توسع تدريجية.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="age_segments",
    )


async def generate_business_overview_only(idea, brand_name, audience, positioning, value, tagline, style="", lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, tagline=tagline, style=style
    )
    return await generate(
        SYS_BUSINESS_OVERVIEW(lang),
        context,
        "اشرح هذا البيزنس بعمق: من هو، لمين، بيحل مشاكل مين، وليه يختاروه.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="business_overview",
    )


async def generate_age_preferences_only(idea, brand_name, audience, positioning, value, style, lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, style=style
    )
    return await generate(
        SYS_AGE_PREFERENCES(lang),
        context,
        "حلل تفضيلات كل شريحة عمرية وقدم توصيات عملية ومخصصة.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="age_preferences",
    )


async def generate_faq_only(idea, brand_name, audience, value, positioning, tagline, style="", lang="ar"):
    context = build_context(
        idea, brand_name, audience=audience, positioning=positioning, value=value, tagline=tagline, style=style
    )
    return await generate(
        SYS_FAQ(lang),
        context,
        "اكتب 10 أسئلة شائعة حقيقية وأجب عليها بصوت هذا البراند.",
        max_tokens=HEAVY_TASKS_MAX_TOKENS,
        task_name="faq",
    )


async def generate_extra_social_content(idea, brand_name, style, tagline, audience, value, lang="ar"):
    context = build_context(idea, brand_name, audience=audience, value=value, tagline=tagline, style=style)
    parsed = (
        await generate(
            SYS_EXTRA_SOCIAL(lang),
            context,
            "ولّد محتوى سوشيال جديد وإبداعي مختلف تماماً عن أي منشورات سابقة.",
            task_name="extra_social",
        )
        or {}
    )
    return {
        "postIdeas": parsed.get("postIdeas", []),
        "videoIdeas": parsed.get("videoIdeas", []),
        "instagram": parsed.get("instagram", []),
        "twitter": parsed.get("twitter", []),
    }