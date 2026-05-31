// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: "https://api.groq.com/openai/v1",
// });

// const SYS_BRAND = `أنت خبير Brand Strategy للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
// الشكل المطلوب بالضبط:
// {
//   "names": ["", "", ""],
//   "recommendedName": "",
//   "tagline": { "ar": "", "en": "" },
//   "story": { "ar": "جملتان", "en": "two sentences" },
//   "strategy": { "positioning": "", "audience": "", "value": "" },
//   "colors": [
//     { "name": "Primary", "hex": "#RRGGBB", "role": "primary" },
//     { "name": "Secondary", "hex": "#RRGGBB", "role": "secondary" },
//     { "name": "Accent", "hex": "#RRGGBB", "role": "accent" },
//     { "name": "Background", "hex": "#RRGGBB", "role": "bg" },
//     { "name": "Text", "hex": "#RRGGBB", "role": "text" }
//   ],
//   "typography": { "display": "FontName", "arabic": "خط عربي", "style": "وصف" },
//   "voice": { "tone": "", "traits": ["", "", ""] },
//   "messages": ["", "", ""],
//   "score": { "overall": 85, "identity": 88, "marketing": 82, "memory": 90, "arabicFit": 87 }
// }`;

// const SYS_LOGO = `You are an SVG logo designer for Arabic brands. Output ONLY raw SVG code starting exactly with <svg. No markdown, no explanation, no code fences, no extra text before or after the SVG. Rules: viewBox="0 0 300 300", use the provided hex colors, include brand name as <text> element, clean geometric minimal style, no external fonts or images.`;

// const SYS_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "instagram": [
//     { "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "theme": "موضوع المنشور" },
//     { "caption": "", "hashtags": "", "theme": "" },
//     { "caption": "", "hashtags": "", "theme": "" }
//   ],
//   "tiktok": [
//     { "hook": "أول 3 ثواني جذابة", "idea": "فكرة الفيديو", "script": "ملخص السكريبت" },
//     { "hook": "", "idea": "", "script": "" }
//   ],
//   "twitter": [
//     { "text": "تغريدة كاملة" },
//     { "text": "" },
//     { "text": "" }
//   ],
//   "strategy": { "bestTimes": "", "frequency": "", "pillars": ["", "", ""], "tone": "" }
// }`;

// const SYS_LANDING = `أنت مصمم Landing Pages للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "hero": { "headline": "عنوان قوي جداً", "subheadline": "جملة توضيحية", "cta": "نص الزر" },
//   "features": [
//     { "emoji": "🎯", "title": "", "desc": "" },
//     { "emoji": "⚡", "title": "", "desc": "" },
//     { "emoji": "✨", "title": "", "desc": "" },
//     { "emoji": "🚀", "title": "", "desc": "" }
//   ],
//   "testimonial": { "text": "تجربة عميل مقنعة", "name": "", "role": "" },
//   "cta": { "headline": "", "subheadline": "", "button": "" }
// }`;

// async function callAI(systemPrompt: string, userMsg: string): Promise<string> {
//   const res = await client.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     temperature: 0.7,
//     max_tokens: 2048,
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userMsg },
//     ],
//   });

//   return res.choices?.[0]?.message?.content || "";
// }

// /* ── Parsers ── */
// function parseJSON(raw: string): any {
//   try {
//     const clean = raw
//       .replace(/```json\n?/g, "")
//       .replace(/```\n?/g, "")
//       .trim();
//     const i = clean.search(/[{[]/);
//     return i >= 0 ? JSON.parse(clean.slice(i)) : null;
//   } catch (err) {
//     console.error("JSON parsing error:", err);
//     return null;
//   }
// }

// function parseSVG(raw: string): string | null {
//   const clean = raw
//     .replace(/```xml\n?/g, "")
//     .replace(/```html\n?/g, "")
//     .replace(/```svg\n?/g, "")
//     .replace(/```\n?/g, "")
//     .trim();

//   const i = clean.indexOf("<svg");
//   return i >= 0 ? clean.slice(i).trim() : null;
// }

// function fallbackSVG(name: string, primary: string, secondary: string): string {
//   const init = (name || "BR").slice(0, 2).toUpperCase();

//   return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
//   <rect width="300" height="300" fill="${secondary}"/>
//   <circle cx="150" cy="120" r="65" fill="${primary}" opacity=".15"/>
//   <circle cx="150" cy="120" r="46" fill="${primary}"/>
//   <text x="150" y="132" text-anchor="middle" font-family="serif" font-size="30" font-weight="700" fill="${secondary}">${init}</text>
//   <text x="150" y="205" text-anchor="middle" font-family="serif" font-size="20" font-weight="600" fill="${primary}">${name}</text>
//   <line x1="85" y1="220" x2="215" y2="220" stroke="${primary}" stroke-width="1" opacity=".4"/>
// </svg>`;
// }

// /* ── Types ── */
// export interface GenerateParams {
//   idea: string;
//   brandName?: string;
//   style: string;
//   colors: string[];
// }

// export interface BrandKitResult {
//   brand: any;
//   logo: string;
//   social: any;
//   landing: any;
// }

// /* ── Main Generator ── */
// export const generateFullBrandKit = async (
//   params: GenerateParams,
// ): Promise<BrandKitResult> => {
//   const { idea, brandName, style, colors } = params;

//   const styleMap: Record<string, string> = {
//     modern: "عصري",
//     luxury: "فاخر",
//     youth: "شبابي",
//     minimal: "بسيط",
//     arabic: "تراثي",
//     tech: "تقني",
//   };

