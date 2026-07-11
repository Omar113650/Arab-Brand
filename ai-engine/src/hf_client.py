


# # "العقل" اللي بيتكلم مع كل خدمات الـ AI (Groq + Hugging Face)

# import base64
# import io
# import time
# import urllib.parse
# from typing import Optional
# import httpx
# from groq import Groq
# from huggingface_hub import InferenceClient

# from .config import HF_TOKEN, GROQ_API_KEY, DEFAULT_TEXT_MODEL, LOGO_IMAGE_MODEL

# # timeout افتراضي (ثواني) لأي نداء لـ Groq/HF عشان الطلب ميفضلش معلّق لو الخدمة الخارجية تعلقت
# REQUEST_TIMEOUT = 45

# hf_client = InferenceClient(token=HF_TOKEN, timeout=REQUEST_TIMEOUT)
# groq_client = Groq(api_key=GROQ_API_KEY, timeout=REQUEST_TIMEOUT)

# # GROQ_TEXT_MODEL = "llama-3.3-70b-versatile"
# GROQ_TEXT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

# DEFAULT_TEMPERATURE = 0.75


# def call_ai(
#     system_prompt: str,
#     user_msg: str,
#     *,
#     max_tokens: int = 4000,
#     retries: int = 3,
#     model: str | None = None,
#     temperature: float = DEFAULT_TEMPERATURE,
# ) -> str:
#     """
#     بينادي Groq (مجاني وسريع) للنص،
#     ولو فشل يعمل Fallback إلى Hugging Face.

#     الـ temperature قابلة للتخصيص عشان مهام مختلفة تحتاج ثبات مختلف
#     (تحليلية = temperature أقل، إبداعية = أعلى) — القيمة الافتراضية 0.75
#     لو محدش حددها.
#     """
#     if not isinstance(system_prompt, str):
#         raise TypeError(
#             f"[call_ai] system_prompt المفروض يكون str لكنه جاء كـ "
#             f"{type(system_prompt)!r} -> value: {system_prompt!r}"
#         )
#     if not isinstance(user_msg, str):
#         raise TypeError(
#             f"[call_ai] user_msg المفروض يكون str لكنه جاء كـ "
#             f"{type(user_msg)!r} -> value: {user_msg!r}"
#         )

#     last_err = None

#     for attempt in range(retries):
#         try:
#             completion = groq_client.chat.completions.create(
#                 model=GROQ_TEXT_MODEL,
#                 messages=[
#                     {"role": "system", "content": system_prompt},
#                     {"role": "user", "content": user_msg},
#                 ],
#                 temperature=temperature,
#                 max_tokens=max_tokens,
#             )
#             return completion.choices[0].message.content or ""

#         except Exception as err:
#             last_err = err

#             msg = str(err).lower()
#             is_rate_limit = (
#                 "429" in msg
#                 or "rate limit" in msg
#                 or "too many requests" in msg
#             )

#             if is_rate_limit and attempt < retries - 1:
#                 wait = (attempt + 1) * 10
#                 print(f"Waiting {wait}s before retry...")
#                 time.sleep(wait)
#                 continue

#             print(f"Groq failed ({err}), trying HuggingFace...")
#             break

#     hf_model = model or DEFAULT_TEXT_MODEL

#     try:
#         completion = hf_client.chat.completions.create(
#             model=hf_model,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_msg},
#             ],
#             temperature=temperature,
#             max_tokens=max_tokens,
#         )
#         return completion.choices[0].message.content or ""

#     except Exception as err:
#         print("\n===== HF ERROR =====")
#         print(type(err))
#         print(err)
#         if last_err is not None:
#             print(f"(Groq had also failed earlier with: {last_err!r})")
#         print("====================\n")
#         # نرفع خطأ HF نفسه دايمًا (مش خطأ Groq القديم) عشان السبب الحقيقي
#         # لفشل آخر محاولة يفضل واضح في اللوج بدل ما يضيع
#         raise err


# # عمل لوجو
# def generate_logo_pollinations(prompt: str) -> Optional[str]:
#     """توليد لوجو مجاني تماماً وبلا حدود عبر Pollinations.ai."""
#     try:
#         safe_prompt = prompt.strip()[:500]
#         if not safe_prompt:
#             return None
#         encoded = urllib.parse.quote(safe_prompt)
#         url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"

