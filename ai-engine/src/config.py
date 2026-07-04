import os
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.environ.get("HF_TOKEN")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# الموديل النصي الافتراضي لكل التوليد (أسماء، سوشيال، تحليلات...)
# غيّره من الـ .env لو عايز تجرب موديل تاني بدون ما تلمس الكود
DEFAULT_TEXT_MODEL = os.environ.get("HF_TEXT_MODEL", "Qwen/Qwen2.5-72B-Instruct")

# موديل توليد صورة اللوجو (fallback بعد Pollinations)
LOGO_IMAGE_MODEL = os.environ.get("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-dev")

# مفتاح داخلي بسيط لحماية الـ microservice من إنه يتنادى من أي حد غير الـ Node backend
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")

PORT = int(os.environ.get("PORT", "8000"))