//   const colorMap: Record<string, string> = {
//     gold: "ذهبي",
//     navy: "كحلي",
//     green: "أخضر",
//     red: "أحمر",
//     purple: "بنفسجي",
//     teal: "تيل",
//     black: "أسود",
//     coral: "مرجاني",
//   };

//   const styleName = styleMap[style] ?? style;
//   const colNames = colors.map((c) => colorMap[c] ?? c).join("، ");

//   const base = `فكرة المشروع: ${idea}
// ${brandName ? `اسم البراند: ${brandName}` : "لا يوجد اسم — ولّد 3 أسماء مناسبة"}
// الأسلوب البصري: ${styleName}
// ${colNames ? `الألوان المفضلة: ${colNames}` : ""}`;

//   /* ── Phase 1: Brand ── */
//   const brandRaw = await callAI(
//     SYS_BRAND,
//     base + "\nولّد Brand Kit كامل احترافي للسوق العربي.",
//   );
//   const brand = parseJSON(brandRaw);

//   if (!brand) {
//     throw new Error("فشل تحليل Brand JSON من AI");
//   }

//   /* ── Phase 2: Logo ── */
//   const primary = brand.colors?.[0]?.hex ?? "#C9973A";
//   const secondary = brand.colors?.[1]?.hex ?? "#13131E";
//   const displayName =
//     brandName || brand.recommendedName || brand.names?.[0] || "Brand";

//   let logo: string;

//   try {
//     const logoRaw = await callAI(
//       SYS_LOGO,
//       `Brand: ${displayName}
// Style: ${styleName}
// Primary: ${primary}
// Secondary: ${secondary}
// Idea: ${idea.slice(0, 100)}`,
//     );

//     logo = parseSVG(logoRaw) ?? fallbackSVG(displayName, primary, secondary);
//   } catch (err) {
//     console.error("Logo error:", err);
//     logo = fallbackSVG(displayName, primary, secondary);
//   }

//   /* ── Phase 3 & 4: Social + Landing ── */
//   const socialPromise = callAI(
//     SYS_SOCIAL,
//     `${base}
// البراند: ${displayName}
// الشعار: ${brand.tagline?.ar || ""}`,
//   );

//   const landingPromise = callAI(
//     SYS_LANDING,
//     `${base}
// البراند: ${displayName}
// القيمة: ${brand.strategy?.value || ""}`,
//   );

//   const [socialRaw, landingRaw] = await Promise.all([
//     socialPromise,
//     landingPromise,
//   ]);

//   const social = parseJSON(socialRaw);
//   const landing = parseJSON(landingRaw);

//   return {
//     brand,
//     logo,
//     social,
//     landing,
//   };
// };
















































// import OpenAI from "openai";

// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: "https://api.groq.com/openai/v1",
// });

// // ─────────────────────────────────────────────
// // SYSTEM PROMPTS
// // ─────────────────────────────────────────────

// const SYS_BRAND = `أنت خبير Brand Strategy للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
// الشكل المطلوب بالضبط:
// {
//   "names": [
//     { "name": "الاسم الأول", "reason": "سبب اختياره", "meaning": "المعنى" },
//     { "name": "الاسم الثاني", "reason": "سبب اختياره", "meaning": "المعنى" },
//     { "name": "الاسم الثالث", "reason": "سبب اختياره", "meaning": "المعنى" }
//   ],
//   "recommendedName": "الاسم الأول",
//   "tagline": { "ar": "", "en": "" },
//   "story": { "ar": "جملتان مخصصتان لهذا البراند بالتحديد", "en": "two specific sentences about this brand" },
//   "strategy": { "positioning": "", "audience": "", "value": "" },
//   "colors": [
//     { "name": "Primary", "hex": "#RRGGBB", "role": "primary" },
//     { "name": "Secondary", "hex": "#RRGGBB", "role": "secondary" },
//     { "name": "Accent", "hex": "#RRGGBB", "role": "accent" },
//     { "name": "Background", "hex": "#RRGGBB", "role": "bg" },
//     { "name": "Text", "hex": "#RRGGBB", "role": "text" }
//   ],
//   "typography": { "display": "FontName", "arabic": "خط عربي", "style": "وصف" },
//   "voice": { "tone": "", "traits": ["", "", ""] },
//   "messages": ["رسالة مخصصة ١", "رسالة مخصصة ٢", "رسالة مخصصة ٣"],
//   "score": { "overall": 85, "identity": 88, "marketing": 82, "memory": 90, "arabicFit": 87 }
// }
// مهم جداً: كل شيء يجب أن يكون مخصصاً لفكرة المشروع المحددة وليس كلاماً عاماً.`;

// const SYS_LOGO = `You are an SVG logo designer for Arabic brands. Output ONLY raw SVG code starting exactly with <svg. No markdown, no explanation, no code fences, no extra text before or after the SVG.
// Rules:
// - viewBox="0 0 300 300" always
// - xmlns="http://www.w3.org/2000/svg" always
// - Use provided hex colors only
// - Include brand name as <text> element with font-family="Arial, sans-serif"
// - Clean geometric minimal style
// - No external fonts, no images, no scripts
// - Make it unique and fitting to the brand concept`;

// const SYS_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي. رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
// مهم: كل المحتوى يجب أن يكون مخصصاً لفكرة المشروع المحددة، لا تكرار لنفس الأفكار عبر منصات مختلفة:
// {
//   "instagram": [
//     { "caption": "نص كامل مع إيموجي مناسب للمشروع", "hashtags": "#tag1 #tag2 #tag3", "theme": "موضوع المنشور" },
//     { "caption": "", "hashtags": "", "theme": "" },
//     { "caption": "", "hashtags": "", "theme": "" }
//   ],
//   "tiktok": [
//     { "hook": "جملة افتتاحية جذابة خاصة بهذا البراند", "idea": "فكرة فيديو مناسبة لطبيعة المشروع", "script": "ملخص سكريبت مخصص" },
//     { "hook": "", "idea": "", "script": "" }
//   ],
//   "twitter": [
//     { "text": "تغريدة مميزة مع صياغة قوية" },
//     { "text": "" },
//     { "text": "" }
//   ],
//   "strategy": { "bestTimes": "", "frequency": "", "pillars": ["", "", ""], "tone": "" }
// }`;