#         with httpx.Client(timeout=60) as http:
#             response = http.get(url)
#             response.raise_for_status()
#             data = response.content

#         if len(data) < 1000:
#             print("Pollinations returned too small an image")
#             return None

#         b64 = base64.b64encode(data).decode()
#         return f"data:image/png;base64,{b64}"
#     except Exception as err:
#         print(f"Pollinations error: {err}")
#         return None


# # يرتب اولويات ولو فشل يرطلع ايه
# def generate_logo_image(prompt: str, retries: int = 2) -> Optional[str]:
#     """بيجرب Pollinations الأول (مجاني بلا حدود)، وبعدين HF FLUX لو فشل."""
#     print("Generating logo with Pollinations (free, unlimited)...")
#     result = generate_logo_pollinations(prompt)
#     if result:
#         return result

#     print("Pollinations failed, trying HF FLUX as fallback...")
#     if not HF_TOKEN:
#         print("HF_TOKEN not set, falling back to SVG logo")
#         return None

#     safe_prompt = prompt.encode("ascii", "ignore").decode().strip()[:500]
#     if not safe_prompt:
#         return None

#     for attempt in range(retries):
#         try:
#             print(f"Generating logo with FLUX (attempt {attempt + 1}/{retries})...")
#             image = hf_client.text_to_image(
#                 safe_prompt,
#                 model=LOGO_IMAGE_MODEL,
#                 num_inference_steps=28,
#                 guidance_scale=3.5,
#             )
#             buf = io.BytesIO()
#             image.save(buf, format="PNG")
#             data = buf.getvalue()

#             if len(data) < 1000:
#                 if attempt < retries - 1:
#                     time.sleep(3)
#                     continue
#                 return None

#             b64 = base64.b64encode(data).decode()
#             return f"data:image/png;base64,{b64}"
#         except Exception as err:
#             print(f"FLUX logo error (attempt {attempt + 1}): {err}")
#             if attempt < retries - 1:
#                 time.sleep(4)
#                 continue
#             return None
#     return None




























# "العقل" اللي بيتكلم مع كل خدمات الـ AI (Groq + Hugging Face)

import base64
import io
import time
import urllib.parse
from typing import Optional
import httpx
from groq import Groq
from huggingface_hub import InferenceClient

from .config import HF_TOKEN, GROQ_API_KEY, DEFAULT_TEXT_MODEL, LOGO_IMAGE_MODEL

# timeout افتراضي (ثواني) لأي نداء لـ Groq/HF عشان الطلب ميفضلش معلّق لو الخدمة الخارجية تعلقت
REQUEST_TIMEOUT = 45

hf_client = InferenceClient(token=HF_TOKEN, timeout=REQUEST_TIMEOUT)
groq_client = Groq(api_key=GROQ_API_KEY, timeout=REQUEST_TIMEOUT)

# GROQ_TEXT_MODEL = "llama-3.3-70b-versatile"
# ⚠️ ملاحظة مهمة: meta-llama/llama-4-scout-17b-16e-instruct موديل Preview
# ومحدد له تاريخ إيقاف من Groq نفسها (17 يوليو 2026). استبدلناه بـ gpt-oss-120b
# اللي هو Production model مستقر وملوش تاريخ إيقاف معلن دلوقتي.


GROQ_TEXT_MODEL = "qwen/qwen3-32b"







DEFAULT_TEMPERATURE = 0.75


