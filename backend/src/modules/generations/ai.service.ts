/* ── Prompts ── */
const SYS_BRAND = `أنت خبير Brand Strategy للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
الشكل المطلوب بالضبط:
{
  "names": ["", "", ""],
  "recommendedName": "",
  "tagline": { "ar": "", "en": "" },
  "story": { "ar": "جملتان", "en": "two sentences" },
  "strategy": { "positioning": "", "audience": "", "value": "" },
  "colors": [
    { "name": "Primary", "hex": "#RRGGBB", "role": "primary" },
    { "name": "Secondary", "hex": "#RRGGBB", "role": "secondary" },
    { "name": "Accent", "hex": "#RRGGBB", "role": "accent" },
    { "name": "Background", "hex": "#RRGGBB", "role": "bg" },
    { "name": "Text", "hex": "#RRGGBB", "role": "text" }
  ],
  "typography": { "display": "FontName", "arabic": "خط عربي", "style": "وصف" },
  "voice": { "tone": "", "traits": ["", "", ""] },
  "messages": ["", "", ""],
  "score": { "overall": 85, "identity": 88, "marketing": 82, "memory": 90, "arabicFit": 87 }
}`;

const SYS_LOGO = `You are an SVG logo designer for Arabic brands. Output ONLY raw SVG code starting exactly with <svg. No markdown, no explanation, no code fences, no extra text before or after the SVG. Rules: viewBox="0 0 300 300", use the provided hex colors, include brand name as <text> element, clean geometric minimal style, no external fonts or images.`;

const SYS_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "instagram": [
    { "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "theme": "موضوع المنشور" },
    { "caption": "", "hashtags": "", "theme": "" },
    { "caption": "", "hashtags": "", "theme": "" }
  ],
  "tiktok": [
    { "hook": "أول 3 ثواني جذابة", "idea": "فكرة الفيديو", "script": "ملخص السكريبت" },
    { "hook": "", "idea": "", "script": "" }
  ],
  "twitter": [
    { "text": "تغريدة كاملة" },
    { "text": "" },
    { "text": "" }
  ],
  "strategy": { "bestTimes": "", "frequency": "", "pillars": ["", "", ""], "tone": "" }
}`;

const SYS_LANDING = `أنت مصمم Landing Pages للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "hero": { "headline": "عنوان قوي جداً", "subheadline": "جملة توضيحية", "cta": "نص الزر" },
  "features": [
    { "emoji": "🎯", "title": "", "desc": "" },
    { "emoji": "⚡", "title": "", "desc": "" },
    { "emoji": "✨", "title": "", "desc": "" },
    { "emoji": "🚀", "title": "", "desc": "" }
  ],
  "testimonial": { "text": "تجربة عميل مقنعة", "name": "", "role": "" },
  "cta": { "headline": "", "subheadline": "", "button": "" }
}`;

/* ── Call Gemini API ── */
async function callGemini(apiKey: string, systemPrompt: string, userMsg: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: "user", parts: [{ text: userMsg }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json() as any;
  if (data.error) {
    throw new Error(data.error.message);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

/* ── Parsers ── */
function parseJSON(raw: string): any {
  try {
    const clean = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const i = clean.search(/[{[]/);
    return i >= 0 ? JSON.parse(clean.slice(i)) : null;
  } catch (err) {
    console.error("JSON parsing error:", err);
    return null;
  }
}

function parseSVG(raw: string): string | null {
  const clean = raw.replace(/```xml\n?/g, "").replace(/```html\n?/g, "").replace(/```svg\n?/g, "").replace(/```\n?/g, "").trim();
  const i = clean.indexOf("<svg");
  return i >= 0 ? clean.slice(i).trim() : null;
}

function fallbackSVG(name: string, primary: string, secondary: string): string {
  const init = (name || "BR").slice(0, 2).toUpperCase();
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="${secondary}"/>
  <circle cx="150" cy="120" r="65" fill="${primary}" opacity=".15"/>
  <circle cx="150" cy="120" r="46" fill="${primary}"/>
  <text x="150" y="132" text-anchor="middle" font-family="serif" font-size="30" font-weight="700" fill="${secondary}">${init}</text>
  <text x="150" y="205" text-anchor="middle" font-family="serif" font-size="20" font-weight="600" fill="${primary}">${name}</text>
  <line x1="85" y1="220" x2="215" y2="220" stroke="${primary}" stroke-width="1" opacity=".4"/>
</svg>`;
}

