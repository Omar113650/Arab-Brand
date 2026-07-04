from typing import List, Optional
from pydantic import BaseModel


class FullKitRequest(BaseModel):
    idea: str
    brandName: Optional[str] = None
    style: str
    colors: List[str] = []


class ExtraSocialRequest(BaseModel):
    idea: str
    brandName: str
    style: str
    tagline: str
    audience: str
    value: str


class BrandCtxRequest(BaseModel):
    """شكل موحّد لكل طلبات الـ standalone (competitors, brochure, objections...).
    مش كل مهمة بتستخدم كل الحقول، لكن توحيد الـ schema بيسهّل الصيانة."""

    idea: str
    brandName: str
    audience: str = ""
    positioning: str = ""
    value: str = ""
    tagline: str = ""
    messages: List[str] = []
    style: str = ""