// const SYS_LANDING = `أنت مصمم Landing Pages محترف للسوق العربي. مهمتك إنشاء محتوى صفحة هبوط مخصص وفريد لكل براند.
// قواعد صارمة:
// - العنوان الرئيسي يجب أن يكون قوياً وخاصاً بهذا البراند فقط
// - لا تستخدم عبارات عامة مثل "أهلاً بكم" أو "نحن نقدم"
// - كل feature يجب أن تعكس ميزة حقيقية من المشروع المحدد
// - شهادة العميل يجب أن تكون مناسبة لطبيعة المشروع
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "hero": {
//     "headline": "عنوان قوي جداً وخاص بهذا البراند - ليس عاماً",
//     "subheadline": "جملة توضيحية تشرح القيمة الفريدة للمشروع",
//     "cta": "نص زر محدد وجذاب"
//   },
//   "features": [
//     { "emoji": "🎯", "title": "ميزة حقيقية من المشروع", "desc": "وصف مفصل يعكس طبيعة العمل" },
//     { "emoji": "⚡", "title": "", "desc": "" },
//     { "emoji": "✨", "title": "", "desc": "" },
//     { "emoji": "🚀", "title": "", "desc": "" }
//   ],
//   "testimonial": {
//     "text": "تجربة عميل حقيقية ومقنعة تناسب هذا النوع من المشاريع",
//     "name": "اسم عربي مناسب",
//     "role": "وظيفة أو صفة مناسبة للجمهور المستهدف"
//   },
//   "stats": [
//     { "value": "500+", "label": "إحصائية مناسبة للمشروع" },
//     { "value": "98%", "label": "" },
//     { "value": "24/7", "label": "" }
//   ],
//   "cta": {
//     "headline": "عنوان CTA قوي وخاص",
//     "subheadline": "جملة تحفيزية",
//     "button": "نص زر واضح"
//   }
// }`;

// const SYS_COMPETITORS = `أنت محلل أسواق متخصص في السوق العربي. بناءً على وصف المشروع، قدم تحليلاً للمنافسين والسوق.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "marketOverview": "نظرة عامة على السوق بـ 2-3 جمل",
//   "competitors": [
//     {
//       "name": "اسم المنافس أو النوع",
//       "type": "مباشر / غير مباشر",
//       "strengths": "نقاط قوته",
//       "weaknesses": "نقاط ضعفه",
//       "website": "domain.com إن وجد",
//       "marketShare": "كبير / متوسط / صغير"
//     }
//   ],
//   "gaps": ["فرصة في السوق ١", "فرصة في السوق ٢", "فرصة في السوق ٣"],
//   "differentiators": ["ما يجعل مشروعك مختلفاً ١", "ما يجعل مشروعك مختلفاً ٢"],
//   "searchKeywords": ["كلمة بحثية ١", "كلمة بحثية ٢", "كلمة بحثية ٣"],
//   "marketSize": "صغير / متوسط / كبير / ضخم",
//   "competitionLevel": "منخفض / متوسط / عالي / شرس",
//   "recommendation": "توصية استراتيجية مختصرة للدخول للسوق"
// }`;

// const SYS_BROCHURE = `أنت مصمم بروشورات احترافية للسوق العربي. أنشئ محتوى بروشور مخصصاً وفريداً لهذا البراند.
// لا تستخدم عبارات عامة أو مكررة. كل نقطة يجب أن تعكس طبيعة المشروع المحدد.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "headline": "عنوان البروشور الرئيسي - قوي وخاص",
//   "intro": "مقدمة مخصصة للبراند - 3 جمل تشرح القيمة الفريدة",
//   "sections": [
//     { "title": "عنوان قسم مخصص", "content": "محتوى القسم مرتبط بطبيعة المشروع" },
//     { "title": "", "content": "" },
//     { "title": "", "content": "" }
//   ],
//   "services": [
//     { "icon": "🎯", "name": "خدمة أو منتج حقيقي من المشروع", "brief": "وصف مختصر" },
//     { "icon": "⚡", "name": "", "brief": "" },
//     { "icon": "✨", "name": "", "brief": "" }
//   ],
//   "whyUs": ["سبب اختيارنا ١ - خاص بهذا البراند", "سبب ٢", "سبب ٣", "سبب ٤"],
//   "contact": { "tagline": "عبارة تواصل جذابة", "cta": "نص زر التواصل" }
// }`;

// // ─────────────────────────────────────────────
// // AI CALLER
// // ─────────────────────────────────────────────

// async function callAI(systemPrompt: string, userMsg: string): Promise<string> {
//   const res = await client.chat.completions.create({
//     model: "llama-3.3-70b-versatile",
//     temperature: 0.75,
//     max_tokens: 2048,
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userMsg },
//     ],
//   });
//   return res.choices?.[0]?.message?.content || "";
// }

// // ─────────────────────────────────────────────
// // PARSERS
// // ─────────────────────────────────────────────

// function parseJSON(raw: string): any {
//   try {
//     const clean = raw
//       .replace(/```json\n?/g, "")
//       .replace(/```\n?/g, "")
//       .trim();
//     const i = clean.search(/[{[]/);
//     return i >= 0 ? JSON.parse(clean.slice(i)) : null;
//   } catch (err) {
//     console.error("JSON parsing error:", err);
//     return null;
//   }
// }

