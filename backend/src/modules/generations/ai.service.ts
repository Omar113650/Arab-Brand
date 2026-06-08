
//   اللي فوق ده عملته يوم الماتش  اللي مستخدمه اصلا
//  ده يوم الماتش الللي فوق الاصلي  اللي شغال 


// import OpenAI from "openai";
// import { InferenceClient } from "@huggingface/inference";

// const client = new OpenAI({
//   apiKey: process.env.GROQ_API_KEY,
//   baseURL: "https://api.groq.com/openai/v1",
// });

// const hfClient = new InferenceClient(process.env.HF_TOKEN);

// // ─────────────────────────────────────────────
// // SYSTEM PROMPTS
// // ─────────────────────────────────────────────

// const SYS_BRAND = `أنت خبير Brand Strategy للسوق العربي متخصص في ابتكار أسماء براند مميزة وفريدة.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences.

// قواعد صارمة لاختيار الأسماء:
// - الأسماء يجب أن تكون مبتكرة وفريدة وليست وصفية مباشرة
// - تجنب تماماً الأسماء مثل "ساعة الفخامة" أو "وقت النجاح" - هذه عبارات وليست أسماء براند
// - الأسماء الجيدة: قصيرة (1-2 كلمة)، سهلة النطق، لها وقع جميل، تحمل معنى عميق غير مباشر
// - أمثلة على أسماء براند ناجحة: "نبض"، "زوايا"، "سمت"، "وهج"، "حقبة"، "أصيل"، "فجر"
// - يمكن استخدام كلمات عربية أصيلة أو مزج إبداعي أو كلمات ذات جرس موسيقي جميل

// الشكل المطلوب بالضبط:
// {
//   "names": [
//     { "name": "اسم مبتكر وفريد ١", "reason": "سبب اختياره مرتبط بالمشروع", "meaning": "المعنى أو الإيحاء" },
//     { "name": "اسم مبتكر وفريد ٢", "reason": "سبب اختياره", "meaning": "المعنى" },
//     { "name": "اسم مبتكر وفريد ٣", "reason": "سبب اختياره", "meaning": "المعنى" }
//   ],
//   "recommendedName": "أفضل الأسماء الثلاثة",
//   "tagline": { "ar": "شعار قصير وقوي", "en": "short powerful tagline" },
//   "story": { "ar": "جملتان مخصصتان لهذا البراند", "en": "two specific sentences" },
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
// مهم جداً: كل شيء مخصص للمشروع المحدد، والأسماء يجب أن تكون أسماء براند حقيقية مبتكرة.`;

// const SYS_LOGO_PROMPT = `You are a world-class logo prompt engineer for AI image generators. Your job is to write a highly detailed, professional visual prompt to create a luxury, corporate logo.

// Output ONLY the prompt text in English. No JSON, no markdown, no explanation.

// RULES FOR THE PROMPT:
// 1. Start with: "A high-end professional corporate logo design for [Brand Name], representing [Concept]."
// 2. Visual Style: Masterpiece minimalist, ultra-clean vector style, flat design, sharp golden ratio geometry, perfectly centered composition, symmetric layout.
// 3. Color Palette: Use the exact colors provided ([Primary] and [Secondary]) on a clean, solid, plain flat background (no gradients, no textures).
// 4. Artistic Quality: "Designed by a top branding agency, sleek modern aesthetics, fine lines, sharp edges, Adobe Illustrator render, 8k resolution, trending on Dribbble."
// 5. CRITICAL - NO TEXT ALLOWED: The logo must be ICON ONLY. Absolutely NO letters, NO words, NO typography, NO text elements inside the image.
// 6. Abstract Symbolism: Focus on high-end abstract or symbolic shapes that seamlessly reflect the brand's industry and core value. Keep it under 100 words.`;

// const SYS_LOGO = `You are a professional SVG logo designer specializing in Arabic luxury brands. Output ONLY raw SVG code starting with <svg. No markdown, no explanation, no fences.

// CRITICAL RULES:
// - viewBox="0 0 300 300" and xmlns="http://www.w3.org/2000/svg" ALWAYS
// - Use ONLY the provided hex colors
// - font-family="Arial, sans-serif" for all text
// - NO external resources, NO images, NO scripts, NO filters with feImage

// DESIGN REQUIREMENTS - create a BEAUTIFUL, PROFESSIONAL logo:
// 1. Background: filled rectangle with secondary color
// 2. Main symbol: geometric shape that reflects the brand concept (circle, diamond, hexagon, star, etc.)
// 3. Inner decorative element: smaller shapes, lines, or patterns using primary color
// 4. Brand name: clear, well-positioned text using primary color
// 5. Optional: tagline or decorative line under the name
// 6. Use opacity and layering for depth (opacity="0.15", opacity="0.4", etc.)
// 7. Minimum 8-12 SVG elements for visual richness

// Make it look like a real premium brand logo, not a simple placeholder.`;

// const SYS_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي متخصص في بناء استراتيجيات محتوى متكاملة.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences.
// مهم جداً: كل المحتوى مخصص لهذا البراند تحديداً، لا كلام عام أبداً.
// {
//   "contentMap": [
//     { "category": "Lifestyle", "pct": 40, "color": "#C9973A", "desc": "وصف نوع المحتوى", "examples": ["مثال بصري ١", "مثال بصري ٢", "مثال بصري ٣"] },
//     { "category": "عرض المنتج/الخدمة", "pct": 30, "color": "#60A5FA", "desc": "", "examples": ["", "", ""] },
//     { "category": "قصص البراند", "pct": 20, "color": "#4ADE80", "desc": "", "examples": ["", "", ""] },
//     { "category": "عروض وتفاعل", "pct": 10, "color": "#F87171", "desc": "", "examples": ["", ""] }
//   ],
//   "postIdeas": [
//     { "type": "صورة", "platform": "Instagram", "title": "عنوان الفكرة", "visual": "وصف المشهد البصري بالتفصيل", "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2", "category": "Lifestyle" },
//     { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج" },
//     { "type": "كاروسيل", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "قصص البراند" },
//     { "type": "صورة", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عروض وتفاعل" },
//     { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "Lifestyle" },
//     { "type": "صورة", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج" }
//   ],
//   "videoIdeas": [
//     { "platform": "TikTok", "duration": "30 ثانية", "hook": "الجملة الافتتاحية الصادمة", "concept": "فكرة الفيديو", "scenes": ["مشهد ١", "مشهد ٢", "مشهد ٣"], "music": "نوع الموسيقى المناسب", "cta": "نداء الإجراء" },
//     { "platform": "TikTok", "duration": "60 ثانية", "hook": "", "concept": "", "scenes": ["", "", ""], "music": "", "cta": "" },
//     { "platform": "Instagram Reels", "duration": "15 ثانية", "hook": "", "concept": "", "scenes": ["", ""], "music": "", "cta": "" },
//     { "platform": "YouTube Shorts", "duration": "45 ثانية", "hook": "", "concept": "", "scenes": ["", "", ""], "music": "", "cta": "" }
//   ],
//   "instagram": [
//     { "caption": "نص جاهز للنشر مع إيموجي", "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5", "theme": "موضوع المنشور" },
//     { "caption": "", "hashtags": "", "theme": "" },
//     { "caption": "", "hashtags": "", "theme": "" }
//   ],
//   "twitter": [
//     { "text": "تغريدة قوية ومميزة" },
//     { "text": "" },
//     { "text": "" }
//   ],
//   "strategy": {
//     "bestTimes": "أفضل أوقات النشر",
//     "frequency": "معدل النشر الأسبوعي",
//     "pillars": ["عمود ١", "عمود ٢", "عمود ٣"],
//     "tone": "نبرة المحتوى",
//     "weeklyPlan": [
//       { "day": "الأحد", "content": "نوع المحتوى", "platform": "المنصة" },
//       { "day": "الاثنين", "content": "", "platform": "" },
//       { "day": "الثلاثاء", "content": "", "platform": "" },
//       { "day": "الأربعاء", "content": "", "platform": "" },
//       { "day": "الخميس", "content": "", "platform": "" },
//       { "day": "الجمعة", "content": "", "platform": "" },
//       { "day": "السبت", "content": "", "platform": "" }
//     ]
//   }
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

