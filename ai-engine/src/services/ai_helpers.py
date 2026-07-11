

























# # دوال مساعدة مشتركة بين brand_kit_service و standalone_service:
# # بناء سياق موحّد وغني للـ prompts، ونداء الـ AI مع retry تلقائي لو الـ JSON فشل يتحلل،
# # وتغليف آمن للمهام اللي بتتنفذ بالتوازي في asyncio.gather.

# import asyncio
# from typing import Optional
# from ..hf_client import call_ai
# from ..parsers import parse_json

# # مهام الـ JSON الكبيرة (مصفوفات طويلة/متداخلة) محتاجة مساحة أكبر عشان الرد متتقطعش في النص
# HEAVY_TASKS_MAX_TOKENS = 6000
# DEFAULT_MAX_TOKENS = 4000

# # ── Temperature لكل مهمة حسب طبيعتها ──
# # مهام تحليلية/واقعية (منافسين، SWOT، شرائح عمرية...) محتاجة ثبات ودقة أعلى (temperature أقل)
# # عشان نقلل هلوسة الأسماء/الأرقام ونضمن استقرار النتيجة بين مرة وتانية.
# # مهام إبداعية (سوشيال ميديا، بروشور، landing) تستفيد من عشوائية أعلى عشان الناتج
# # يبقى متنوع ومش مكرر لنفس الصياغة كل مرة.
# DEFAULT_TEMPERATURE = 0.75

# TASK_TEMPERATURES: dict[str, float] = {
#     # هوية أساسية: فيها إبداع (تسمية) بس لازم تفضل متماسكة structurally
#     "brand_identity": 0.65,
#     # تحليلية / واقعية → دقة أعلى، هلوسة أقل
#     "competitors": 0.35,
#     "swot": 0.4,
#     "launch_plan": 0.45,
#     "age_segments": 0.45,
#     "age_preferences": 0.45,
#     "business_overview": 0.45,
#     "product_focus": 0.5,
#     # نصف تحليلية / نصف إقناعية
#     "objections": 0.6,
#     "faq": 0.6,
#     # إبداعية بحتة → تنوع أعلى
#     "brochure": 0.75,
#     "landing": 0.8,
#     "social": 0.85,
#     "extra_social": 0.9,
# }


# def temperature_for(task_name: str) -> float:
#     """يرجع الـ temperature المناسبة لنوع المهمة، أو الافتراضية لو المهمة مش معرّفة."""
#     return TASK_TEMPERATURES.get(task_name, DEFAULT_TEMPERATURE)


# def build_context(
#     idea: str,
#     brand_name: str,
#     audience: str = "",
#     positioning: str = "",
#     value: str = "",
#     tagline: str = "",
#     style: str = "",
#     messages: Optional[list] = None,
# ) -> str:
#     """بيبني سياق موحّد وغني قد الإمكان لكل استدعاء.
#     كل ما السياق أغنى (فيه style, tagline, value...) كل ما الناتج أدق وأخص بالبراند
#     بدل ما يرجع كلام عام."""
#     lines = [
#         f"فكرة المشروع بالتفصيل: {idea}",
#         f"اسم البراند: {brand_name}",
#     ]

#     if audience:
#         lines.append(f"الجمهور المستهدف: {audience}")

#     if positioning:
#         lines.append(f"التموضع في السوق: {positioning}")

#     if value:
#         lines.append(f"القيمة الفريدة: {value}")

#     if tagline:
#         lines.append(f"الشعار: {tagline}")

#     if style:
#         lines.append(f"الأسلوب البصري والشخصية: {style}")

#     if messages:
#         lines.append(f"الرسائل التسويقية: {' | '.join(messages)}")

#     return "\n".join(lines)


# async def call(
#     system_prompt: str,
#     user_msg: str,
#     max_tokens: int = DEFAULT_MAX_TOKENS,
#     temperature: float = DEFAULT_TEMPERATURE,
# ) -> str:
#     return await asyncio.to_thread(
#         call_ai,
#         system_prompt=system_prompt,
#         user_msg=user_msg,
#         max_tokens=max_tokens,
#         temperature=temperature,
#     )