// function parseSVG(raw: string): string | null {
//   const clean = raw
//     .replace(/```xml\n?/g, "")
//     .replace(/```html\n?/g, "")
//     .replace(/```svg\n?/g, "")
//     .replace(/```\n?/g, "")
//     .trim();
//   const i = clean.indexOf("<svg");
//   return i >= 0 ? clean.slice(i).trim() : null;
// }

// // تنظيف وإصلاح SVG من AI
// function sanitizeSVG(raw: string): string {
//   if (!raw || !raw.includes("<svg")) return "";
//   let svg = raw.trim();

//   // ضيف xmlns لو مش موجود
//   if (!svg.includes("xmlns")) {
//     svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
//   }
//   // تأكد من viewBox
//   if (!svg.includes("viewBox")) {
//     svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
//   }
//   return svg;
// }

// function fallbackSVG(name: string, primary: string, secondary: string): string {
//   const init = (name || "BR").slice(0, 2).toUpperCase();
//   return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
//   <rect width="300" height="300" fill="${secondary}"/>
//   <circle cx="150" cy="115" r="68" fill="${primary}" opacity=".12"/>
//   <circle cx="150" cy="115" r="50" fill="${primary}" opacity=".2"/>
//   <circle cx="150" cy="115" r="36" fill="${primary}"/>
//   <text x="150" y="127" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="${secondary}">${init}</text>
//   <text x="150" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="600" fill="${primary}">${name}</text>
//   <rect x="80" y="218" width="140" height="1.5" fill="${primary}" opacity=".35" rx="1"/>
// </svg>`;
// }

// // ─────────────────────────────────────────────
// // TYPES
// // ─────────────────────────────────────────────

// export interface GenerateParams {
//   idea: string;
//   brandName?: string;
//   style: string;
//   colors: string[];
// }

// export interface BrandKitResult {
//   brand: any;
//   logo: string;
//   social: any;
//   landing: any;
//   brochureContent: any;
//   competitors: any;
// }

// // ─────────────────────────────────────────────
// // MAIN GENERATOR
// // ─────────────────────────────────────────────

// export const generateFullBrandKit = async (
//   params: GenerateParams
// ): Promise<BrandKitResult> => {
//   const { idea, brandName, style, colors } = params;

//   const styleMap: Record<string, string> = {
//     modern: "عصري",
//     luxury: "فاخر",
//     youth: "شبابي",
//     minimal: "بسيط",
//     arabic: "تراثي",
//     tech: "تقني",
//   };

//   const colorMap: Record<string, string> = {
//     gold: "ذهبي",
//     navy: "كحلي",
//     green: "أخضر",
//     red: "أحمر",
//     purple: "بنفسجي",
//     teal: "تيل",
//     black: "أسود",
//     coral: "مرجاني",
//   };

//   const styleName = styleMap[style] ?? style;
//   const colNames = colors.map((c) => colorMap[c] ?? c).join("، ");

//   const base = `فكرة المشروع بالتفصيل: ${idea}
// ${brandName ? `اسم البراند المحدد: ${brandName}` : "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
// الأسلوب البصري المطلوب: ${styleName}
// ${colNames ? `الألوان المفضلة: ${colNames}` : ""}
// تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة.`;

//   // ── Phase 1: Brand Identity ──
//   const brandRaw = await callAI(
//     SYS_BRAND,
//     base + "\nولّد Brand Kit كامل احترافي ومخصص لهذا المشروع."
//   );
//   const brand = parseJSON(brandRaw);

//   if (!brand) throw new Error("فشل تحليل Brand JSON من AI");

//   const primary = brand.colors?.[0]?.hex ?? "#C9973A";
//   const secondary = brand.colors?.[1]?.hex ?? "#13131E";

//   // استخرج الأسماء - الصيغة الجديدة (objects) أو القديمة (strings)
//   const namesList: string[] = (brand.names || []).map((n: any) =>
//     typeof n === "string" ? n : n.name
//   );
//   const displayName =
//     brandName ||
//     brand.recommendedName ||
//     namesList[0] ||
//     "Brand";

//   // ── Phase 2: Logo ──
//   let logo: string;
//   try {
//     const logoRaw = await callAI(
//       SYS_LOGO,
//       `Brand Name: ${displayName}
// Style: ${styleName}
// Primary Color: ${primary}
// Secondary Color: ${secondary}
// Brand Idea: ${idea.slice(0, 120)}
// Create a unique minimal geometric SVG logo that reflects this brand's identity.`
//     );
//     const parsed = parseSVG(logoRaw);
//     logo = parsed ? sanitizeSVG(parsed) : fallbackSVG(displayName, primary, secondary);
//   } catch (err) {
//     console.error("Logo error:", err);
//     logo = fallbackSVG(displayName, primary, secondary);
//   }