// const SYS_OBJECTIONS = `أنت خبير مبيعات ومفاوضات للسوق العربي. مهمتك إنشاء ردود احترافية ومقنعة على اعتراضات العملاء الشائعة.
// قواعد صارمة:
// - كل رد يجب أن يكون مخصصاً لهذا البراند والمشروع تحديداً
// - الردود يجب أن تكون مقنعة وإنسانية وليست دفاعية
// - استخدم أسلوب "Feel, Felt, Found" و"Reframe" و"Social Proof" بشكل ذكي
// - قدم دائماً قيمة حقيقية وليس مجرد تبرير
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "objections": [
//     {
//       "objection": "أنت غالي مقارنة بالمنافسين",
//       "category": "السعر",
//       "psychologyBehind": "العميل يبحث عن تبرير للقيمة مقابل السعر",
//       "response": "رد مقنع كامل بصوت البراند - 3-4 جمل",
//       "keyPoints": ["نقطة إقناع ١", "نقطة إقناع ٢", "نقطة إقناع ٣"],
//       "reframe": "كيف تحول الاعتراض لميزة",
//       "closingLine": "جملة ختامية قوية تدفع للقرار"
//     },
//     {
//       "objection": "عندك منافس بنفس الخدمة",
//       "category": "المنافسة",
//       "psychologyBehind": "",
//       "response": "",
//       "keyPoints": ["", "", ""],
//       "reframe": "",
//       "closingLine": ""
//     },
//     {
//       "objection": "محتاج أفكر وأرجعلك",
//       "category": "التردد",
//       "psychologyBehind": "",
//       "response": "",
//       "keyPoints": ["", ""],
//       "reframe": "",
//       "closingLine": ""
//     },
//     {
//       "objection": "مش متأكد إن ده هينفع معايا",
//       "category": "الشك",
//       "psychologyBehind": "",
//       "response": "",
//       "keyPoints": ["", "", ""],
//       "reframe": "",
//       "closingLine": ""
//     },
//     {
//       "objection": "مش وقته دلوقتي",
//       "category": "التوقيت",
//       "psychologyBehind": "",
//       "response": "",
//       "keyPoints": ["", ""],
//       "reframe": "",
//       "closingLine": ""
//     }
//   ],
//   "generalTips": ["نصيحة في التعامل مع الاعتراضات ١", "نصيحة ٢", "نصيحة ٣"],
//   "salesVoice": "نبرة المبيعات المناسبة لهذا البراند"
// }`;

// const SYS_PRODUCT_FOCUS = `أنت مستشار أعمال استراتيجي للسوق العربي متخصص في تطوير المنتجات والخدمات.
// مهمتك: استناداً لفكرة البراند، اقترح منتجات/خدمات ممكنة وحدد الأولوية الذكية للبدء.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "allProducts": [
//     {
//       "name": "اسم المنتج أو الخدمة",
//       "description": "وصف مختصر",
//       "targetAudience": "الجمهور المستهدف لهذا المنتج",
//       "revenueModel": "نموذج الإيراد (اشتراك / مرة واحدة / عمولة / إلخ)",
//       "complexity": "بسيط / متوسط / معقد",
//       "timeToMarket": "1 شهر / 3 أشهر / 6 أشهر / سنة",
//       "investmentLevel": "منخفض / متوسط / مرتفع",
//       "potentialRevenue": "منخفض / متوسط / مرتفع / ضخم"
//     }
//   ],
//   "priorityRecommendation": {
//     "focusNow": ["اسم المنتج الأول للتركيز", "اسم المنتج الثاني للتركيز"],
//     "focusLater": ["منتج للمرحلة القادمة ١", "منتج للمرحلة القادمة ٢"],
//     "avoid": ["منتج يُفضل تأجيله الآن"],
//     "reasoning": "شرح مفصل لسبب هذه التوصية بناءً على السوق والموارد والتوقيت",
//     "quickWin": "المنتج الذي يجلب عائداً سريعاً في أقل وقت",
//     "longTermBet": "المنتج ذو الإمكانية الأعلى على المدى البعيد"
//   },
//   "bundlingIdeas": [
//     { "bundle": "اسم الباقة", "products": ["منتج ١", "منتج ٢"], "benefit": "الفائدة من الجمع" }
//   ],
//   "pricingStrategy": {
//     "approach": "استراتيجية التسعير المقترحة",
//     "anchor": "سعر المرساة أو النموذج المقترح",
//     "tiers": [
//       { "name": "اسم الباقة", "price": "السعر المقترح", "includes": ["ما تشمله"] }
//     ]
//   }
// }`;

// const SYS_LAUNCH_PLAN = `أنت خبير إطلاق مشاريع ومنتجات للسوق العربي. ضع خطة إطلاق تفصيلية وعملية وقابلة للتنفيذ.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "overview": {
//     "totalDuration": "مدة الإطلاق الكاملة",
//     "budget": "ميزانية مقترحة للإطلاق",
//     "mainGoal": "الهدف الرئيسي من الإطلاق",
//     "successMetrics": ["مقياس نجاح ١", "مقياس نجاح ٢", "مقياس نجاح ٣"]
//   },
//   "phases": [
//     {
//       "phase": 1,
//       "name": "مرحلة التحضير",
//       "duration": "الأسبوع 1-2",
//       "goal": "هدف هذه المرحلة",
//       "tasks": [
//         { "task": "المهمة بالتفصيل", "owner": "المسؤول (أنت / فريق التسويق / مطور)", "deadline": "نهاية الأسبوع ١", "priority": "عالي / متوسط / منخفض" }
//       ],
//       "deliverables": ["مخرج ١", "مخرج ٢"],
//       "budget": "الميزانية المخصصة لهذه المرحلة"
//     },
//     {
//       "phase": 2,
//       "name": "مرحلة البناء",
//       "duration": "الأسبوع 3-4",
//       "goal": "",
//       "tasks": [
//         { "task": "", "owner": "", "deadline": "", "priority": "" }
//       ],
//       "deliverables": ["", ""],
//       "budget": ""
//     },
//     {
//       "phase": 3,
//       "name": "مرحلة الإطلاق الناعم",
//       "duration": "الأسبوع 5-6",
//       "goal": "",
//       "tasks": [
//         { "task": "", "owner": "", "deadline": "", "priority": "" }
//       ],
//       "deliverables": ["", ""],
//       "budget": ""
//     },
//     {
//       "phase": 4,
//       "name": "مرحلة الإطلاق الرسمي",
//       "duration": "الأسبوع 7-8",
//       "goal": "",
//       "tasks": [
//         { "task": "", "owner": "", "deadline": "", "priority": "" }
//       ],
//       "deliverables": ["", ""],
//       "budget": ""
//     },
//     {
//       "phase": 5,
//       "name": "مرحلة النمو والتحسين",
//       "duration": "الشهر 3-6",
//       "goal": "",
//       "tasks": [
//         { "task": "", "owner": "", "deadline": "", "priority": "" }
//       ],
//       "deliverables": ["", ""],
//       "budget": ""
//     }
//   ],
//   "channels": [
//     { "channel": "Instagram", "strategy": "استراتيجية هذا القناة للإطلاق", "budget": "الميزانية", "expectedReach": "الوصول المتوقع" }
//   ],
//   "contentCalendar": {
//     "week1": ["محتوى اليوم الأول", "محتوى اليوم الثاني", "محتوى اليوم الثالث"],
//     "week2": ["", "", ""],
//     "launchDay": { "activities": ["نشاط ١", "نشاط ٢", "نشاط ٣"], "posts": ["منشور ١", "منشور ٢"] }
//   },
//   "contingency": {
//     "ifSlowStart": "ماذا تفعل لو الإطلاق بطيء",
//     "ifViral": "كيف تتعامل لو انتشر بشكل كبير",
//     "criticalRisks": ["خطر محتمل ١", "خطر محتمل ٢"]
//   }
// }`;

// const SYS_SWOT = `أنت مستشار أعمال استراتيجي متخصص في تحليل المخاطر والفرص للسوق العربي.
// قدم تحليلاً شاملاً وصريحاً وعملياً - لا تجامل، قل الحقيقة.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "swot": {
//     "strengths": [
//       { "point": "نقطة قوة حقيقية", "impact": "عالي / متوسط / منخفض", "howToLeverage": "كيف تستفيد منها" }
//     ],
//     "weaknesses": [
//       { "point": "نقطة ضعف حقيقية", "impact": "عالي / متوسط / منخفض", "howToAddress": "كيف تعالجها" }
//     ],
//     "opportunities": [
//       { "point": "فرصة في السوق", "timeframe": "قريب / متوسط / بعيد", "howToCapture": "كيف تستغلها" }
//     ],
//     "threats": [
//       { "point": "تهديد حقيقي", "probability": "عالي / متوسط / منخفض", "mitigation": "كيف تتجنبه أو تخففه" }
//     ]
//   },
//   "risks": [
//     {
//       "risk": "وصف الخطر بوضوح",
//       "category": "مالي / تشغيلي / تسويقي / قانوني / تقني",
//       "probability": "عالي / متوسط / منخفض",
//       "impact": "كارثي / كبير / متوسط / صغير",
//       "riskScore": "1-10",
//       "earlyWarnings": ["علامة تحذير مبكرة ١", "علامة تحذير مبكرة ٢"],
//       "mitigation": "خطة التخفيف من هذا الخطر",
//       "contingency": "ماذا تفعل لو حدث رغم كل شيء"
//     }
//   ],
//   "overallRiskLevel": "منخفض / متوسط / عالي / مرتفع جداً",
//   "criticalSuccessFactors": ["عامل نجاح حاسم ١", "عامل نجاح حاسم ٢", "عامل نجاح حاسم ٣"],
//   "founderAdvice": "نصيحة صريحة وعملية لصاحب المشروع بناءً على هذا التحليل - 3-4 جمل حقيقية",
//   "verdict": {
//     "goOrNoGo": "go / no-go / proceed-with-caution",
//     "confidence": "نسبة الثقة في نجاح المشروع كرقم من 1-100",
//     "mainReason": "السبب الرئيسي للحكم"
//   }
// }`;

// // ─────────────────────────────────────────────
// // AGE SEGMENTS SYSTEM PROMPT  ← جديد
// // ─────────────────────────────────────────────

// const SYS_AGE_SEGMENTS = `أنت خبير دراسة سوق وتحليل شرائح عمرية للمنطقة العربية.
// مهمتك تقسيم السوق المستهدف لشرائح عمرية مناسبة للبراند المحدد، مع تفاصيل عملية وقابلة للتنفيذ.

// قواعد صارمة:
// - عدد الشرائح: 3 إلى 5 حسب طبيعة المشروع، لا أكثر
// - كل شريحة يجب أن تكون مختلفة نفسياً وسلوكياً عن غيرها، مش بس في السن
// - المنتجات والتوصيات يجب أن تكون مخصصة لهذا البراند تحديداً، لا عامة
// - خطة التوسع يجب أن تكون تدريجية ومنطقية

// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "segments": [
//     {
//       "ageRange": "18-24",
//       "name": "اسم وصفي مميز للشريحة",
//       "tagline": "جملة تسويقية قصيرة وقوية تناسبهم",
//       "size": "صغير / متوسط / كبير / ضخم",
//       "psychProfile": "وصف نفسي مختصر لهذه الشريحة وطريقة تفكيرهم",
//       "products": ["منتج أو خدمة مخصصة ١", "منتج ٢", "منتج ٣"],
//       "values": ["قيمة أو اهتمام يحرك قرارهم الشرائي ١", "قيمة ٢", "قيمة ٣"],
//       "painPoints": ["مشكلة أو احتياج يعاني منه ١", "مشكلة ٢"],
//       "channel": "أفضل قناة للوصول إليهم",
//       "contentStyle": "نوع المحتوى الذي يتفاعلون معه",
//       "avgSpend": "متوسط الإنفاق الشهري المتوقع",
//       "why": "لماذا هذه الشريحة مهمة لهذا البراند تحديداً"
//     }
//   ],
//   "strategy": {
//     "startWith": "اسم الشريحة الأولى الموصى بالبدء بها",
//     "startReason": "سبب مقنع ومفصل للبدء بها",
//     "expansionPlan": ["خطوة توسع ١", "خطوة توسع ٢", "خطوة توسع ٣"],
//     "quickWin": "أسرع انتصار ممكن في أول 3 أشهر",
//     "crossSellOpportunity": "فرصة البيع المتقاطع بين الشرائح"
//   },
//   "marketInsights": {
//     "totalMarketSize": "تقدير حجم السوق الكلي",
//     "mostProfitableSegment": "اسم الشريحة الأعلى ربحية",
//     "fastestGrowingSegment": "اسم الشريحة الأسرع نمواً",
//     "underservedSegment": "شريحة محرومة من الخدمة الجيدة حالياً"
//   }
// }`;

// // ─────────────────────────────────────────────
// // AI CALLER with retry on rate limit
// // ─────────────────────────────────────────────

// const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// async function callAI(
//   systemPrompt: string,
//   userMsg: string,
//   retries = 3,
// ): Promise<string> {
//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       const res = await client.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         temperature: 0.75,
//         max_tokens: 4000,
//         messages: [
//           { role: "system", content: systemPrompt },
//           { role: "user", content: userMsg },
//         ],
//       });
//       return res.choices?.[0]?.message?.content || "";
//     } catch (err: any) {
//       const isRateLimit =
//         err?.status === 429 || err?.code === "rate_limit_exceeded";
//       if (isRateLimit && attempt < retries - 1) {
//         const retryAfter = parseInt(err?.headers?.["retry-after"] || "10", 10);
//         const waitMs = (retryAfter + 1) * 1000;
//         console.log(
//           `Rate limit hit, waiting ${retryAfter + 1}s before retry ${attempt + 1}/${retries - 1}...`,
//         );
//         await sleep(waitMs);
//         continue;
//       }
//       throw err;
//     }
//   }
//   return "";
// }

// // ─────────────────────────────────────────────
// // LOGO GENERATOR - FLUX.1-dev via Hugging Face
// // ─────────────────────────────────────────────

// async function generateLogoWithFlux(
//   prompt: string,
//   retries = 2,
// ): Promise<string | null> {
//   if (!process.env.HF_TOKEN) {
//     console.warn("HF_TOKEN not set, falling back to SVG logo");
//     return null;
//   }

//   const safePrompt = prompt
//     .replace(/[^\x00-\x7F]/g, "")
//     .slice(0, 500)
//     .trim();

//   if (!safePrompt) {
//     console.error("Logo prompt is empty after sanitization");
//     return null;
//   }

//   for (let attempt = 0; attempt < retries; attempt++) {
//     try {
//       console.log(
//         `Generating high-quality logo with FLUX.1-dev (attempt ${attempt + 1}/${retries})...`,
//       );

//       const image = await hfClient.textToImage({
//         model: "black-forest-labs/FLUX.1-dev",
//         inputs: safePrompt,
//         parameters: {
//           num_inference_steps: 28,
//           guidance_scale: 3.5,
//         },
//       });

//       const imageBlob =
//         (image as any) instanceof Blob
//           ? image
//           : await fetch(image as string).then((r) => r.blob());
//       const arrayBuffer = await (imageBlob as Blob).arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       if (buffer.length < 1000) {
//         console.error(
//           "FLUX returned too small image, likely an error response",
//         );
//         if (attempt < retries - 1) {
//           await sleep(3000);
//           continue;
//         }
//         return null;
//       }

//       const base64 = buffer.toString("base64");
//       return `data:image/png;base64,${base64}`;
//     } catch (err: any) {
//       console.error(
//         `FLUX Pro logo error (attempt ${attempt + 1}):`,
//         err?.message,
//       );
//       if (attempt < retries - 1) {
//         await sleep(4000);
//         continue;
//       }
//       return null;
//     }
//   }
//   return null;
// }

// // ─────────────────────────────────────────────
// // PARSERS
// // ─────────────────────────────────────────────

// function parseJSON(raw: string): any {
//   try {
//     if (!raw) return null;
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

// function sanitizeSVG(raw: string): string {
//   if (!raw || !raw.includes("<svg")) return "";
//   let svg = raw.trim();
//   if (!svg.includes("xmlns")) {
//     svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
//   }
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
// // TYPES & INTERFACES
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
//   logoFormat: "image" | "svg";
//   social: any;
//   landing: any;
//   brochureContent: any;
//   competitors: any;
//   objections: any;
//   productFocus: any;
//   launchPlan: any;
//   swot: any;
//   ageSegments: any; // ← جديد
// }

// // ─────────────────────────────────────────────
// // MAIN GENERATOR
// // ─────────────────────────────────────────────

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

//   const base = `فكرة المشروع بالتفصيل: ${idea}
// ${brandName ? `اسم البراند المحدد: ${brandName}` : "لا يوجد اسم — ولّد 3 أسماء عربية مميزة ومناسبة لهذا المشروع تحديداً"}
// الأسلوب البصري المطلوب: ${styleName}
// ${colNames ? `الألوان المفضلة: ${colNames}` : ""}
// تذكر: كل المخرجات يجب أن تكون مخصصة لهذه الفكرة تحديداً وليست نماذج عامة.`;

//   // ── Phase 1: Brand Identity ──
//   console.log("Phase 1: Generating Brand Identity...");
//   const brandRaw = await callAI(
//     SYS_BRAND,
//     base + "\nولّد Brand Kit كامل احترافي ومخصص لهذا المشروع.",
//   );
//   const brand = parseJSON(brandRaw);

//   if (!brand) throw new Error("فشل تحليل Brand JSON من AI");

//   const primary = brand.colors?.[0]?.hex ?? "#C9973A";
//   const secondary = brand.colors?.[1]?.hex ?? "#13131E";
//   const namesList: string[] = (brand.names || []).map((n: any) =>
//     typeof n === "string" ? n : n.name,
//   );
//   const displayName =
//     brandName || brand.recommendedName || namesList[0] || "Brand";

//   // ── Phase 2: Logo Prompt ──
//   const logoPromptRaw = await callAI(
//     SYS_LOGO_PROMPT,
//     `Brand Name: ${displayName} \nBrand Industry/Idea: ${idea.slice(0, 200)} \nVisual Style: ${styleName} \nPrimary Color: ${primary} \nSecondary Color: ${secondary} \nAccent Color: ${brand.colors?.[2]?.hex || "#FFFFFF"} \nBrand Personality: ${brand.voice?.tone || "professional"} \nWrite a tailored visual logo generation prompt. Important: ICON ONLY, absolutely NO text/letters.`,
//   );
//   const logoPrompt = logoPromptRaw
//     .replace(/```[\s\S]*?```/g, "")
//     .replace(/^["'`]+|["'`]+$/g, "")
//     .replace(/[^\x00-\x7F]/g, "")
//     .slice(0, 500)
//     .trim();

//   // ── Phase 3: ALL TASKS IN PARALLEL ──
//   console.log("Phase 3: Launching all content tasks in parallel...");

//   const brandContext = `${base}
// البراند: ${displayName}
// الشعار والرسالة: ${brand.tagline?.ar || ""}
// القيمة الفريدة: ${brand.strategy?.value || ""}
// الجمهور المستهدف: ${brand.strategy?.audience || ""}
// التموضع: ${brand.strategy?.positioning || ""}
// الرسائل التسويقية: ${(brand.messages || []).join(" | ")}`;

//   const [
//     logoRes,
//     socialRaw,
//     landingRaw,
//     brochureRaw,
//     competitorsRaw,
//     objectionsRaw,
//     productFocusRaw,
//     launchPlanRaw,
//     swotRaw,
//     ageSegmentsRaw, // ← جديد
//   ] = await Promise.all([
//     // Logo generation
//     generateLogoWithFlux(logoPrompt).catch(() => null),

//     // Social media
//     callAI(
//       SYS_SOCIAL,
//       `${brandContext}\nاصنع محتوى سوشيال مميز ومخصص لهذا البراند.`,
//     ),

//     // Landing page
//     callAI(
//       SYS_LANDING,
//       `${brandContext}\nاصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.`,
//     ),

//     // Brochure
//     callAI(
//       SYS_BROCHURE,
//       `${brandContext}\nاصنع محتوى بروشور احترافي ومخصص لهذا البراند.`,
//     ).catch(() => ""),

//     // Competitors
//     callAI(
//       SYS_COMPETITORS,
//       `فكرة المشروع: ${idea}\nالبراند: ${displayName}\nالسوق المستهدف: ${brand.strategy?.audience || ""}\nالتموضع: ${brand.strategy?.positioning || ""}\nحلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`,
//     ).catch(() => ""),

//     // Customer Objections
//     callAI(
//       SYS_OBJECTIONS,
//       `${brandContext}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة لهذا البراند والمشروع تحديداً.`,
//     ).catch(() => ""),

//     // Product Focus
//     callAI(
//       SYS_PRODUCT_FOCUS,
//       `${brandContext}\nاقترح المنتجات والخدمات الممكنة لهذا البراند وحدد الأولوية الذكية للبدء.`,
//     ).catch(() => ""),

//     // Launch Plan
//     callAI(
//       SYS_LAUNCH_PLAN,
//       `${brandContext}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند في السوق العربي.`,
//     ).catch(() => ""),

//     // SWOT & Risk Analysis
//     callAI(
//       SYS_SWOT,
//       `${brandContext}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح وعملي لهذا المشروع في السوق العربي.`,
//     ).catch(() => ""),

//     // Age Segments ← جديد
//     callAI(
//       SYS_AGE_SEGMENTS,
//       `${brandContext}\nقسّم السوق لشرائح عمرية مناسبة لهذا البراند وقدم استراتيجية توسع تدريجية.`,
//     ).catch(() => ""),
//   ]);

//   // ── Process Logo ──
//   let logo: string;
//   let logoFormat: "image" | "svg";

//   if (logoRes) {
//     logo = logoRes;
//     logoFormat = "image";
//   } else {
//     console.log("FLUX Dev skipped or failed, generating SVG fallback...");
//     const svgRaw = await callAI(
//       SYS_LOGO,
//       `Brand Name: ${displayName}\nStyle: ${styleName}\nPrimary Color: ${primary}\nSecondary Color: ${secondary}\nBrand Idea: ${idea.slice(0, 120)}\nCreate a unique minimal geometric SVG logo that reflects this brand's identity.`,
//     );
//     const parsed = parseSVG(svgRaw);
//     logo = parsed
//       ? sanitizeSVG(parsed)
//       : fallbackSVG(displayName, primary, secondary);
//     logoFormat = "svg";
//   }

//   // ── Parse all JSON results ──
//   const social = parseJSON(socialRaw);
//   const landing = parseJSON(landingRaw);
//   const brochureContent = parseJSON(brochureRaw);
//   const competitors = parseJSON(competitorsRaw) || {};
//   const objections = parseJSON(objectionsRaw) || {};
//   const productFocus = parseJSON(productFocusRaw) || {};
//   const launchPlan = parseJSON(launchPlanRaw) || {};
//   const swot = parseJSON(swotRaw) || {};
//   const ageSegments = parseJSON(ageSegmentsRaw) || {}; // ← جديد

//   console.log("Brand Kit generated successfully with all new sections!");

//   return {
//     brand,
//     logo,
//     logoFormat,
//     social,
//     landing,
//     brochureContent,
//     competitors,
//     objections,
//     productFocus,
//     launchPlan,
//     swot,
//     ageSegments, // ← جديد
//   };
// };

// // ─────────────────────────────────────────────
// // EXTRA SOCIAL CONTENT (paid)
// // ─────────────────────────────────────────────

// const SYS_EXTRA_SOCIAL = `أنت خبير Social Media Marketing للسوق العربي. ولّد محتوى سوشيال إضافي جديد تماماً ومختلف.
// رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
// {
//   "postIdeas": [
//     { "type": "صورة", "platform": "Instagram", "title": "عنوان فكرة جديدة", "visual": "وصف المشهد البصري", "caption": "نص كامل مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "category": "Lifestyle" },
//     { "type": "فيديو", "platform": "Instagram Reels", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "عرض المنتج/الخدمة" },
//     { "type": "كاروسيل", "platform": "Instagram", "title": "", "visual": "", "caption": "", "hashtags": "", "category": "قصص البراند" }
//   ],
//   "videoIdeas": [
//     { "platform": "TikTok", "duration": "30 ثانية", "hook": "جملة افتتاحية جديدة", "concept": "فكرة جديدة", "scenes": ["مشهد ١", "مشهد ٢", "مشهد ٣"], "music": "نوع الموسيقى", "cta": "نداء الإجراء" },
//     { "platform": "Instagram Reels", "duration": "15 ثانية", "hook": "", "concept": "", "scenes": ["", ""], "music": "", "cta": "" }
//   ],
//   "instagram": [
//     { "caption": "نص جديد مختلف مع إيموجي", "hashtags": "#tag1 #tag2 #tag3", "theme": "موضوع مختلف" },
//     { "caption": "", "hashtags": "", "theme": "" }
//   ],
//   "twitter": [
//     { "text": "تغريدة جديدة ومختلفة" },
//     { "text": "" }
//   ]
// }`;

// export interface ExtraSocialParams {
//   idea: string;
//   brandName: string;
//   style: string;
//   tagline: string;
//   audience: string;
//   value: string;
// }

// export const generateExtraSocialContent = async (
//   params: ExtraSocialParams,
// ): Promise<{
//   postIdeas: any[];
//   videoIdeas: any[];
//   instagram: any[];
//   twitter: any[];
// }> => {
//   const raw = await callAI(
//     SYS_EXTRA_SOCIAL,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالشعار: ${params.tagline}\nالجمهور: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالأسلوب: ${params.style}\nولّد محتوى سوشيال جديد وإبداعي مختلف تماماً عن أي منشورات سابقة.`,
//   );
//   const parsed = parseJSON(raw);
//   return {
//     postIdeas: parsed?.postIdeas || [],
//     videoIdeas: parsed?.videoIdeas || [],
//     instagram: parsed?.instagram || [],
//     twitter: parsed?.twitter || [],
//   };
// };

// // ─────────────────────────────────────────────
// // STANDALONE FUNCTIONS
// // ─────────────────────────────────────────────

// export interface CompetitorsOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   positioning: string;
// }

// export const generateCompetitorsOnly = async (
//   params: CompetitorsOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_COMPETITORS,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالسوق المستهدف: ${params.audience}\nالتموضع: ${params.positioning}\nحلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`,
//   );
//   return parseJSON(raw);
// };

// export interface BrochureOnlyParams {
//   idea: string;
//   brandName: string;
//   tagline: string;
//   value: string;
//   audience: string;
//   messages: string[];
//   style: string;
// }

// export const generateBrochureOnly = async (
//   params: BrochureOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_BROCHURE,
//     `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالشعار: ${params.tagline}\nالقيمة الفريدة: ${params.value}\nالجمهور: ${params.audience}\nالرسائل التسويقية: ${params.messages.join(" | ")}\nالأسلوب البصري: ${params.style}\nاصنع محتوى بروشور احترافي ومخصص لهذا البراند.`,
//   );
//   return parseJSON(raw);
// };

// export interface ObjectionsOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   value: string;
//   positioning: string;
// }

// export const generateObjectionsOnly = async (
//   params: ObjectionsOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_OBJECTIONS,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة.`,
//   );
//   return parseJSON(raw);
// };

// export interface ProductFocusOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   value: string;
//   style: string;
// }

// export const generateProductFocusOnly = async (
//   params: ProductFocusOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_PRODUCT_FOCUS,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالأسلوب: ${params.style}\nاقترح المنتجات والخدمات الممكنة وحدد الأولوية الذكية.`,
//   );
//   return parseJSON(raw);
// };

// export interface LaunchPlanOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   value: string;
//   positioning: string;
//   tagline: string;
// }

// export const generateLaunchPlanOnly = async (
//   params: LaunchPlanOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_LAUNCH_PLAN,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nالشعار: ${params.tagline}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند.`,
//   );
//   return parseJSON(raw);
// };

// export interface SwotOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   value: string;
//   positioning: string;
// }

// export const generateSwotOnly = async (
//   params: SwotOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_SWOT,
//     `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح لهذا المشروع في السوق العربي.`,
//   );
//   return parseJSON(raw);
// };

// // ─────────────────────────────────────────────
// // STANDALONE: AGE SEGMENTS ONLY  ← جديد
// // ─────────────────────────────────────────────

// export interface AgeSegmentsOnlyParams {
//   idea: string;
//   brandName: string;
//   audience: string;
//   positioning: string;
//   value: string;
//   style: string;
// }

// export const generateAgeSegmentsOnly = async (
//   params: AgeSegmentsOnlyParams,
// ): Promise<any | null> => {
//   const raw = await callAI(
//     SYS_AGE_SEGMENTS,
//     `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالجمهور المستهدف الحالي: ${params.audience}\nالتموضع في السوق: ${params.positioning}\nالقيمة الفريدة: ${params.value}\nالأسلوب البصري والشخصية: ${params.style}\nقسّم السوق لشرائح عمرية مناسبة وقدم استراتيجية توسع تدريجية.`,
//   );
//   return parseJSON(raw);
// };






















// اليوم اخر نسخه عملتها يوم 6/9






import OpenAI from "openai";
import { InferenceClient } from "@huggingface/inference";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const hfClient = new InferenceClient(process.env.HF_TOKEN);

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

const SYS_LOGO_PROMPT = `You are a world-class logo prompt engineer for AI image generators. Your job is to write a highly detailed, professional visual prompt to create a luxury, corporate logo.

Output ONLY the prompt text in English. No JSON, no markdown, no explanation.

RULES FOR THE PROMPT:
1. Start with: "A high-end professional corporate logo design for [Brand Name], representing [Concept]."
2. Visual Style: Masterpiece minimalist, ultra-clean vector style, flat design, sharp golden ratio geometry, perfectly centered composition, symmetric layout.
3. Color Palette: Use the exact colors provided ([Primary] and [Secondary]) on a clean, solid, plain flat background (no gradients, no textures).
4. Artistic Quality: "Designed by a top branding agency, sleek modern aesthetics, fine lines, sharp edges, Adobe Illustrator render, 8k resolution, trending on Dribbble."
5. CRITICAL - NO TEXT ALLOWED: The logo must be ICON ONLY. Absolutely NO letters, NO words, NO typography, NO text elements inside the image.
6. Abstract Symbolism: Focus on high-end abstract or symbolic shapes that seamlessly reflect the brand's industry and core value. Keep it under 100 words.`;

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

const SYS_OBJECTIONS = `أنت خبير مبيعات ومفاوضات للسوق العربي. مهمتك إنشاء ردود احترافية ومقنعة على اعتراضات العملاء الشائعة.
قواعد صارمة:
- كل رد يجب أن يكون مخصصاً لهذا البراند والمشروع تحديداً
- الردود يجب أن تكون مقنعة وإنسانية وليست دفاعية
- استخدم أسلوب "Feel, Felt, Found" و"Reframe" و"Social Proof" بشكل ذكي
- قدم دائماً قيمة حقيقية وليس مجرد تبرير
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "objections": [
    {
      "objection": "أنت غالي مقارنة بالمنافسين",
      "category": "السعر",
      "psychologyBehind": "العميل يبحث عن تبرير للقيمة مقابل السعر",
      "response": "رد مقنع كامل بصوت البراند - 3-4 جمل",
      "keyPoints": ["نقطة إقناع ١", "نقطة إقناع ٢", "نقطة إقناع ٣"],
      "reframe": "كيف تحول الاعتراض لميزة",
      "closingLine": "جملة ختامية قوية تدفع للقرار"
    },
    {
      "objection": "عندك منافس بنفس الخدمة",
      "category": "المنافسة",
      "psychologyBehind": "",
      "response": "",
      "keyPoints": ["", "", ""],
      "reframe": "",
      "closingLine": ""
    },
    {
      "objection": "محتاج أفكر وأرجعلك",
      "category": "التردد",
      "psychologyBehind": "",
      "response": "",
      "keyPoints": ["", ""],
      "reframe": "",
      "closingLine": ""
    },
    {
      "objection": "مش متأكد إن ده هينفع معايا",
      "category": "الشك",
      "psychologyBehind": "",
      "response": "",
      "keyPoints": ["", "", ""],
      "reframe": "",
      "closingLine": ""
    },
    {
      "objection": "مش وقته دلوقتي",
      "category": "التوقيت",
      "psychologyBehind": "",
      "response": "",
      "keyPoints": ["", ""],
      "reframe": "",
      "closingLine": ""
    }
  ],
  "generalTips": ["نصيحة في التعامل مع الاعتراضات ١", "نصيحة ٢", "نصيحة ٣"],
  "salesVoice": "نبرة المبيعات المناسبة لهذا البراند"
}`;

const SYS_PRODUCT_FOCUS = `أنت مستشار أعمال استراتيجي للسوق العربي متخصص في تطوير المنتجات والخدمات.
مهمتك: استناداً لفكرة البراند، اقترح منتجات/خدمات ممكنة وحدد الأولوية الذكية للبدء.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "allProducts": [
    {
      "name": "اسم المنتج أو الخدمة",
      "description": "وصف مختصر",
      "targetAudience": "الجمهور المستهدف لهذا المنتج",
      "revenueModel": "نموذج الإيراد (اشتراك / مرة واحدة / عمولة / إلخ)",
      "complexity": "بسيط / متوسط / معقد",
      "timeToMarket": "1 شهر / 3 أشهر / 6 أشهر / سنة",
      "investmentLevel": "منخفض / متوسط / مرتفع",
      "potentialRevenue": "منخفض / متوسط / مرتفع / ضخم"
    }
  ],
  "priorityRecommendation": {
    "focusNow": ["اسم المنتج الأول للتركيز", "اسم المنتج الثاني للتركيز"],
    "focusLater": ["منتج للمرحلة القادمة ١", "منتج للمرحلة القادمة ٢"],
    "avoid": ["منتج يُفضل تأجيله الآن"],
    "reasoning": "شرح مفصل لسبب هذه التوصية بناءً على السوق والموارد والتوقيت",
    "quickWin": "المنتج الذي يجلب عائداً سريعاً في أقل وقت",
    "longTermBet": "المنتج ذو الإمكانية الأعلى على المدى البعيد"
  },
  "bundlingIdeas": [
    { "bundle": "اسم الباقة", "products": ["منتج ١", "منتج ٢"], "benefit": "الفائدة من الجمع" }
  ],
  "pricingStrategy": {
    "approach": "استراتيجية التسعير المقترحة",
    "anchor": "سعر المرساة أو النموذج المقترح",
    "tiers": [
      { "name": "اسم الباقة", "price": "السعر المقترح", "includes": ["ما تشمله"] }
    ]
  }
}`;

const SYS_LAUNCH_PLAN = `أنت خبير إطلاق مشاريع ومنتجات للسوق العربي. ضع خطة إطلاق تفصيلية وعملية وقابلة للتنفيذ.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "overview": {
    "totalDuration": "مدة الإطلاق الكاملة",
    "budget": "ميزانية مقترحة للإطلاق",
    "mainGoal": "الهدف الرئيسي من الإطلاق",
    "successMetrics": ["مقياس نجاح ١", "مقياس نجاح ٢", "مقياس نجاح ٣"]
  },
  "phases": [
    {
      "phase": 1,
      "name": "مرحلة التحضير",
      "duration": "الأسبوع 1-2",
      "goal": "هدف هذه المرحلة",
      "tasks": [
        { "task": "المهمة بالتفصيل", "owner": "المسؤول (أنت / فريق التسويق / مطور)", "deadline": "نهاية الأسبوع ١", "priority": "عالي / متوسط / منخفض" }
      ],
      "deliverables": ["مخرج ١", "مخرج ٢"],
      "budget": "الميزانية المخصصة لهذه المرحلة"
    },
    {
      "phase": 2,
      "name": "مرحلة البناء",
      "duration": "الأسبوع 3-4",
      "goal": "",
      "tasks": [{ "task": "", "owner": "", "deadline": "", "priority": "" }],
      "deliverables": ["", ""],
      "budget": ""
    },
    {
      "phase": 3,
      "name": "مرحلة الإطلاق الناعم",
      "duration": "الأسبوع 5-6",
      "goal": "",
      "tasks": [{ "task": "", "owner": "", "deadline": "", "priority": "" }],
      "deliverables": ["", ""],
      "budget": ""
    },
    {
      "phase": 4,
      "name": "مرحلة الإطلاق الرسمي",
      "duration": "الأسبوع 7-8",
      "goal": "",
      "tasks": [{ "task": "", "owner": "", "deadline": "", "priority": "" }],
      "deliverables": ["", ""],
      "budget": ""
    },
    {
      "phase": 5,
      "name": "مرحلة النمو والتحسين",
      "duration": "الشهر 3-6",
      "goal": "",
      "tasks": [{ "task": "", "owner": "", "deadline": "", "priority": "" }],
      "deliverables": ["", ""],
      "budget": ""
    }
  ],
  "channels": [
    { "channel": "Instagram", "strategy": "استراتيجية هذا القناة للإطلاق", "budget": "الميزانية", "expectedReach": "الوصول المتوقع" }
  ],
  "contentCalendar": {
    "week1": ["محتوى اليوم الأول", "محتوى اليوم الثاني", "محتوى اليوم الثالث"],
    "week2": ["", "", ""],
    "launchDay": { "activities": ["نشاط ١", "نشاط ٢", "نشاط ٣"], "posts": ["منشور ١", "منشور ٢"] }
  },
  "contingency": {
    "ifSlowStart": "ماذا تفعل لو الإطلاق بطيء",
    "ifViral": "كيف تتعامل لو انتشر بشكل كبير",
    "criticalRisks": ["خطر محتمل ١", "خطر محتمل ٢"]
  }
}`;

const SYS_SWOT = `أنت مستشار أعمال استراتيجي متخصص في تحليل المخاطر والفرص للسوق العربي.
قدم تحليلاً شاملاً وصريحاً وعملياً - لا تجامل، قل الحقيقة.
رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "swot": {
    "strengths": [
      { "point": "نقطة قوة حقيقية", "impact": "عالي / متوسط / منخفض", "howToLeverage": "كيف تستفيد منها" }
    ],
    "weaknesses": [
      { "point": "نقطة ضعف حقيقية", "impact": "عالي / متوسط / منخفض", "howToAddress": "كيف تعالجها" }
    ],
    "opportunities": [
      { "point": "فرصة في السوق", "timeframe": "قريب / متوسط / بعيد", "howToCapture": "كيف تستغلها" }
    ],
    "threats": [
      { "point": "تهديد حقيقي", "probability": "عالي / متوسط / منخفض", "mitigation": "كيف تتجنبه أو تخففه" }
    ]
  },
  "risks": [
    {
      "risk": "وصف الخطر بوضوح",
      "category": "مالي / تشغيلي / تسويقي / قانوني / تقني",
      "probability": "عالي / متوسط / منخفض",
      "impact": "كارثي / كبير / متوسط / صغير",
      "riskScore": "1-10",
      "earlyWarnings": ["علامة تحذير مبكرة ١", "علامة تحذير مبكرة ٢"],
      "mitigation": "خطة التخفيف من هذا الخطر",
      "contingency": "ماذا تفعل لو حدث رغم كل شيء"
    }
  ],
  "overallRiskLevel": "منخفض / متوسط / عالي / مرتفع جداً",
  "criticalSuccessFactors": ["عامل نجاح حاسم ١", "عامل نجاح حاسم ٢", "عامل نجاح حاسم ٣"],
  "founderAdvice": "نصيحة صريحة وعملية لصاحب المشروع بناءً على هذا التحليل - 3-4 جمل حقيقية",
  "verdict": {
    "goOrNoGo": "go / no-go / proceed-with-caution",
    "confidence": "نسبة الثقة في نجاح المشروع كرقم من 1-100",
    "mainReason": "السبب الرئيسي للحكم"
  }
}`;

const SYS_AGE_SEGMENTS = `أنت خبير دراسة سوق وتحليل شرائح عمرية للمنطقة العربية.
مهمتك تقسيم السوق المستهدف لشرائح عمرية مناسبة للبراند المحدد، مع تفاصيل عملية وقابلة للتنفيذ.

قواعد صارمة:
- عدد الشرائح: 3 إلى 5 حسب طبيعة المشروع، لا أكثر
- كل شريحة يجب أن تكون مختلفة نفسياً وسلوكياً عن غيرها، مش بس في السن
- المنتجات والتوصيات يجب أن تكون مخصصة لهذا البراند تحديداً، لا عامة
- خطة التوسع يجب أن تكون تدريجية ومنطقية

رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "segments": [
    {
      "ageRange": "18-24",
      "name": "اسم وصفي مميز للشريحة",
      "tagline": "جملة تسويقية قصيرة وقوية تناسبهم",
      "size": "صغير / متوسط / كبير / ضخم",
      "psychProfile": "وصف نفسي مختصر لهذه الشريحة وطريقة تفكيرهم",
      "products": ["منتج أو خدمة مخصصة ١", "منتج ٢", "منتج ٣"],
      "values": ["قيمة أو اهتمام يحرك قرارهم الشرائي ١", "قيمة ٢", "قيمة ٣"],
      "painPoints": ["مشكلة أو احتياج يعاني منه ١", "مشكلة ٢"],
      "channel": "أفضل قناة للوصول إليهم",
      "contentStyle": "نوع المحتوى الذي يتفاعلون معه",
      "avgSpend": "متوسط الإنفاق الشهري المتوقع",
      "why": "لماذا هذه الشريحة مهمة لهذا البراند تحديداً"
    }
  ],
  "strategy": {
    "startWith": "اسم الشريحة الأولى الموصى بالبدء بها",
    "startReason": "سبب مقنع ومفصل للبدء بها",
    "expansionPlan": ["خطوة توسع ١", "خطوة توسع ٢", "خطوة توسع ٣"],
    "quickWin": "أسرع انتصار ممكن في أول 3 أشهر",
    "crossSellOpportunity": "فرصة البيع المتقاطع بين الشرائح"
  },
  "marketInsights": {
    "totalMarketSize": "تقدير حجم السوق الكلي",
    "mostProfitableSegment": "اسم الشريحة الأعلى ربحية",
    "fastestGrowingSegment": "اسم الشريحة الأسرع نمواً",
    "underservedSegment": "شريحة محرومة من الخدمة الجيدة حالياً"
  }
}`;

// ─────────────────────────────────────────────
// BUSINESS OVERVIEW SYSTEM PROMPT  ← جديد
// ─────────────────────────────────────────────

const SYS_BUSINESS_OVERVIEW = `أنت مستشار أعمال استراتيجي محترف للسوق العربي. مهمتك كتابة شرح احترافي وعميق للبيزنس يُستخدم في Pitch Decks والتقديم للمستثمرين والعملاء.

قواعد صارمة:
- كل كلمة مخصصة لهذا البراند والمشروع تحديداً، لا كلام عام أبداً
- الشرح يجب أن يكون مقنعاً وإنسانياً وليس أكاديمياً جافاً
- "ليه أنا" يجب أن تكون حجج حقيقية وقابلة للإثبات، لا ادعاءات فارغة

رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "elevator_pitch": "جملتان أو ثلاث تشرح البيزنس كاملاً لشخص غريب في 30 ثانية",
  "what_we_do": {
    "summary": "ماذا نفعل بالضبط - جملة واحدة واضحة وقوية",
    "details": ["تفصيل ١ - ماذا نقدم وكيف", "تفصيل ٢", "تفصيل ٣"]
  },
  "who_we_serve": {
    "primary": "الشريحة الأساسية المستهدفة بالتفصيل",
    "secondary": "شريحة ثانوية مهمة",
    "notFor": "من هذا المنتج/الخدمة ليس مناسباً لهم - الصراحة تبني الثقة"
  },
  "problems_we_solve": [
    {
      "problem": "المشكلة الحقيقية التي يعاني منها العميل",
      "pain": "مدى ألم هذه المشكلة وتأثيرها على حياته",
      "ourSolution": "كيف نحل هذه المشكلة تحديداً"
    }
  ],
  "why_choose_us": [
    {
      "reason": "سبب اختيارنا - حجة قوية وقابلة للإثبات",
      "proof": "دليل أو مثال يثبت هذه الميزة",
      "vsCompetitor": "كيف يختلف هذا عن المنافسين"
    }
  ],
  "unique_value": {
    "statement": "جملة القيمة الفريدة - ما الذي نفعله بشكل لا يستطيع أحد غيرنا",
    "moat": "الخندق التنافسي - ما الذي يصعب على المنافسين تقليده",
    "vision": "إلى أين نريد أن نصل في 3-5 سنوات"
  },
  "business_model": {
    "howWeEarnMoney": "كيف نكسب المال بشكل واضح وصريح",
    "pricingApproach": "فلسفة التسعير",
    "scalability": "كيف يتوسع البيزنس مع النمو"
  },
  "social_proof_potential": ["نوع الإثبات الاجتماعي الأنسب ١", "نوع الإثبات الاجتماعي ٢"],
  "one_liner": "جملة واحدة فقط - أقوى تعريف للبراند يمكن أن تقوله"
}`;

// ─────────────────────────────────────────────
// AGE PREFERENCES SYSTEM PROMPT  ← جديد
// ─────────────────────────────────────────────

const SYS_AGE_PREFERENCES = `أنت خبير سلوك مستهلك وعلم نفس الأجيال للسوق العربي.
مهمتك تحليل تفضيلات وسلوكيات كل شريحة عمرية بخصوص هذا البراند تحديداً، مع توصيات عملية وقابلة للتنفيذ.

قواعد صارمة:
- التفضيلات والتوصيات يجب أن تكون مخصصة لهذا البراند وطبيعة المشروع، لا نصائح عامة
- كل توصية يجب أن تكون عملية ومحددة وقابلة للتنفيذ خلال 30-90 يوماً
- استند إلى سلوك الأجيال الحقيقي في السوق العربي

رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "ageGroups": [
    {
      "range": "16-24",
      "label": "اسم وصفي للجيل",
      "generationName": "اسم الجيل (Gen Z / Millennials / إلخ)",
      "marketSize": "صغير / متوسط / كبير / ضخم",
      "buyingPower": "منخفض / متوسط / مرتفع",
      "preferences": {
        "whatTheyLove": ["يحبون هذا النوع من المنتجات/الخدمات ١", "يحبون ٢", "يحبون ٣"],
        "whatTheyHate": ["يكرهون ١", "يكرهون ٢"],
        "howTheyBuy": "كيف يتخذون قرار الشراء - عملية الـ buying journey",
        "whatInfluencesThem": ["المؤثر الأول على قرارهم", "المؤثر الثاني"],
        "pricesSensitivity": "حساسية السعر ومستوى الاستعداد للدفع"
      },
      "contentThatWorks": {
        "formats": ["فورمات المحتوى الأنجح معهم ١", "فورمات ٢", "فورمات ٣"],
        "tone": "نبرة التواصل المناسبة لهم",
        "platforms": ["المنصة الأولى", "المنصة الثانية"],
        "hooks": ["جملة افتتاحية تجذبهم ١", "جملة ٢"]
      },
      "recommendations": [
        {
          "action": "ماذا تفعل بالضبط لهذه الشريحة",
          "why": "لماذا هذا مهم لهم تحديداً",
          "how": "كيف تنفذه عملياً",
          "timeline": "متى تبدأ وكم يستغرق",
          "expectedResult": "النتيجة المتوقعة"
        }
      ],
      "productIdeas": ["منتج أو خدمة أو feature مخصصة لهم ١", "فكرة ٢"],
      "avoidWith": ["خطأ شائع يجب تجنبه مع هذه الشريحة ١", "خطأ ٢"],
      "successMetric": "كيف تقيس نجاحك مع هذه الشريحة"
    }
  ],
  "crossGenerational": {
    "commonGround": "ما الذي يجمع كل الشرائح ويجذبهم لهذا البراند",
    "mainTension": "أكبر تعارض بين تفضيلات الشرائح المختلفة وكيف تتعامل معه",
    "unifyingMessage": "رسالة واحدة تناسب الجميع"
  },
  "priorityAction": {
    "quickWin": "أسرع فرصة لكسب عملاء من أي شريحة في أول شهر",
    "highestROI": "الشريحة التي ستعطيك أعلى عائد على الاستثمار في التسويق",
    "longTermBet": "الشريحة التي يجب بناء علاقة عميقة معها للمستقبل"
  }
}`;

// ─────────────────────────────────────────────
// FAQ SYSTEM PROMPT  ← جديد
// ─────────────────────────────────────────────

const SYS_FAQ = `أنت خبير Customer Success وخدمة عملاء للسوق العربي.
مهمتك توقع الأسئلة الحقيقية التي سيطرحها العملاء على هذا البراند والإجابة عليها بصوت البراند الحقيقي.

قواعد صارمة:
- الأسئلة يجب أن تكون حقيقية ومن الجمهور المستهدف لهذا البراند تحديداً، لا أسئلة عامة
- الإجابات بصوت البراند - نفس نبرة البراند ومعاييره
- بعض الأسئلة يجب أن تكون حساسة أو صعبة - لا تتجنب الأسئلة الصعبة
- عدد الأسئلة: 10 أسئلة بالضبط، متنوعة في الموضوع والصعوبة

رد بـ JSON فقط بدون أي نص أو markdown أو code fences:
{
  "faqs": [
    {
      "id": 1,
      "category": "المنتج / الخدمة",
      "question": "سؤال حقيقي من عميل محتمل",
      "shortAnswer": "إجابة مختصرة في جملة واحدة أو اثنتين",
      "fullAnswer": "إجابة كاملة بصوت البراند - 3-4 جمل مقنعة",
      "whyTheyAsk": "لماذا يطرح العملاء هذا السؤال - ما وراءه من قلق أو احتياج",
      "tone": "رسمي / ودي / واثق / متعاطف",
      "followUpQuestion": "سؤال متابعة محتمل بعد هذه الإجابة"
    }
  ],
  "categories": ["قائمة بالفئات المستخدمة في الأسئلة"],
  "insights": {
    "topConcern": "أكبر قلق لدى العملاء بناءً على هذه الأسئلة",
    "contentGaps": ["محتوى يجب إنشاؤه لتوضيح هذه النقاط ١", "محتوى ٢"],
    "salesOpportunities": ["فرصة مبيعات مخفية في هذه الأسئلة ١", "فرصة ٢"]
  }
}`;

// ─────────────────────────────────────────────
// AI CALLER with retry on rate limit
// ─────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callAI(
  systemPrompt: string,
  userMsg: string,
  retries = 3,
): Promise<string> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0.75,
        max_tokens: 4000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMsg },
        ],
      });
      return res.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      const isRateLimit =
        err?.status === 429 || err?.code === "rate_limit_exceeded";
      if (isRateLimit && attempt < retries - 1) {
        const retryAfter = parseInt(err?.headers?.["retry-after"] || "10", 10);
        const waitMs = (retryAfter + 1) * 1000;
        console.log(
          `Rate limit hit, waiting ${retryAfter + 1}s before retry ${attempt + 1}/${retries - 1}...`,
        );
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
  return "";
}

