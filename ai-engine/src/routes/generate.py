# جزء الباك


from fastapi import APIRouter, Depends, HTTPException

from ..auth import verify_internal_key
from ..schemas import FullKitRequest, ExtraSocialRequest, BrandCtxRequest
from ..services import brand_kit_service as bks
from ..services import standalone_service as ss

router = APIRouter(dependencies=[Depends(verify_internal_key)])


@router.post("/generate/full-kit")
async def generate_full_kit(req: FullKitRequest):
    """بديل generateFullBrandKit() - أثقل endpoint، بياخد وقت (فيه 13+ استدعاء AI)."""
    try:
        return await bks.generate_full_brand_kit(
            idea=req.idea,
            brand_name=req.brandName,
            style=req.style,
            colors=req.colors,
        )
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.post("/generate/extra-social")
async def generate_extra_social(req: ExtraSocialRequest):
    return await ss.generate_extra_social_content(
        idea=req.idea,
        brand_name=req.brandName,
        style=req.style,
        tagline=req.tagline,
        audience=req.audience,
        value=req.value,
    )


@router.post("/generate/competitors")
async def generate_competitors(req: BrandCtxRequest):
    return await ss.generate_competitors_only(req.idea, req.brandName, req.audience, req.positioning) or {}


@router.post("/generate/brochure")
async def generate_brochure(req: BrandCtxRequest):
    return (
        await ss.generate_brochure_only(
            req.idea, req.brandName, req.tagline, req.value, req.audience, req.messages, req.style
        )
        or {}
    )


@router.post("/generate/objections")
async def generate_objections(req: BrandCtxRequest):
    return await ss.generate_objections_only(req.idea, req.brandName, req.audience, req.value, req.positioning) or {}


@router.post("/generate/product-focus")
async def generate_product_focus(req: BrandCtxRequest):
    return await ss.generate_product_focus_only(req.idea, req.brandName, req.audience, req.value, req.style) or {}


@router.post("/generate/launch-plan")
async def generate_launch_plan(req: BrandCtxRequest):
    return (
        await ss.generate_launch_plan_only(
            req.idea, req.brandName, req.audience, req.value, req.positioning, req.tagline
        )
        or {}
    )

@router.post("/generate/swot")
async def generate_swot(req: BrandCtxRequest):
    return await ss.generate_swot_only(req.idea, req.brandName, req.audience, req.value, req.positioning) or {}


@router.post("/generate/age-segments")
async def generate_age_segments(req: BrandCtxRequest):
    return (
        await ss.generate_age_segments_only(
            req.idea, req.brandName, req.audience, req.positioning, req.value, req.style
        )
        or {}
    )

@router.post("/generate/business-overview")
async def generate_business_overview(req: BrandCtxRequest):
    return (
        await ss.generate_business_overview_only(
            req.idea, req.brandName, req.audience, req.positioning, req.value, req.tagline
        )
        or {}
    )

@router.post("/generate/age-preferences")
async def generate_age_preferences(req: BrandCtxRequest):
    return (
        await ss.generate_age_preferences_only(
            req.idea, req.brandName, req.audience, req.positioning, req.value, req.style
        )
        or {}
    )

@router.post("/generate/faq")
async def generate_faq(req: BrandCtxRequest):
    return (
        await ss.generate_faq_only(req.idea, req.brandName, req.audience, req.value, req.positioning, req.tagline)
        or {}
    )