//   // ── Phase 3, 4, 5, 6 في parallel ──
//   const [socialRaw, landingRaw, brochureRaw, competitorsRaw] = await Promise.all([
//     callAI(
//       SYS_SOCIAL,
//       `${base}
// البراند: ${displayName}
// الشعار والرسالة: ${brand.tagline?.ar || ""}
// القيمة الفريدة: ${brand.strategy?.value || ""}
// الجمهور المستهدف: ${brand.strategy?.audience || ""}
// اصنع محتوى سوشيال مميز ومخصص لهذا البراند.`
//     ),
//     callAI(
//       SYS_LANDING,
//       `${base}
// البراند: ${displayName}
// الشعار: ${brand.tagline?.ar || ""}
// القيمة الفريدة: ${brand.strategy?.value || ""}
// الجمهور: ${brand.strategy?.audience || ""}
// التموضع: ${brand.strategy?.positioning || ""}
// اصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.`
//     ),
//     callAI(
//       SYS_BROCHURE,
//       `${base}
// البراند: ${displayName}
// الشعار: ${brand.tagline?.ar || ""}
// القيمة الفريدة: ${brand.strategy?.value || ""}
// الجمهور: ${brand.strategy?.audience || ""}
// الرسائل التسويقية: ${(brand.messages || []).join(" | ")}
// اصنع محتوى بروشور احترافي ومخصص لهذا البراند.`
//     ),
//     callAI(
//       SYS_COMPETITORS,
//       `فكرة المشروع: ${idea}
// البراند: ${displayName}
// السوق المستهدف: ${brand.strategy?.audience || ""}
// التموضع: ${brand.strategy?.positioning || ""}
// حلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`
//     ),
//   ]);

//   const social = parseJSON(socialRaw);
//   const landing = parseJSON(landingRaw);
//   const brochureContent = parseJSON(brochureRaw);
//   const competitors = parseJSON(competitorsRaw);

//   return {
//     brand,
//     logo,
//     social,
//     landing,
//     brochureContent,
//     competitors,
//   };
// };
























































































import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ─────────────────────────────────────────────
// SYSTEM PROMPTS
// ─────────────────────────────────────────────

const SYS_BRAND = `أنت خبير Brand Strategy للسوق العربي متخصص في ابتكار أسماء براند مميزة وفريدة.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences.

قواعد صارمة لاختيار الأسماء:
- الأسماء يجب أن تكون مبتكرة وفريدة وليست وصفية مباشرة
- تجنب تماماً الأسماء مثل "ساعة الفخامة" أو "وقت النجاح" - هذه عبارات وليست أسماء براند
- الأسماء الجيدة: قصيرة (1-2 كلمة)، سهلة النطق، لها وقع جميل، تحمل معنى عميق غير مباشر
- أمثلة على أسماء براند ناجحة: "نبض"، "زوايا"، "سمت"، "وهج"، "حقبة"، "أصيل"، "فجر"
- يمكن استخدام كلمات عربية أصيلة أو مزج إبداعي أو كلمات ذات جرس موسيقي جميل

الشكل المطلوب بالضبط:
{
  "names": [
    { "name": "اسم مبتكر وفريد ١", "reason": "سبب اختياره مرتبط بالمشروع", "meaning": "المعنى أو الإيحاء" },
    { "name": "اسم مبتكر وفريد ٢", "reason": "سبب اختياره", "meaning": "المعنى" },
    { "name": "اسم مبتكر وفريد ٣", "reason": "سبب اختياره", "meaning": "المعنى" }
  ],
  "recommendedName": "أفضل الأسماء الثلاثة",
  "tagline": { "ar": "شعار قصير وقوي", "en": "short powerful tagline" },
  "story": { "ar": "جملتان مخصصتان لهذا البراند", "en": "two specific sentences" },
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
  "messages": ["رسالة مخصصة ١", "رسالة مخصصة ٢", "رسالة مخصصة ٣"],
  "score": { "overall": 85, "identity": 88, "marketing": 82, "memory": 90, "arabicFit": 87 }
}
مهم جداً: كل شيء مخصص للمشروع المحدد، والأسماء يجب أن تكون أسماء براند حقيقية مبتكرة.`;

const SYS_LOGO = `You are a professional SVG logo designer specializing in Arabic luxury brands. Output ONLY raw SVG code starting with <svg. No markdown, no explanation, no fences.

CRITICAL RULES:
- viewBox="0 0 300 300" and xmlns="http://www.w3.org/2000/svg" ALWAYS
- Use ONLY the provided hex colors
- font-family="Arial, sans-serif" for all text
- NO external resources, NO images, NO scripts, NO filters with feImage

DESIGN REQUIREMENTS - create a BEAUTIFUL, PROFESSIONAL logo:
1. Background: filled rectangle with secondary color
2. Main symbol: geometric shape that reflects the brand concept (circle, diamond, hexagon, star, etc.)
3. Inner decorative element: smaller shapes, lines, or patterns using primary color
4. Brand name: clear, well-positioned text using primary color
5. Optional: tagline or decorative line under the name
6. Use opacity and layering for depth (opacity="0.15", opacity="0.4", etc.)
7. Minimum 8-12 SVG elements for visual richness

EXAMPLE structure:
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="[secondary]"/>
  [decorative background shapes with low opacity]
  [main geometric symbol]
  [inner symbol details]
  [brand name text]
  [decorative line or tagline]
</svg>

Make it look like a real premium brand logo, not a simple placeholder.`;

