
#  "العقل" اللي بيتكلم مع كل خدمات الـ

import base64
import io
import time
import urllib.parse
from typing import Optional

import httpx
from groq import Groq
from huggingface_hub import InferenceClient

from .config import HF_TOKEN, GROQ_API_KEY, DEFAULT_TEXT_MODEL, LOGO_IMAGE_MODEL

hf_client = InferenceClient(token=HF_TOKEN)
groq_client = Groq(api_key=GROQ_API_KEY)

# موديل نصي مجاني وقوي على Groq (غيّره لو محتاج موديل تاني من قائمة Groq)
GROQ_TEXT_MODEL = "llama-3.3-70b-versatile"



#  لتوليد النص
def call_ai(system_prompt: str, user_msg: str, retries: int = 3, model: str = None) -> str:
    """بينادي Groq (مجاني وسريع) للنص، مع fallback لـ HF لو Groq فشل."""
    last_err = None

    # المحاولة الأولى: Groq (بلاش تماماً، حدود يومية سخية)
    for attempt in range(retries):
        try:
            completion = groq_client.chat.completions.create(
                model=GROQ_TEXT_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_msg},
                ],
                temperature=0.75,
                max_tokens=4000,
            )
            return completion.choices[0].message.content or ""
        except Exception as err:
            last_err = err
            msg = str(err).lower()
            is_rate_limit = "429" in msg or "rate limit" in msg or "too many requests" in msg
            if is_rate_limit and attempt < retries - 1:
                wait = (attempt + 1) * 10
                print(f"Groq rate limit hit, waiting {wait}s (retry {attempt + 1}/{retries - 1})...")
                time.sleep(wait)
                continue
            print(f"Groq failed: {err}, falling back to HF...")
            break

    # Fallback: HF (لو Groq فشل تماماً)
    hf_model = model or DEFAULT_TEXT_MODEL
    try:
        completion = hf_client.chat.completions.create(
            model=hf_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_msg},
            ],
            temperature=0.75,
            max_tokens=4000,
        )
        return completion.choices[0].message.content or ""
    except Exception as err:
        raise err if last_err is None else last_err


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