/* ── Full Generation ── */
export interface GenerateParams {
  apiKey: string;
  idea: string;
  brandName?: string;
  style: string;
  colors: string[];
}

export interface BrandKitResult {
  brand: any;
  logo: string;
  social: any;
  landing: any;
}

export const generateFullBrandKit = async (params: GenerateParams): Promise<BrandKitResult> => {
  const { apiKey, idea, brandName, style, colors } = params;

  const styleMap: Record<string, string> = {
    modern: "عصري",
    luxury: "فاخر",
    youth: "شبابي",
    minimal: "بسيط",
    arabic: "تراثي",
    tech: "تقني",
  };

  const colorMap: Record<string, string> = {
    gold: "ذهبي",
    navy: "كحلي",
    green: "أخضر",
    red: "أحمر",
    purple: "بنفسجي",
    teal: "تيل",
    black: "أسود",
    coral: "مرجاني",
  };

  const styleName = styleMap[style] ?? style;
  const colNames = colors.map((c) => colorMap[c] ?? c).join("، ");
  
  const base = `فكرة المشروع: ${idea}
${brandName ? `اسم البراند: ${brandName}` : "لا يوجد اسم — ولّد 3 أسماء مناسبة"}
الأسلوب البصري: ${styleName}
${colNames ? `الألوان المفضلة: ${colNames}` : ""}`;

  /* ── Phase 1: Brand Strategy ── */
  const brandRaw = await callGemini(apiKey, SYS_BRAND, base + "\nولّد Brand Kit كامل احترافي للسوق العربي.");
  const brand = parseJSON(brandRaw);
  if (!brand) {
    throw new Error("لم يتم تحليل بيانات الاستراتيجية بشكل صحيح من الذكاء الاصطناعي");
  }

  /* ── Phase 2: Logo SVG ── */
  const primary = brand.colors?.[0]?.hex ?? "#C9973A";
  const secondary = brand.colors?.[1]?.hex ?? "#13131E";
  const displayName = brandName || brand.recommendedName || brand.names?.[0] || "Brand";

  let logo: string;
  try {
    const logoRaw = await callGemini(
      apiKey,
      SYS_LOGO,
      `Brand: ${displayName}\nStyle: ${styleName}\nPrimary color: ${primary}\nSecondary color: ${secondary}\nDescription: ${idea.slice(0, 100)}\nGenerate a clean professional SVG logo.`
    );
    logo = parseSVG(logoRaw) ?? fallbackSVG(displayName, primary, secondary);
  } catch (err) {
    console.error("Logo generation failed, using fallback:", err);
    logo = fallbackSVG(displayName, primary, secondary);
  }

  /* ── Phase 3 & 4: Social + Landing (in parallel) ── */
  const socialPromise = callGemini(
    apiKey,
    SYS_SOCIAL,
    `${base}\nالبراند: ${displayName}\nالشعار: ${brand.tagline?.ar}\nالجمهور: ${brand.strategy?.audience}\nصوت البراند: ${brand.voice?.tone}`
  );

  const landingPromise = callGemini(
    apiKey,
    SYS_LANDING,
    `${base}\nالبراند: ${displayName}\nالشعار: ${brand.tagline?.ar}\nالقيمة الفريدة: ${brand.strategy?.value}\nالجمهور: ${brand.strategy?.audience}`
  );

  const [socialRaw, landingRaw] = await Promise.all([socialPromise, landingPromise]);

  const social = parseJSON(socialRaw);
  const landing = parseJSON(landingRaw);

  return {
    brand,
    logo,
    social,
    landing,
  };
};
