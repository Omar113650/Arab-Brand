# توليد كل جزء 





import asyncio
from ..hf_client import call_ai
from ..parsers import parse_json
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


async def _call(system_prompt: str, user_msg: str) -> str:
    return await asyncio.to_thread(call_ai, system_prompt, user_msg)


async def generate_competitors_only(idea, brand_name, audience, positioning):
    raw = await _call(
        SYS_COMPETITORS,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالسوق المستهدف: {audience}\nالتموضع: {positioning}\n"
        f"حلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.",
    )
    return parse_json(raw)


async def generate_brochure_only(idea, brand_name, tagline, value, audience, messages, style):
    raw = await _call(
        SYS_BROCHURE,
        f"فكرة المشروع بالتفصيل: {idea}\nاسم البراند: {brand_name}\nالشعار: {tagline}\nالقيمة الفريدة: {value}\n"
        f"الجمهور: {audience}\nالرسائل التسويقية: {' | '.join(messages or [])}\nالأسلوب البصري: {style}\n"
        f"اصنع محتوى بروشور احترافي ومخصص لهذا البراند.",
    )
    return parse_json(raw)


async def generate_objections_only(idea, brand_name, audience, value, positioning):
    raw = await _call(
        SYS_OBJECTIONS,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالجمهور المستهدف: {audience}\nالقيمة الفريدة: {value}\n"
        f"التموضع: {positioning}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة.",
    )
    return parse_json(raw)


async def generate_product_focus_only(idea, brand_name, audience, value, style):
    raw = await _call(
        SYS_PRODUCT_FOCUS,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالجمهور المستهدف: {audience}\nالقيمة الفريدة: {value}\n"
        f"الأسلوب: {style}\nاقترح المنتجات والخدمات الممكنة وحدد الأولوية الذكية.",
    )
    return parse_json(raw)


async def generate_launch_plan_only(idea, brand_name, audience, value, positioning, tagline):
    raw = await _call(
        SYS_LAUNCH_PLAN,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالجمهور المستهدف: {audience}\nالقيمة الفريدة: {value}\n"
        f"التموضع: {positioning}\nالشعار: {tagline}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند.",
    )
    return parse_json(raw)


async def generate_swot_only(idea, brand_name, audience, value, positioning):
    raw = await _call(
        SYS_SWOT,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالجمهور المستهدف: {audience}\nالقيمة الفريدة: {value}\n"
        f"التموضع: {positioning}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح لهذا المشروع في السوق العربي.",
    )
    return parse_json(raw)


async def generate_age_segments_only(idea, brand_name, audience, positioning, value, style):
    raw = await _call(
        SYS_AGE_SEGMENTS,
        f"فكرة المشروع بالتفصيل: {idea}\nاسم البراند: {brand_name}\nالجمهور المستهدف الحالي: {audience}\n"
        f"التموضع في السوق: {positioning}\nالقيمة الفريدة: {value}\nالأسلوب البصري والشخصية: {style}\n"
        f"قسّم السوق لشرائح عمرية مناسبة وقدم استراتيجية توسع تدريجية.",
    )
    return parse_json(raw)


async def generate_business_overview_only(idea, brand_name, audience, positioning, value, tagline):
    raw = await _call(
        SYS_BUSINESS_OVERVIEW,
        f"فكرة المشروع بالتفصيل: {idea}\nاسم البراند: {brand_name}\nالجمهور المستهدف: {audience}\n"
        f"التموضع: {positioning}\nالقيمة الفريدة: {value}\nالشعار: {tagline}\n"
        f"اشرح هذا البيزنس بعمق: من هو، لمين، بيحل مشاكل مين، وليه يختاروه.",
    )
    return parse_json(raw)


async def generate_age_preferences_only(idea, brand_name, audience, positioning, value, style):
    raw = await _call(
        SYS_AGE_PREFERENCES,
        f"فكرة المشروع بالتفصيل: {idea}\nاسم البراند: {brand_name}\nالجمهور المستهدف الحالي: {audience}\n"
        f"التموضع في السوق: {positioning}\nالقيمة الفريدة: {value}\nالأسلوب البصري والشخصية: {style}\n"
        f"حلل تفضيلات كل شريحة عمرية وقدم توصيات عملية ومخصصة.",
    )
    return parse_json(raw)


async def generate_faq_only(idea, brand_name, audience, value, positioning, tagline):
    raw = await _call(
        SYS_FAQ,
        f"فكرة المشروع بالتفصيل: {idea}\nاسم البراند: {brand_name}\nالجمهور المستهدف: {audience}\n"
        f"القيمة الفريدة: {value}\nالتموضع: {positioning}\nالشعار: {tagline}\n"
        f"اكتب 10 أسئلة شائعة حقيقية وأجب عليها بصوت هذا البراند.",
    )
    return parse_json(raw)


async def generate_extra_social_content(idea, brand_name, style, tagline, audience, value):
    raw = await _call(
        SYS_EXTRA_SOCIAL,
        f"فكرة المشروع: {idea}\nالبراند: {brand_name}\nالشعار: {tagline}\nالجمهور: {audience}\n"
        f"القيمة الفريدة: {value}\nالأسلوب: {style}\nولّد محتوى سوشيال جديد وإبداعي مختلف تماماً عن أي منشورات سابقة.",
    )
    parsed = parse_json(raw) or {}
    return {
        "postIdeas": parsed.get("postIdeas", []),
        "videoIdeas": parsed.get("videoIdeas", []),
        "instagram": parsed.get("instagram", []),
        "twitter": parsed.get("twitter", []),
    }
