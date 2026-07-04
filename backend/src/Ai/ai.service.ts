import axios from "axios";

// ─────────────────────────────────────────────
// AI ENGINE CLIENT
// كل التوليد بقى شغال في microservice بايثون منفصل (ai-engine)
// الملف ده بقى مجرد HTTP client - نفس أسماء الدوال والـ interfaces
// بالظبط زي القديم عشان project.controller.ts متتغيرش خالص
// ─────────────────────────────────────────────

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";
const INTERNAL_API_KEY = process.env.AI_ENGINE_INTERNAL_KEY || "";

const aiEngine = axios.create({
  baseURL: `${AI_ENGINE_URL}/api`,
  timeout: 180_000, // توليد الـ full-kit بياخد وقت (13+ استدعاء AI)
  headers: INTERNAL_API_KEY ? { "X-Internal-Api-Key": INTERNAL_API_KEY } : {},
});

// ── توحيد شكل الأخطاء عشان err?.status === 429 في الكنترولر يفضل شغال زي ما هو ──
aiEngine.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      "AI engine request failed";

    const normalized: any = new Error(message);
    normalized.status = status;
    if (status === 429) normalized.code = "rate_limit_exceeded";
    throw normalized;
  },
);

// ─────────────────────────────────────────────
// TYPES (نفس الأصلي بالظبط)
// ─────────────────────────────────────────────

export interface GenerateParams {
  idea: string;
  brandName?: string;
  style: string;
  colors: string[];
}

export interface BrandKitResult {
  brand: any;
  logo: string;
  logoFormat: "image" | "svg";
  social: any;
  landing: any;
  brochureContent: any;
  competitors: any;
  objections: any;
  productFocus: any;
  launchPlan: any;
  swot: any;
  ageSegments: any;
  businessOverview: any;
  agePreferences: any;
  faq: any;
}

export interface ExtraSocialParams {
  idea: string;
  brandName: string;
  style: string;
  tagline: string;
  audience: string;
  value: string;
}

export interface CompetitorsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
}

export interface BrochureOnlyParams {
  idea: string;
  brandName: string;
  tagline: string;
  value: string;
  audience: string;
  messages: string[];
  style: string;
}

export interface ObjectionsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
}

export interface ProductFocusOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  style: string;
}

export interface LaunchPlanOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
  tagline: string;
}

export interface SwotOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
}

export interface AgeSegmentsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  style: string;
}

export interface BusinessOverviewOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  tagline: string;
}

export interface AgePreferencesOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  style: string;
}

export interface FaqOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
  tagline: string;
}

// ─────────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────────

export const generateFullBrandKit = async (
  params: GenerateParams,
): Promise<BrandKitResult> => {
  const { data } = await aiEngine.post("/generate/full-kit", {
    idea: params.idea,
    brandName: params.brandName,
    style: params.style,
    colors: params.colors,
  });
  return data;
};

// ─────────────────────────────────────────────
// EXTRA SOCIAL CONTENT (paid)
// ─────────────────────────────────────────────

export const generateExtraSocialContent = async (
  params: ExtraSocialParams,
): Promise<{
  postIdeas: any[];
  videoIdeas: any[];
  instagram: any[];
  twitter: any[];
}> => {
  const { data } = await aiEngine.post("/generate/extra-social", params);
  return data;
};

// ─────────────────────────────────────────────
// STANDALONE FUNCTIONS
// ─────────────────────────────────────────────

export const generateCompetitorsOnly = async (
  params: CompetitorsOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/competitors", params);
  return data;
};

export const generateBrochureOnly = async (
  params: BrochureOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/brochure", params);
  return data;
};

export const generateObjectionsOnly = async (
  params: ObjectionsOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/objections", params);
  return data;
};

export const generateProductFocusOnly = async (
  params: ProductFocusOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/product-focus", params);
  return data;
};

export const generateLaunchPlanOnly = async (
  params: LaunchPlanOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/launch-plan", params);
  return data;
};

export const generateSwotOnly = async (
  params: SwotOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/swot", params);
  return data;
};

export const generateAgeSegmentsOnly = async (
  params: AgeSegmentsOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/age-segments", params);
  return data;
};

export const generateBusinessOverviewOnly = async (
  params: BusinessOverviewOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/business-overview", params);
  return data;
};

export const generateAgePreferencesOnly = async (
  params: AgePreferencesOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/age-preferences", params);
  return data;
};

export const generateFaqOnly = async (
  params: FaqOnlyParams,
): Promise<any | null> => {
  const { data } = await aiEngine.post("/generate/faq", params);
  return data;
};