const SYS_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي متخصص في بناء استراتيجيات محتوى متكاملة.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
مهم جداً: كل المحتوى مخصص لهذا البراند تحديداً، لا كلام عام أبداً.
{
  "contentMap": [
    { "category": "Lifestyle", "pct": 40, "color": "#C9973A", "desc": "وصف نوع المحتوى", "examples": ["مثال بصري ١", "مثال بصري ٢", "مثال بصري ٣"] },
    { "category": "عرض المنتج/الخدمة", "pct": 30, "color": "#60A5FA", "desc": "", "examples": ["", "", ""] },
    { "category": "قصص البراند", "pct": 20, "color": "#4ADE80", "desc": "", "examples": ["", "", ""] },
    { "category": "عروض وتفاعل", "pct": 10, "color": "#F87171", "desc": "", "examples": ["", ""] }
  ],
  "postIdeas": [
    { "type": "صورة", "platform": "Instagram", "title": "عنوان الفكرة", "visual": "وصف المشهد البصري بالتفصيل", "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2", "category": "Lifestyle" },
    { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج" },
    { "type": "كاروسيل", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "قصص البراند" },
    { "type": "صورة", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عروض وتفاعل" },
    { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "Lifestyle" },
    { "type": "صورة", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج" }
  ],
  "videoIdeas": [
    { "platform": "TikTok", "duration": "30 ثانية", "hook": "الجملة الافتتاحية الصادمة", "concept": "فكرة الفيديو", "scenes": ["مشهد ١", "مشهد ٢", "مشهد ٣"], "music": "نوع الموسيقى المناسب", "cta": "نداء الإجراء" },
    { "platform": "TikTok", "duration": "60 ثانية", "hook": "", "concept": "", "scenes": ["", "", ""], "music": "", "cta": "" },
    { "platform": "Instagram Reels", "duration": "15 ثانية", "hook": "", "concept": "", "scenes": ["", ""], "music": "", "cta": "" },
    { "platform": "YouTube Shorts", "duration": "45 ثانية", "hook": "", "concept": "", "scenes": ["", "", ""], "music": "", "cta": "" }
  ],
  "instagram": [
    { "caption": "نص جاهز للنشر مع إيموجي", "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5", "theme": "موضوع المنشور" },
    { "caption": "", "hashtags": "", "theme": "" },
    { "caption": "", "hashtags": "", "theme": "" }
  ],
  "twitter": [
    { "text": "تغريدة قوية ومميزة" },
    { "text": "" },
    { "text": "" }
  ],
  "strategy": {
    "bestTimes": "أفضل أوقات النشر",
    "frequency": "معدل النشر الأسبوعي",
    "pillars": ["عمود ١", "عمود ٢", "عمود ٣"],
    "tone": "نبرة المحتوى",
    "weeklyPlan": [
      { "day": "الأحد", "content": "نوع المحتوى", "platform": "المنصة" },
      { "day": "الاثنين", "content": "", "platform": "" },
      { "day": "الثلاثاء", "content": "", "platform": "" },
      { "day": "الأربعاء", "content": "", "platform": "" },
      { "day": "الخميس", "content": "", "platform": "" },
      { "day": "الجمعة", "content": "", "platform": "" },
      { "day": "السبت", "content": "", "platform": "" }
    ]
  }
}`;

const SYS_LANDING = `أنت مصمم Landing Pages محترف للسوق العربي. مهمتك إنشاء محتوى صفحة هبوط مخصص وفريد لكل براند.
قواعد صارمة:
- العنوان الرئيسي يجب أن يكون قوياً وخاصاً بهذا البراند فقط
- لا تستخدم عبارات عامة مثل "أهلاً بكم" أو "نحن نقدم"
- كل feature يجب أن تعكس ميزة حقيقية من المشروع المحدد
- شهادة العميل يجب أن تكون مناسبة لطبيعة المشروع
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "hero": {
    "headline": "عنوان قوي جداً وخاص بهذا البراند - ليس عاماً",
    "subheadline": "جملة توضيحية تشرح القيمة الفريدة للمشروع",
    "cta": "نص زر محدد وجذاب"
  },
  "features": [
    { "emoji": "🎯", "title": "ميزة حقيقية من المشروع", "desc": "وصف مفصل يعكس طبيعة العمل" },
    { "emoji": "⚡", "title": "", "desc": "" },
    { "emoji": "✨", "title": "", "desc": "" },
    { "emoji": "🚀", "title": "", "desc": "" }
  ],
  "testimonial": {
    "text": "تجربة عميل حقيقية ومقنعة تناسب هذا النوع من المشاريع",
    "name": "اسم عربي مناسب",
    "role": "وظيفة أو صفة مناسبة للجمهور المستهدف"
  },
  "stats": [
    { "value": "500+", "label": "إحصائية مناسبة للمشروع" },
    { "value": "98%", "label": "" },
    { "value": "24/7", "label": "" }
  ],
  "cta": {
    "headline": "عنوان CTA قوي وخاص",
    "subheadline": "جملة تحفيزية",
    "button": "نص زر واضح"
  }
}`;

const SYS_COMPETITORS = `أنت محلل أسواق متخصص في السوق العربي. بناءً على وصف المشروع، قدم تحليلاً للمنافسين والسوق.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "marketOverview": "نظرة عامة على السوق بـ 2-3 جمل",
  "competitors": [
    {
      "name": "اسم المنافس أو النوع",
      "type": "مباشر / غير مباشر",
      "strengths": "نقاط قوته",
      "weaknesses": "نقاط ضعفه",
      "website": "domain.com إن وجد",
      "marketShare": "كبير / متوسط / صغير"
    }
  ],
  "gaps": ["فرصة في السوق ١", "فرصة في السوق ٢", "فرصة في السوق ٣"],
  "differentiators": ["ما يجعل مشروعك مختلفاً ١", "ما يجعل مشروعك مختلفاً ٢"],
  "searchKeywords": ["كلمة بحثية ١", "كلمة بحثية ٢", "كلمة بحثية ٣"],
  "marketSize": "صغير / متوسط / كبير / ضخم",
  "competitionLevel": "منخفض / متوسط / عالي / شرس",
  "recommendation": "توصية استراتيجية مختصرة للدخول للسوق"
}`;

const SYS_BROCHURE = `أنت مصمم بروشورات احترافية للسوق العربي. أنشئ محتوى بروشور مخصصاً وفريداً لهذا البراند.
لا تستخدم عبارات عامة أو مكررة. كل نقطة يجب أن تعكس طبيعة المشروع المحدد.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "headline": "عنوان البروشور الرئيسي - قوي وخاص",
  "intro": "مقدمة مخصصة للبراند - 3 جمل تشرح القيمة الفريدة",
  "sections": [
    { "title": "عنوان قسم مخصص", "content": "محتوى القسم مرتبط بطبيعة المشروع" },
    { "title": "", "content": "" },
    { "title": "", "content": "" }
  ],
  "services": [
    { "icon": "🎯", "name": "خدمة أو منتج حقيقي من المشروع", "brief": "وصف مختصر" },
    { "icon": "⚡", "name": "", "brief": "" },
    { "icon": "✨", "name": "", "brief": "" }
  ],
  "whyUs": ["سبب اختيارنا ١ - خاص بهذا البراند", "سبب ٢", "سبب ٣", "سبب ٤"],
  "contact": { "tagline": "عبارة تواصل جذابة", "cta": "نص زر التواصل" }
}`;

// ─────────────────────────────────────────────
// AI CALLER
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// AI CALLER with retry on rate limit
// ─────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callAI(systemPrompt: string, userMsg: string, retries = 3): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.75,
        max_tokens: 1800,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
      });
      return res.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.code === "rate_limit_exceeded";
      if (isRateLimit && attempt < retries - 1) {
        // استخرج وقت الانتظار من الـ header أو استخدم 15 ثانية افتراضي
        const retryAfter = parseInt(err?.headers?.["retry-after"] || "15", 10);
        const waitMs = (retryAfter + 2) * 1000;
        console.log(`Rate limit hit, waiting ${retryAfter + 2}s before retry ${attempt + 1}/${retries - 1}...`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  return "";
}

// ─────────────────────────────────────────────
// PARSERS
// ─────────────────────────────────────────────

function parseJSON(raw: string): any {
  try {
    const clean = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const i = clean.search(/[{[]/);
    return i >= 0 ? JSON.parse(clean.slice(i)) : null;
  } catch (err) {
    console.error("JSON parsing error:", err);
    return null;
  }
}

function parseSVG(raw: string): string | null {
  const clean = raw
    .replace(/```xml\n?/g, "")
    .replace(/```html\n?/g, "")
    .replace(/```svg\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  const i = clean.indexOf("<svg");
  return i >= 0 ? clean.slice(i).trim() : null;
}

