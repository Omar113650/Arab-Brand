from fastapi import Header, HTTPException
from .config import INTERNAL_API_KEY

async def verify_internal_key(x_internal_api_key: str = Header(default=None)):
    print("Expected:", repr(INTERNAL_API_KEY))
    print("Received:", repr(x_internal_api_key))

    if not INTERNAL_API_KEY:
        return

    if x_internal_api_key != INTERNAL_API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized: invalid internal API key",
        )