def call_ai(
    system_prompt: str,
    user_msg: str,
    *,
    max_tokens: int = 4000,
    retries: int = 3,
    model: str | None = None,
    groq_model: str | None = None,
    temperature: float = DEFAULT_TEMPERATURE,
) -> str:
    """
    بينادي Groq (مجاني وسريع) للنص،
    ولو فشل يعمل Fallback إلى Hugging Face.

    - temperature: قابلة للتخصيص عشان مهام مختلفة تحتاج ثبات مختلف
      (تحليلية = temperature أقل، إبداعية = أعلى) — الافتراضية 0.75.
    - groq_model: قابل للتخصيص عشان كل مهمة تقدر تستخدم موديل Groq مختلف
      (زي gpt-oss-20b الأسرع والأرخص للمهام البسيطة، وgpt-oss-120b الأقوى
      للمهام المعقدة) — لو متبعتش، بيستخدم GROQ_TEXT_MODEL الافتراضي.
    - model: خاص فقط بموديل Hugging Face البديل وقت الـ fallback (لو Groq فشل).
    """
    if not isinstance(system_prompt, str):
        raise TypeError(
            f"[call_ai] system_prompt المفروض يكون str لكنه جاء كـ "
            f"{type(system_prompt)!r} -> value: {system_prompt!r}"
        )
    if not isinstance(user_msg, str):
        raise TypeError(
            f"[call_ai] user_msg المفروض يكون str لكنه جاء كـ "
            f"{type(user_msg)!r} -> value: {user_msg!r}"
        )

    last_err = None
    resolved_groq_model = groq_model or GROQ_TEXT_MODEL

    for attempt in range(retries):
        try:
            completion = groq_client.chat.completions.create(
                model=resolved_groq_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_msg},
                ],
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return completion.choices[0].message.content or ""

        except Exception as err:
            last_err = err

            msg = str(err).lower()
            is_rate_limit = (
                "429" in msg
                or "rate limit" in msg
                or "too many requests" in msg
            )

            if is_rate_limit and attempt < retries - 1:
                wait = (attempt + 1) * 10
                print(f"Waiting {wait}s before retry...")
                time.sleep(wait)
                continue

            print(f"Groq ({resolved_groq_model}) failed ({err}), trying HuggingFace...")
            break

    hf_model = model or DEFAULT_TEXT_MODEL

    try:
        completion = hf_client.chat.completions.create(
            model=hf_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
        )
        return completion.choices[0].message.content or ""

    except Exception as err:
        print("\n===== HF ERROR =====")
        print(type(err))
        print(err)
        if last_err is not None:
            print(f"(Groq had also failed earlier with: {last_err!r})")
        print("====================\n")
        # نرفع خطأ HF نفسه دايمًا (مش خطأ Groq القديم) عشان السبب الحقيقي
        # لفشل آخر محاولة يفضل واضح في اللوج بدل ما يضيع
        raise err




# عمل لوجو
def generate_logo_pollinations(prompt: str) -> Optional[str]:
    """توليد لوجو مجاني تماماً وبلا حدود عبر Pollinations.ai."""
    try:
        safe_prompt = prompt.strip()[:500]
        if not safe_prompt:
            return None
        encoded = urllib.parse.quote(safe_prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"

        with httpx.Client(timeout=60) as http:
            response = http.get(url)
            response.raise_for_status()
            data = response.content

        if len(data) < 1000:
            print("Pollinations returned too small an image")
            return None

        b64 = base64.b64encode(data).decode()
        return f"data:image/png;base64,{b64}"
    except Exception as err:
        print(f"Pollinations error: {err}")
        return None





# يرتب اولويات ولو فشل يرطلع ايه
def generate_logo_image(prompt: str, retries: int = 2) -> Optional[str]:
    """بيجرب Pollinations الأول (مجاني بلا حدود)، وبعدين HF FLUX لو فشل."""
    print("Generating logo with Pollinations (free, unlimited)...")
    result = generate_logo_pollinations(prompt)
    if result:
        return result

    print("Pollinations failed, trying HF FLUX as fallback...")
    if not HF_TOKEN:
        print("HF_TOKEN not set, falling back to SVG logo")
        return None

    safe_prompt = prompt.encode("ascii", "ignore").decode().strip()[:500]
    if not safe_prompt:
        return None

    for attempt in range(retries):
        try:
            print(f"Generating logo with FLUX (attempt {attempt + 1}/{retries})...")
            image = hf_client.text_to_image(
                safe_prompt,
                model=LOGO_IMAGE_MODEL,
                num_inference_steps=28,
                guidance_scale=3.5,
            )
            buf = io.BytesIO()
            image.save(buf, format="PNG")
            data = buf.getvalue()

            if len(data) < 1000:
                if attempt < retries - 1:
                    time.sleep(3)
                    continue
                return None

            b64 = base64.b64encode(data).decode()
            return f"data:image/png;base64,{b64}"
        except Exception as err:
            print(f"FLUX logo error (attempt {attempt + 1}): {err}")
            if attempt < retries - 1:
                time.sleep(4)
                continue
            return None
    return None