# async def generate(
#     system_prompt: str,
#     context: str,
#     instruction: str,
#     max_tokens: int = DEFAULT_MAX_TOKENS,
#     retry_on_fail: bool = True,
#     task_name: str = "task",
#     temperature: Optional[float] = None,
# ):
#     """بينادي الـ AI ويحاول يحلل الـ JSON.
#     لو التحليل فشل (رد مقطوع أو فيه أخطاء صياغة)،
#     بيعيد المحاولة مرة واحدة فقط.

#     الـ temperature: لو متبعتش صراحةً، بتتحدد تلقائيًا حسب task_name
#     (تحليلية = أقل، إبداعية = أعلى) — شوف TASK_TEMPERATURES فوق."""

#     resolved_temperature = temperature if temperature is not None else temperature_for(task_name)

#     user_msg = f"{context}\n{instruction}"

#     raw = await call(
#         system_prompt=system_prompt,
#         user_msg=user_msg,
#         max_tokens=max_tokens,
#         temperature=resolved_temperature,
#     )

#     parsed = parse_json(raw)

#     if parsed is None and retry_on_fail:
#         print(
#             f"[_ai_helpers] '{task_name}': parse failed, retrying once with stricter instruction..."
#         )

#         strict_msg = (
#             f"{user_msg}\n\n"
#             "تنبيه مهم: ردك السابق لم يكن JSON صحيحاً بالكامل أو كان مقطوعاً. "
#             "أعد الرد الآن بصيغة JSON صحيحة ومكتملة 100% بدون أي نص أو markdown أو تعليقات إضافية."
#         )

#         # في إعادة المحاولة نستخدم temperature أقل شوية عن المهمة الأصلية (بحد أدنى منطقي)
#         # عشان نزود احتمال الالتزام الحرفي بصيغة JSON بدل التنويع الإبداعي
#         retry_temperature = max(0.2, resolved_temperature - 0.2)

#         raw_retry = await call(
#             system_prompt=system_prompt,
#             user_msg=strict_msg,
#             max_tokens=max_tokens,
#             temperature=retry_temperature,
#         )

#         parsed = parse_json(raw_retry)

#         if parsed is None:
#             print(
#                 f"[_ai_helpers] '{task_name}': retry also failed to parse."
#             )

#     return parsed


# async def safe(coro, task_name: str = "task"):
#     """بيلف أي coroutine ويرجع None لو فشلت، بدل ما تفشل كل asyncio.gather بسبب مهمة واحدة."""
#     try:
#         return await coro
#     except Exception as e:
#         print(f"[_ai_helpers] Task '{task_name}' failed: {e}")
#         return None


# async def staggered(coro, delay: float):
#     """بيأخر بدء المهمة بعدد ثواني معين، عشان نوزع الضغط على rate limit."""
#     if delay:
#         await asyncio.sleep(delay)

#     return await coro




























# دوال مساعدة مشتركة بين brand_kit_service و standalone_service:
# بناء سياق موحّد وغني للـ prompts، ونداء الـ AI مع retry تلقائي لو الـ JSON فشل يتحلل،
# وتغليف آمن للمهام اللي بتتنفذ بالتوازي في asyncio.gather.

import asyncio
from typing import Optional
from ..hf_client import call_ai
from ..parsers import parse_json

# مهام الـ JSON الكبيرة (مصفوفات طويلة/متداخلة) محتاجة مساحة أكبر عشان الرد متتقطعش في النص
HEAVY_TASKS_MAX_TOKENS = 6000
DEFAULT_MAX_TOKENS = 4000

# ── Temperature لكل مهمة حسب طبيعتها ──
# مهام تحليلية/واقعية (منافسين، SWOT، شرائح عمرية...) محتاجة ثبات ودقة أعلى (temperature أقل)
# عشان نقلل هلوسة الأسماء/الأرقام ونضمن استقرار النتيجة بين مرة وتانية.
# مهام إبداعية (سوشيال ميديا، بروشور، landing) تستفيد من عشوائية أعلى عشان الناتج
# يبقى متنوع ومش مكرر لنفس الصياغة كل مرة.
DEFAULT_TEMPERATURE = 0.75

