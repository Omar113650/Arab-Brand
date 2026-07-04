from fastapi import FastAPI

from .routes.generate import router as generate_router

app = FastAPI(title="Arab Brand Kit - AI Engine", version="1.0.0")

app.include_router(generate_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
