# model________________________________
# DEFAULT_TEXT_MODEL = os.environ.get("HF_TEXT_MODEL", "Qwen/Qwen2.5-72B-Instruct")
# LOGO_IMAGE_MODEL = os.environ.get("HF_IMAGE_MODEL", "black-forest-labs/FLUX.1-dev")





# import os
# from dotenv import load_dotenv

# load_dotenv()

# # API Keys
# HF_TOKEN = os.environ.get("HF_TOKEN")
# GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# # brand model
# DEFAULT_TEXT_MODEL = os.environ.get(
#     "HF_TEXT_MODEL",
#     "Qwen/Qwen3-235B-A22B-Instruct-2507"
# )

# # logo model 
# LOGO_IMAGE_MODEL = os.environ.get(
#     "HF_IMAGE_MODEL",
#     "playgroundai/playground-v2.5-1024px-aesthetic"
# )

# # Internal API Security integrate backend
# INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")

# # Server backend
# PORT = int(os.environ.get("PORT", "8000"))























































import os
from dotenv import load_dotenv

load_dotenv()

# =========================
# API Keys
# =========================
HF_TOKEN = os.environ.get("HF_TOKEN")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

# =========================

# =========================
# Hugging Face Text Model
# (Fallback if Groq fails)
# =========================
DEFAULT_TEXT_MODEL = os.environ.get(
    "HF_TEXT_MODEL",
    "Qwen/Qwen3-4B-Thinking-2507"
)

# =========================
# Hugging Face Image Model
# (Logo Generation)
# =========================
LOGO_IMAGE_MODEL = os.environ.get(
    "HF_IMAGE_MODEL",
    "stabilityai/stable-diffusion-xl-base-1.0"
)

# =========================
# Internal API Security
# =========================
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY")

# =========================
# Backend Server
# =========================
PORT = int(os.environ.get("PORT", "8000"))