TASK_TEMPERATURES: dict[str, float] = {
    # هوية أساسية: فيها إبداع (تسمية) بس لازم تفضل متماسكة structurally
    "brand_identity": 0.65,
    # تحليلية / واقعية → دقة أعلى، هلوسة أقل
    "competitors": 0.35,
    "swot": 0.4,
    "launch_plan": 0.45,
    "age_segments": 0.45,
    "age_preferences": 0.45,
    "business_overview": 0.45,
    "product_focus": 0.5,
    # نصف تحليلية / نصف إقناعية
    "objections": 0.6,
    "faq": 0.6,
    # إبداعية بحتة → تنوع أعلى
    "brochure": 0.75,
    "landing": 0.8,
    "social": 0.85,
    "extra_social": 0.9,
}


def temperature_for(task_name: str) -> float:
    """يرجع الـ temperature المناسبة لنوع المهمة، أو الافتراضية لو المهمة مش معرّفة."""
    return TASK_TEMPERATURES.get(task_name, DEFAULT_TEMPERATURE)


# ── موديل Groq مخصص لكل مهمة حسب مدى تعقيدها ──
# gpt-oss-20b: أسرع وأرخص بكتير ($0.075/$0.30 لكل مليون توكن) — كفاية للمهام
#   الواقعية/التحليلية/البنية الثابتة اللي مش محتاجة عمق استراتيجي كبير.
# gpt-oss-120b: الموديل الرئيسي (flagship) — للمهام اللي بتحتاج فهم أعمق للسياق
#   وربط استراتيجي (هوية البراند، البروشور، خطة الإطلاق، السوشيال/لاندينج...).
# ملاحظة: الاتنين "Production" مستقرين على Groq دلوقتي (يوليو 2026) وملهمش
# تاريخ إيقاف معلن، على عكس llama-4-scout / llama-3.3-70b-versatile.


DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_FAST_MODEL = "llama-3.1-8b-instant"
GROQ_FLAGSHIP_MODEL = "llama-3.3-70b-versatile"



TASK_MODELS: dict[str, str] = {
    # مهام بسيطة/واقعية/بنية ثابتة نسبيًا → الموديل الأسرع والأرخص
    "competitors": GROQ_FAST_MODEL,
    "objections": GROQ_FAST_MODEL,
    "faq": GROQ_FAST_MODEL,
    "product_focus": GROQ_FAST_MODEL,
    "age_preferences": GROQ_FAST_MODEL,
    "age_segments": GROQ_FAST_MODEL,
    # مهام استراتيجية/إبداعية أعمق → الموديل الرئيسي
    "brand_identity": GROQ_FLAGSHIP_MODEL,
    "social": GROQ_FLAGSHIP_MODEL,
    "landing": GROQ_FLAGSHIP_MODEL,
    "brochure": GROQ_FLAGSHIP_MODEL,
    "launch_plan": GROQ_FLAGSHIP_MODEL,
    "swot": GROQ_FLAGSHIP_MODEL,
    "business_overview": GROQ_FLAGSHIP_MODEL,
    "extra_social": GROQ_FLAGSHIP_MODEL,
    # الشعار: موديل مخصص لوحده (طلب صريح) — الدقة هنا مهمة لأن أي غموض في
    # الوصف بيتترجم لشعار ضعيف أو SVG مكسور، فبناخد الموديل الرئيسي
    "logo_prompt": GROQ_FLAGSHIP_MODEL,
    "logo_svg": GROQ_FLAGSHIP_MODEL,
}


def model_for(task_name: str) -> str:
    """يرجع موديل Groq المناسب لنوع المهمة، أو الافتراضي (flagship) لو المهمة مش معرّفة."""
    return TASK_MODELS.get(task_name, DEFAULT_GROQ_MODEL)


def build_context(
    idea: str,
    brand_name: str,
    audience: str = "",
    positioning: str = "",
    value: str = "",
    tagline: str = "",
    style: str = "",
    messages: Optional[list] = None,
) -> str:
    """بيبني سياق موحّد وغني قد الإمكان لكل استدعاء.
    كل ما السياق أغنى (فيه style, tagline, value...) كل ما الناتج أدق وأخص بالبراند
    بدل ما يرجع كلام عام."""
    lines = [
        f"فكرة المشروع بالتفصيل: {idea}",
        f"اسم البراند: {brand_name}",
    ]

    if audience:
        lines.append(f"الجمهور المستهدف: {audience}")

    if positioning:
        lines.append(f"التموضع في السوق: {positioning}")

    if value:
        lines.append(f"القيمة الفريدة: {value}")

    if tagline:
        lines.append(f"الشعار: {tagline}")

    if style:
        lines.append(f"الأسلوب البصري والشخصية: {style}")

    if messages:
        lines.append(f"الرسائل التسويقية: {' | '.join(messages)}")

    return "\n".join(lines)