// تنظيف وإصلاح SVG من AI
function sanitizeSVG(raw: string): string {
  if (!raw || !raw.includes("<svg")) return "";
  let svg = raw.trim();

  // ضيف xmlns لو مش موجود
  if (!svg.includes("xmlns")) {
    svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  }
  // تأكد من viewBox
  if (!svg.includes("viewBox")) {
    svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
  }
  return svg;
}

function fallbackSVG(name: string, primary: string, secondary: string): string {
  const init = (name || "BR").slice(0, 2).toUpperCase();
  return `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="${secondary}"/>
  <circle cx="150" cy="115" r="68" fill="${primary}" opacity=".12"/>
  <circle cx="150" cy="115" r="50" fill="${primary}" opacity=".2"/>
  <circle cx="150" cy="115" r="36" fill="${primary}"/>
  <text x="150" y="127" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" font-weight="700" fill="${secondary}">${init}</text>
  <text x="150" y="200" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="600" fill="${primary}">${name}</text>
  <rect x="80" y="218" width="140" height="1.5" fill="${primary}" opacity=".35" rx="1"/>
</svg>`;
}

// ─────────────────────────────────────────────
// TYPES
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
  social: any;
  landing: any;
  brochureContent: any;
  competitors: any;
}

// ─────────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────────

export const generateFullBrandKit = async (
  params: GenerateParams
): Promise<BrandKitResult> => {
  const { idea, brandName, style, colors } = params;

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

  const base = `فكرة المشروع بالتفصيل: ${idea}
${brandName ? `اسم البراند المحدد: ${brandName}` : "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
الأسلوب البصري المطلوب: ${styleName}
${colNames ? `الألوان المفضلة: ${colNames}` : ""}
تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة.`;

  // ── Phase 1: Brand Identity ──
  const brandRaw = await callAI(
    SYS_BRAND,
    base + "\nولّد Brand Kit كامل احترافي ومخصص لهذا المشروع."
  );
  const brand = parseJSON(brandRaw);

  if (!brand) throw new Error("فشل تحليل Brand JSON من AI");

  const primary = brand.colors?.[0]?.hex ?? "#C9973A";
  const secondary = brand.colors?.[1]?.hex ?? "#13131E";

  // استخرج الأسماء - الصيغة الجديدة (objects) أو القديمة (strings)
  const namesList: string[] = (brand.names || []).map((n: any) =>
    typeof n === "string" ? n : n.name
  );
  const displayName =
    brandName ||
    brand.recommendedName ||
    namesList[0] ||
    "Brand";

  // ── Phase 2: Logo ──
  let logo: string;
  try {
    const logoRaw = await callAI(
      SYS_LOGO,
      `Brand Name: ${displayName}
Style: ${styleName}
Primary Color: ${primary}
Secondary Color: ${secondary}
Brand Idea: ${idea.slice(0, 120)}
Create a unique minimal geometric SVG logo that reflects this brand's identity.`
    );
    const parsed = parseSVG(logoRaw);
    logo = parsed ? sanitizeSVG(parsed) : fallbackSVG(displayName, primary, secondary);
  } catch (err) {
    console.error("Logo error:", err);
    logo = fallbackSVG(displayName, primary, secondary);
  }

  // ── Phase 3→6: Sequential مع delay عشان نتجنب الـ rate limit ──
  console.log("Generating social...");
  const socialRaw = await callAI(
    SYS_SOCIAL,
    `${base}
البراند: ${displayName}
الشعار والرسالة: ${brand.tagline?.ar || ""}
القيمة الفريدة: ${brand.strategy?.value || ""}
الجمهور المستهدف: ${brand.strategy?.audience || ""}
اصنع محتوى سوشيال مميز ومخصص لهذا البراند.`
  );
  await sleep(3000);

  console.log("Generating landing...");
  const landingRaw = await callAI(
    SYS_LANDING,
    `${base}
البراند: ${displayName}
الشعار: ${brand.tagline?.ar || ""}
القيمة الفريدة: ${brand.strategy?.value || ""}
الجمهور: ${brand.strategy?.audience || ""}
التموضع: ${brand.strategy?.positioning || ""}
اصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.`
  );
  await sleep(3000);

  console.log("Generating brochure...");
  const brochureRaw = await callAI(
    SYS_BROCHURE,
    `${base}
البراند: ${displayName}
الشعار: ${brand.tagline?.ar || ""}
القيمة الفريدة: ${brand.strategy?.value || ""}
الجمهور: ${brand.strategy?.audience || ""}
الرسائل التسويقية: ${(brand.messages || []).join(" | ")}
اصنع محتوى بروشور احترافي ومخصص لهذا البراند.`
  );
  await sleep(3000);

  console.log("Generating competitors...");
  const competitorsRaw = await callAI(
    SYS_COMPETITORS,
    `فكرة المشروع: ${idea}
البراند: ${displayName}
السوق المستهدف: ${brand.strategy?.audience || ""}
التموضع: ${brand.strategy?.positioning || ""}
حلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`
  );

  const social = parseJSON(socialRaw);
  const landing = parseJSON(landingRaw);
  const brochureContent = parseJSON(brochureRaw);
  const competitors = parseJSON(competitorsRaw);

  return {
    brand,
    logo,
    social,
    landing,
    brochureContent,
    competitors,
  };
};