// ─────────────────────────────────────────────
// LOGO GENERATOR - FLUX.1-dev via Hugging Face
// ─────────────────────────────────────────────

async function generateLogoWithFlux(
  prompt: string,
  retries = 2,
): Promise<string | null> {
  if (!process.env.HF_TOKEN) {
    console.warn("HF_TOKEN not set, falling back to SVG logo");
    return null;
  }

  const safePrompt = prompt
    .replace(/[^\x00-\x7F]/g, "")
    .slice(0, 500)
    .trim();

  if (!safePrompt) {
    console.error("Logo prompt is empty after sanitization");
    return null;
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(
        `Generating high-quality logo with FLUX.1-dev (attempt ${attempt + 1}/${retries})...`,
      );

      const image = await hfClient.textToImage({
        model: "black-forest-labs/FLUX.1-dev",
        inputs: safePrompt,
        parameters: {
          num_inference_steps: 28,
          guidance_scale: 3.5,
        },
      });

      const imageBlob =
        (image as any) instanceof Blob
          ? image
          : await fetch(image as string).then((r) => r.blob());
      const arrayBuffer = await (imageBlob as Blob).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 1000) {
        console.error(
          "FLUX returned too small image, likely an error response",
        );
        if (attempt < retries - 1) {
          await sleep(3000);
          continue;
        }
        return null;
      }

      const base64 = buffer.toString("base64");
      return `data:image/png;base64,${base64}`;
    } catch (err: any) {
      console.error(
        `FLUX Pro logo error (attempt ${attempt + 1}):`,
        err?.message,
      );
      if (attempt < retries - 1) {
        await sleep(4000);
        continue;
      }
      return null;
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// PARSERS
// ─────────────────────────────────────────────

function parseJSON(raw: string): any {
  try {
    if (!raw) return null;
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

function sanitizeSVG(raw: string): string {
  if (!raw || !raw.includes("<svg")) return "";
  let svg = raw.trim();
  if (!svg.includes("xmlns")) {
    svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  }
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
// TYPES & INTERFACES
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
  businessOverview: any; // ← جديد
  agePreferences: any;   // ← جديد
  faq: any;              // ← جديد
}

// ─────────────────────────────────────────────
// MAIN GENERATOR
// ─────────────────────────────────────────────

export const generateFullBrandKit = async (
  params: GenerateParams,
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
  console.log("Phase 1: Generating Brand Identity...");
  const brandRaw = await callAI(
    SYS_BRAND,
    base + "\nولّد Brand Kit كامل احترافي ومخصص لهذا المشروع.",
  );
  const brand = parseJSON(brandRaw);

  if (!brand) throw new Error("فشل تحليل Brand JSON من AI");

  const primary = brand.colors?.[0]?.hex ?? "#C9973A";
  const secondary = brand.colors?.[1]?.hex ?? "#13131E";
  const namesList: string[] = (brand.names || []).map((n: any) =>
    typeof n === "string" ? n : n.name,
  );
  const displayName =
    brandName || brand.recommendedName || namesList[0] || "Brand";

  // ── Phase 2: Logo Prompt ──
  const logoPromptRaw = await callAI(
    SYS_LOGO_PROMPT,
    `Brand Name: ${displayName} \nBrand Industry/Idea: ${idea.slice(0, 200)} \nVisual Style: ${styleName} \nPrimary Color: ${primary} \nSecondary Color: ${secondary} \nAccent Color: ${brand.colors?.[2]?.hex || "#FFFFFF"} \nBrand Personality: ${brand.voice?.tone || "professional"} \nWrite a tailored visual logo generation prompt. Important: ICON ONLY, absolutely NO text/letters.`,
  );
  const logoPrompt = logoPromptRaw
    .replace(/```[\s\S]*?```/g, "")
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/[^\x00-\x7F]/g, "")
    .slice(0, 500)
    .trim();

  // ── Phase 3: ALL TASKS IN PARALLEL ──
  console.log("Phase 3: Launching all content tasks in parallel...");

  const brandContext = `${base}
البراند: ${displayName}
الشعار والرسالة: ${brand.tagline?.ar || ""}
القيمة الفريدة: ${brand.strategy?.value || ""}
الجمهور المستهدف: ${brand.strategy?.audience || ""}
التموضع: ${brand.strategy?.positioning || ""}
الرسائل التسويقية: ${(brand.messages || []).join(" | ")}`;

  const [
    logoRes,
    socialRaw,
    landingRaw,
    brochureRaw,
    competitorsRaw,
    objectionsRaw,
    productFocusRaw,
    launchPlanRaw,
    swotRaw,
    ageSegmentsRaw,
    businessOverviewRaw, // ← جديد
    agePreferencesRaw,   // ← جديد
    faqRaw,              // ← جديد
  ] = await Promise.all([
    // Logo generation
    generateLogoWithFlux(logoPrompt).catch(() => null),

    // Social media
    callAI(
      SYS_SOCIAL,
      `${brandContext}\nاصنع محتوى سوشيال مميز ومخصص لهذا البراند.`,
    ),

    // Landing page
    callAI(
      SYS_LANDING,
      `${brandContext}\nاصنع محتوى Landing Page فريد ومخصص جداً لهذا البراند.`,
    ),

    // Brochure
    callAI(
      SYS_BROCHURE,
      `${brandContext}\nاصنع محتوى بروشور احترافي ومخصص لهذا البراند.`,
    ).catch(() => ""),

    // Competitors
    callAI(
      SYS_COMPETITORS,
      `فكرة المشروع: ${idea}\nالبراند: ${displayName}\nالسوق المستهدف: ${brand.strategy?.audience || ""}\nالتموضع: ${brand.strategy?.positioning || ""}\nحلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`,
    ).catch(() => ""),

    // Customer Objections
    callAI(
      SYS_OBJECTIONS,
      `${brandContext}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة لهذا البراند والمشروع تحديداً.`,
    ).catch(() => ""),

    // Product Focus
    callAI(
      SYS_PRODUCT_FOCUS,
      `${brandContext}\nاقترح المنتجات والخدمات الممكنة لهذا البراند وحدد الأولوية الذكية للبدء.`,
    ).catch(() => ""),

    // Launch Plan
    callAI(
      SYS_LAUNCH_PLAN,
      `${brandContext}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند في السوق العربي.`,
    ).catch(() => ""),

    // SWOT & Risk Analysis
    callAI(
      SYS_SWOT,
      `${brandContext}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح وعملي لهذا المشروع في السوق العربي.`,
    ).catch(() => ""),

    // Age Segments
    callAI(
      SYS_AGE_SEGMENTS,
      `${brandContext}\nقسّم السوق لشرائح عمرية مناسبة لهذا البراند وقدم استراتيجية توسع تدريجية.`,
    ).catch(() => ""),

    // Business Overview ← جديد
    callAI(
      SYS_BUSINESS_OVERVIEW,
      `${brandContext}\nاشرح هذا البيزنس بعمق: من هو، لمين، بيحل مشاكل مين، وليه يختاروه.`,
    ).catch(() => ""),

    // Age Preferences ← جديد
    callAI(
      SYS_AGE_PREFERENCES,
      `${brandContext}\nحلل تفضيلات كل شريحة عمرية بخصوص هذا البراند وقدم توصيات عملية.`,
    ).catch(() => ""),

    // FAQ ← جديد
    callAI(
      SYS_FAQ,
      `${brandContext}\nاستوقع 10 أسئلة حقيقية سيطرحها العملاء وأجب عليها بصوت هذا البراند.`,
    ).catch(() => ""),
  ]);

  // ── Process Logo ──
  let logo: string;
  let logoFormat: "image" | "svg";

  if (logoRes) {
    logo = logoRes;
    logoFormat = "image";
  } else {
    console.log("FLUX Dev skipped or failed, generating SVG fallback...");
    const svgRaw = await callAI(
      SYS_LOGO,
      `Brand Name: ${displayName}\nStyle: ${styleName}\nPrimary Color: ${primary}\nSecondary Color: ${secondary}\nBrand Idea: ${idea.slice(0, 120)}\nCreate a unique minimal geometric SVG logo that reflects this brand's identity.`,
    );
    const parsed = parseSVG(svgRaw);
    logo = parsed
      ? sanitizeSVG(parsed)
      : fallbackSVG(displayName, primary, secondary);
    logoFormat = "svg";
  }

  // ── Parse all JSON results ──
  const social          = parseJSON(socialRaw);
  const landing         = parseJSON(landingRaw);
  const brochureContent = parseJSON(brochureRaw);
  const competitors     = parseJSON(competitorsRaw)    || {};
  const objections      = parseJSON(objectionsRaw)     || {};
  const productFocus    = parseJSON(productFocusRaw)   || {};
  const launchPlan      = parseJSON(launchPlanRaw)     || {};
  const swot            = parseJSON(swotRaw)           || {};
  const ageSegments     = parseJSON(ageSegmentsRaw)    || {};
  const businessOverview = parseJSON(businessOverviewRaw) || {}; // ← جديد
  const agePreferences   = parseJSON(agePreferencesRaw)   || {}; // ← جديد
  const faq              = parseJSON(faqRaw)              || {}; // ← جديد

  console.log("Brand Kit generated successfully with all new sections!");

  return {
    brand,
    logo,
    logoFormat,
    social,
    landing,
    brochureContent,
    competitors,
    objections,
    productFocus,
    launchPlan,
    swot,
    ageSegments,
    businessOverview, // ← جديد
    agePreferences,   // ← جديد
    faq,              // ← جديد
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
  params: ExtraSocialParams,
): Promise<{
  postIdeas: any[];
  videoIdeas: any[];
  instagram: any[];
  twitter: any[];
}> => {
  const raw = await callAI(
    SYS_EXTRA_SOCIAL,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالشعار: ${params.tagline}\nالجمهور: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالأسلوب: ${params.style}\nولّد محتوى سوشيال جديد وإبداعي مختلف تماماً عن أي منشورات سابقة.`,
  );
  const parsed = parseJSON(raw);
  return {
    postIdeas: parsed?.postIdeas || [],
    videoIdeas: parsed?.videoIdeas || [],
    instagram:  parsed?.instagram  || [],
    twitter:    parsed?.twitter    || [],
  };
};

// ─────────────────────────────────────────────
// STANDALONE FUNCTIONS
// ─────────────────────────────────────────────

export interface CompetitorsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
}

export const generateCompetitorsOnly = async (
  params: CompetitorsOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_COMPETITORS,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالسوق المستهدف: ${params.audience}\nالتموضع: ${params.positioning}\nحلل السوق والمنافسين لهذا النوع من المشاريع في السوق العربي.`,
  );
  return parseJSON(raw);
};

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
  params: BrochureOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_BROCHURE,
    `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالشعار: ${params.tagline}\nالقيمة الفريدة: ${params.value}\nالجمهور: ${params.audience}\nالرسائل التسويقية: ${params.messages.join(" | ")}\nالأسلوب البصري: ${params.style}\nاصنع محتوى بروشور احترافي ومخصص لهذا البراند.`,
  );
  return parseJSON(raw);
};

export interface ObjectionsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
}