async def call(
    system_prompt: str,
    user_msg: str,
    max_tokens: int = DEFAULT_MAX_TOKENS,
    temperature: float = DEFAULT_TEMPERATURE,
    groq_model: Optional[str] = None,
) -> str:
    return await asyncio.to_thread(
        call_ai,
        system_prompt=system_prompt,
        user_msg=user_msg,
        max_tokens=max_tokens,
        temperature=temperature,
        groq_model=groq_model,
    )


async def generate(
    system_prompt: str,
    context: str,
    instruction: str,
    max_tokens: int = DEFAULT_MAX_TOKENS,
    retry_on_fail: bool = True,
    task_name: str = "task",
    temperature: Optional[float] = None,
    groq_model: Optional[str] = None,
):
    """بينادي الـ AI ويحاول يحلل الـ JSON.
    لو التحليل فشل (رد مقطوع أو فيه أخطاء صياغة)،
    بيعيد المحاولة مرة واحدة فقط.

    - temperature: لو متبعتش صراحةً، بتتحدد تلقائيًا حسب task_name
      (تحليلية = أقل، إبداعية = أعلى) — شوف TASK_TEMPERATURES فوق.
    - groq_model: لو متبعتش صراحةً، بيتحدد تلقائيًا حسب task_name
      (بسيط = gpt-oss-20b، معقد = gpt-oss-120b) — شوف TASK_MODELS فوق."""

    resolved_temperature = temperature if temperature is not None else temperature_for(task_name)
    resolved_groq_model = groq_model if groq_model is not None else model_for(task_name)

    user_msg = f"{context}\n{instruction}"

    raw = await call(
        system_prompt=system_prompt,
        user_msg=user_msg,
        max_tokens=max_tokens,
        temperature=resolved_temperature,
        groq_model=resolved_groq_model,
    )

    parsed = parse_json(raw)

    if parsed is None and retry_on_fail:
        print(
            f"[_ai_helpers] '{task_name}': parse failed, retrying once with stricter instruction..."
        )

        strict_msg = (
            f"{user_msg}\n\n"
            "تنبيه مهم: ردك السابق لم يكن JSON صحيحاً بالكامل أو كان مقطوعاً. "
            "أعد الرد الآن بصيغة JSON صحيحة ومكتملة 100% بدون أي نص أو markdown أو تعليقات إضافية."
        )

        # في إعادة المحاولة نستخدم temperature أقل شوية عن المهمة الأصلية (بحد أدنى منطقي)
        # عشان نزود احتمال الالتزام الحرفي بصيغة JSON بدل التنويع الإبداعي.
        # الموديل بيفضل نفسه في إعادة المحاولة (مفيش داعي نغيره).
        retry_temperature = max(0.2, resolved_temperature - 0.2)

        raw_retry = await call(
            system_prompt=system_prompt,
            user_msg=strict_msg,
            max_tokens=max_tokens,
            temperature=retry_temperature,
            groq_model=resolved_groq_model,
        )

        parsed = parse_json(raw_retry)

        if parsed is None:
            print(
                f"[_ai_helpers] '{task_name}': retry also failed to parse."
            )

    return parsed


async def safe(coro, task_name: str = "task"):
    """بيلف أي coroutine ويرجع None لو فشلت، بدل ما تفشل كل asyncio.gather بسبب مهمة واحدة."""
    try:
        return await coro
    except Exception as e:
        print(f"[_ai_helpers] Task '{task_name}' failed: {e}")
        return None


async def staggered(coro, delay: float):
    """بيأخر بدء المهمة بعدد ثواني معين، عشان نوزع الضغط على rate limit."""
    if delay:
        await asyncio.sleep(delay)

    return await coro