// ─────────────────────────────────────────────
// EXTRA SOCIAL CONTENT (paid)
// ─────────────────────────────────────────────

const SYS_EXTRA_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي. ولّد محتوى سوشيال إضافي جديد تماماً ومختلف.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "postIdeas": [
    { "type": "صورة", "platform": "Instagram", "title": "عنوان فكرة جديدة", "visual": "وصف المشهد البصري", "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "category": "Lifestyle" },
    { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج/الخدمة" },
    { "type": "كاروسيل", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "قصص البراند" }
  ],
  "videoIdeas": [
    { "platform": "TikTok", "duration": "30 ثانية", "hook": "جملة افتتاحية جديدة", "concept": "فكرة جديدة", "scenes": ["مشهد ١", "مشهد ٢", "مشهد ٣"], "music": "نوع الموسيقى", "cta": "نداء الإجراء" },
    { "platform": "Instagram Reels", "duration": "15 ثانية", "hook": "", "concept": "", "scenes": ["", ""], "music": "", "cta": "" }
  ],
  "instagram": [
    { "caption": "نص جديد مختلف مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "theme": "موضوع مختلف" },
    { "caption": "", "hashtags": "", "theme": "" }
  ],
  "twitter": [
    { "text": "تغريدة جديدة ومختلفة" },
    { "text": "" }
  ]
}`;

export interface ExtraSocialParams {
  idea: string;
  brandName: string;
  style: string;
  tagline: string;
  audience: string;
  value: string;
}

export const generateExtraSocialContent = async (
  params: ExtraSocialParams
): Promise<{ postIdeas: any[]; videoIdeas: any[]; instagram: any[]; twitter: any[] }> => {
  const raw = await callAI(
    SYS_EXTRA_SOCIAL,
    `فكرة المشروع: ${params.idea}
البراند: ${params.brandName}
الشعار: ${params.tagline}
الجمهور: ${params.audience}
القيمة الفريدة: ${params.value}
الأسلوب: ${params.style}
ولّد محتوى سوشيال جديد وإبداعي مختلف تماماً عن أي منشورات سابقة.`
  );

  const parsed = parseJSON(raw);
  return {
    postIdeas:  parsed?.postIdeas  || [],
    videoIdeas: parsed?.videoIdeas || [],
    instagram:  parsed?.instagram  || [],
    twitter:    parsed?.twitter    || [],
  };
};

// ─────────────────────────────────────────────
// STANDALONE: Competitors Only (for old projects)
// ─────────────────────────────────────────────

export interface CompetitorsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
}

export const generateCompetitorsOnly = async (
  params: CompetitorsOnlyParams
): Promise<any | null> => {
  const raw = await callAI(
    SYS_COMPETITORS,
    `فكرة المشروع: ${params.idea}
البراند: ${params.brandName}
السوق المستهدف: ${params.audience}
التموضع: ${params.positioning}
حلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`
  );
  return parseJSON(raw);
};

// ─────────────────────────────────────────────
// STANDALONE: Brochure Content Only (for old projects)
// ─────────────────────────────────────────────

export interface BrochureOnlyParams {
  idea: string;
  brandName: string;
  tagline: string;
  value: string;
  audience: string;
  messages: string[];
  style: string;
}

export const generateBrochureOnly = async (
  params: BrochureOnlyParams
): Promise<any | null> => {
  const raw = await callAI(
    SYS_BROCHURE,
    `فكرة المشروع بالتفصيل: ${params.idea}
اسم البراند: ${params.brandName}
الشعار: ${params.tagline}
القيمة الفريدة: ${params.value}
الجمهور: ${params.audience}
الرسائل التسويقية: ${params.messages.join(" | ")}
الأسلوب البصري: ${params.style}
اصنع محتوى بروشور احترافي ومخصص لهذا البراند.`
  );
  return parseJSON(raw);
};