export const generateObjectionsOnly = async (
  params: ObjectionsOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_OBJECTIONS,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nاصنع ردود احترافية على اعتراضات العملاء المتوقعة.`,
  );
  return parseJSON(raw);
};

export interface ProductFocusOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  style: string;
}

export const generateProductFocusOnly = async (
  params: ProductFocusOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_PRODUCT_FOCUS,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالأسلوب: ${params.style}\nاقترح المنتجات والخدمات الممكنة وحدد الأولوية الذكية.`,
  );
  return parseJSON(raw);
};

export interface LaunchPlanOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
  tagline: string;
}

export const generateLaunchPlanOnly = async (
  params: LaunchPlanOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_LAUNCH_PLAN,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nالشعار: ${params.tagline}\nضع خطة إطلاق تفصيلية وعملية لهذا البراند.`,
  );
  return parseJSON(raw);
};

export interface SwotOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
}

export const generateSwotOnly = async (
  params: SwotOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_SWOT,
    `فكرة المشروع: ${params.idea}\nالبراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nقدم تحليل SWOT شامل وتحليل مخاطر صريح لهذا المشروع في السوق العربي.`,
  );
  return parseJSON(raw);
};

export interface AgeSegmentsOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  style: string;
}

export const generateAgeSegmentsOnly = async (
  params: AgeSegmentsOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_AGE_SEGMENTS,
    `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالجمهور المستهدف الحالي: ${params.audience}\nالتموضع في السوق: ${params.positioning}\nالقيمة الفريدة: ${params.value}\nالأسلوب البصري والشخصية: ${params.style}\nقسّم السوق لشرائح عمرية مناسبة وقدم استراتيجية توسع تدريجية.`,
  );
  return parseJSON(raw);
};

// ─────────────────────────────────────────────
// STANDALONE: BUSINESS OVERVIEW  ← جديد
// ─────────────────────────────────────────────

export interface BusinessOverviewOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  tagline: string;
}

export const generateBusinessOverviewOnly = async (
  params: BusinessOverviewOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_BUSINESS_OVERVIEW,
    `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالتموضع: ${params.positioning}\nالقيمة الفريدة: ${params.value}\nالشعار: ${params.tagline}\nاشرح هذا البيزنس بعمق: من هو، لمين، بيحل مشاكل مين، وليه يختاروه.`,
  );
  return parseJSON(raw);
};

// ─────────────────────────────────────────────
// STANDALONE: AGE PREFERENCES  ← جديد
// ─────────────────────────────────────────────

export interface AgePreferencesOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  positioning: string;
  value: string;
  style: string;
}

export const generateAgePreferencesOnly = async (
  params: AgePreferencesOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_AGE_PREFERENCES,
    `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالجمهور المستهدف الحالي: ${params.audience}\nالتموضع في السوق: ${params.positioning}\nالقيمة الفريدة: ${params.value}\nالأسلوب البصري والشخصية: ${params.style}\nحلل تفضيلات كل شريحة عمرية وقدم توصيات عملية ومخصصة.`,
  );
  return parseJSON(raw);
};

// ─────────────────────────────────────────────
// STANDALONE: FAQ  ← جديد
// ─────────────────────────────────────────────

export interface FaqOnlyParams {
  idea: string;
  brandName: string;
  audience: string;
  value: string;
  positioning: string;
  tagline: string;
}

export const generateFaqOnly = async (
  params: FaqOnlyParams,
): Promise<any | null> => {
  const raw = await callAI(
    SYS_FAQ,
    `فكرة المشروع بالتفصيل: ${params.idea}\nاسم البراند: ${params.brandName}\nالجمهور المستهدف: ${params.audience}\nالقيمة الفريدة: ${params.value}\nالتموضع: ${params.positioning}\nالشعار: ${params.tagline}\nاكتب 10 أسئلة شائعة حقيقية وأجب عليها بصوت هذا البراند.`,
  );
  return parseJSON(raw);
};





























