

import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type BillingCycle = "monthly" | "yearly";

type Brand = {
  name: string;
  category: string;
  color: string;
};

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: "◈", title: "لوجو SVG احترافي",    desc: "لوجو مخصص قابل للتعديل والتكبير بدون فقدان جودة" },
  { icon: "◉", title: "هوية بصرية كاملة",    desc: "لوحة ألوان وخطوط واستراتيجية بصرية متكاملة" },
  { icon: "◫", title: "محتوى سوشيال ميديا",  desc: "منشورات Instagram و TikTok و Twitter جاهزة للنشر" },
  { icon: "◧", title: "Landing Page",         desc: "صفحة هبوط HTML كاملة جاهزة للرفع فوراً" },
  { icon: "◪", title: "بوشير احترافي",        desc: "بروشور البراند جاهز للطباعة والمشاركة" },
  { icon: "◎", title: "Brand Score",          desc: "تقييم شامل لقوة البراند في السوق العربي" },
];

const STEPS = [
  { n: "01", title: "أدخل فكرتك",  desc: "صف مشروعك أو براندك بكلماتك العادية" },
  { n: "02", title: "اختر أسلوبك", desc: "اختر الألوان والأسلوب البصري المناسب" },
  { n: "03", title: "الـ AI يعمل", desc: "Claude AI يولّد هويتك الكاملة خلال دقيقة" },
  { n: "04", title: "حمّل وابدأ",  desc: "حمّل كل ملفاتك وابدأ براندك فوراً" },
];

const CATEGORY_COLORS = [
  "#C9813A", "#1A56DB", "#0E9F6E",
  "#9333EA", "#0891B2", "#D97706",
  "#E11D48", "#059669", "#7C3AED",
];

const PLANS = [
  {
    name: "مجاني",
    monthlyPrice: "0", yearlyPrice: "0",
    period: "دائماً", yearlyNote: "",
    color: "#1E1E2E", badge: undefined,
    features: ["3 براندات شهرياً", "لوجو SVG", "هوية بصرية", "Brand Score"],
    missing: ["محتوى سوشيال", "Landing Page", "بوشير", "Export ZIP"],
    cta: "ابدأ مجاناً",
  },
  {
    name: "Pro",
    monthlyPrice: "29", yearlyPrice: "19",
    period: "شهرياً", yearlyNote: "توفّر $120 سنوياً",
    color: "#C9973A", badge: "الأشهر",
    features: ["براندات غير محدودة", "لوجو SVG", "هوية بصرية", "Brand Score", "محتوى سوشيال", "Landing Page", "بوشير احترافي", "Export ZIP"],
    missing: [],
    cta: "جرّب Pro",
  },
  {
    name: "Business",
    monthlyPrice: "79", yearlyPrice: "55",
    period: "شهرياً", yearlyNote: "توفّر $288 سنوياً",
    color: "#7C3AED", badge: "للشركات",
    features: [
      "براندات غير محدودة", "لوجو SVG + AI Variations", "هوية بصرية موسّعة",
      "Brand Score + تقرير PDF", "محتوى سوشيال (30 منشور/شهر)",
      "Landing Page متعددة", "بوشير + كتالوج", "Export ZIP", "White Label", "أولوية في الدعم",
    ],
    missing: [],
    cta: "ابدأ Business",
  },
];

/* ─────────────────────────────────────────────
   HOOK: جلب البراندات الحقيقية
───────────────────────────────────────────── */
function useRealBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/projects", { credentials: "include", signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(({ projects }) => {
        const mapped: Brand[] = (projects as any[])
          .filter((p: any) => p.status === "completed" && (p.customBrandName || p.projectTitle))
          .slice(0, 6)
          .map((p: any, i: number) => ({
            name:     p.customBrandName || p.projectTitle,
            category: p.selectedStyle || "براند",
            color:    CATEGORY_COLORS[i % CATEGORY_COLORS.length],
          }));
        setBrands(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { brands, loading };
}

/* ─────────────────────────────────────────────
   LOGO COMPONENT
───────────────────────────────────────────── */
function ArabBrandLogo({ size = 36 }: { size?: number }) {
  const scale = size / 36;
  return (
    <svg
      width={160 * scale}
      height={size}
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="18,3 31,10 31,26 18,33 5,26 5,10" fill="url(#hexGoldL)" />
      <text x="18" y="22" textAnchor="middle" fontFamily="Sora,sans-serif" fontSize="11" fontWeight="800" fill="#0A0800">AB</text>
      <text x="42" y="24" fontFamily="Sora,sans-serif" fontSize="15" fontWeight="800" letterSpacing="1.5" fill="url(#goldTextL)">ArabBrand</text>
      <defs>
        <linearGradient id="hexGoldL" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0C96B" />
          <stop offset="100%" stopColor="#C9973A" />
        </linearGradient>
        <linearGradient id="goldTextL" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F0C96B" />
          <stop offset="60%" stopColor="#C9973A" />
          <stop offset="100%" stopColor="#E8B84B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   BRAND CARD SKELETON
───────────────────────────────────────────── */
function BrandSkeleton() {
  return (
    <div style={{
      background: "#0E0E1A", border: "1px solid #1E1E2E",
      borderRadius: 12, padding: "1rem 1.25rem", height: 62,
      animation: "arabPulse 1.6s ease-in-out infinite",
    }} />
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function LandingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { brands, loading } = useRealBrands();

  /* ── particle canvas ref ── */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.4,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.25 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,151,58,${d.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div dir="rtl" style={{ paddingTop: 64, fontFamily: "Tajawal,sans-serif" }}>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Tajawal:wght@400;500;700&display=swap');
        @keyframes arabPulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .fu1{animation:fadeUp .65s .1s both}
        .fu2{animation:fadeUp .65s .25s both}
        .fu3{animation:fadeUp .65s .4s both}
        .fu4{animation:fadeUp .65s .55s both}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #C9973A33; }
      `}</style>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "4rem 1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* particle canvas */}
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

        {/* grid overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "linear-gradient(#C9973A08 1px,transparent 1px),linear-gradient(90deg,#C9973A08 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }} />

        {/* glow blobs */}
        <div style={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: 640, height: 480, background: "radial-gradient(ellipse,#C9973A0B,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "8%", width: 280, height: 280, background: "radial-gradient(circle,#7C3AED07,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 640, position: "relative", zIndex: 1 }}>
          <h1 className="fu2" style={{
            fontFamily: "Sora,sans-serif",
            fontSize: "clamp(2.4rem,6.5vw,4rem)",
            fontWeight: 800, lineHeight: 1.08,
            letterSpacing: "-2.5px", color: "#F0EDE6",
            marginBottom: "1.25rem",
          }}>
            <span style={{ color: "#C9973A" }}>ArabBrand</span>
            <br />
            <span style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)", color: "#6B6480", fontWeight: 700 }}>براندك في دقيقة واحدة</span>
          </h1>

          <p className="fu3" style={{
            fontSize: "1rem", color: "#5A5370", lineHeight: 1.9,
            maxWidth: 480, margin: "0 auto 2.5rem",
          }}>
            من فكرة في دماغك إلى براند كامل بلوجو وهوية ومحتوى وصفحة هبوط — كل ده بالذكاء الاصطناعي خصيصاً للسوق العربي
          </p>

          <div className="fu3" style={{ display: "flex", gap: ".75rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <Link to="/register" style={{
              padding: ".95rem 2.25rem", borderRadius: 14,
              background: "linear-gradient(135deg,#E0A840,#C9813A)",
              color: "#08080F",
              fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: "1.05rem",
              textDecoration: "none", boxShadow: "0 8px 28px #C9973A28",
              transition: "all .2s", display: "inline-block",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px #C9973A40"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px #C9973A28"; }}
            >ابدأ مجاناً ✦</Link>

            <a href="#how" style={{
              padding: ".95rem 2.25rem", borderRadius: 14,
              border: "1.5px solid #252336", background: "transparent",
              color: "#5A5370",
              fontFamily: "Tajawal,sans-serif", fontWeight: 600, fontSize: "1rem",
              textDecoration: "none", transition: "all .2s", display: "inline-block",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9973A44"; (e.currentTarget as HTMLElement).style.color = "#C9973A"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#252336"; (e.currentTarget as HTMLElement).style.color = "#5A5370"; }}
            >كيف يعمل؟</a>
          </div>

          {/* stats */}
          <div className="fu4" style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[["6+", "مجالات تخدمها"], ["4", "مخرجات بالـ AI"], ["دقيقة", "وقت التوليد"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Sora,sans-serif", fontSize: "2rem", fontWeight: 800, color: "#C9973A", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: ".72rem", color: "#2E2B40", marginTop: 4, letterSpacing: ".5px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          REAL BRANDS — dynamic
      ══════════════════════════════════════ */}
      <section style={{ padding: "4rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C9973A", marginBottom: ".75rem" }}>براندات اتولّدت فعلاً</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: ".625rem" }}>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BrandSkeleton key={i} />)
            : brands.length === 0
              ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#2E2B40", padding: "2rem", fontSize: ".85rem" }}>
                  لا توجد براندات بعد — كن أول من يبني هويته!
                </div>
              )
              : brands.map((b, i) => (
                <div key={i} style={{
                  background: "#0E0E1A",
                  border: "1px solid #1E1E2E",
                  borderRight: `3px solid ${b.color}`,
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  display: "flex", alignItems: "center",
                  transition: "all .25s", cursor: "default",
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.background = "#13131E"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = `0 8px 24px ${b.color}18`; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.background = "#0E0E1A"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
                >
                  <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: ".92rem", color: "#F0EDE6" }}>{b.name}</div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section id="features" style={{ padding: "5rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C9973A", marginBottom: ".75rem" }}>المميزات</p>
          <h2 style={{ fontFamily: "Sora,sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 700, color: "#F0EDE6", letterSpacing: "-1px" }}>كل اللي براندك محتاجه</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 18,
              padding: "1.75rem 1.5rem", transition: "all .25s", cursor: "default",
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#C9973A33"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 40px #C9973A0A"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "#1E1E2E"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: "1.5rem", color: "#C9973A44", marginBottom: ".75rem", fontFamily: "monospace" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".5rem" }}>{f.title}</h3>
              <p style={{ fontSize: ".82rem", color: "#5A5370", lineHeight: 1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section id="how" style={{ padding: "5rem 1.5rem", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C9973A", marginBottom: ".75rem" }}>كيف يعمل</p>
          <h2 style={{ fontFamily: "Sora,sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 700, color: "#F0EDE6", letterSpacing: "-1px" }}>4 خطوات بس</h2>
        </div>

        <div style={{ position: "relative" }}>
          {/* vertical line */}
          <div style={{ position: "absolute", right: 29, top: 0, bottom: 0, width: 1, background: "linear-gradient(#C9973A22,#C9973A08)", pointerEvents: "none" }} />
          {STEPS.map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: "1.25rem", alignItems: "flex-start",
              padding: "1.5rem", background: "#0E0E1A", border: "1px solid #1E1E2E",
              borderRadius: 16, marginBottom: ".625rem", transition: "all .25s",
              position: "relative",
            }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#C9973A33"; el.style.background = "#13131E"; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "#1E1E2E"; el.style.background = "#0E0E1A"; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                border: "1.5px solid #C9973A33",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "Sora,sans-serif", fontSize: ".72rem", fontWeight: 800, color: "#C9973A" }}>{s.n}</span>
              </div>
              <div style={{ paddingTop: ".5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>{s.title}</h3>
                <p style={{ fontSize: ".82rem", color: "#5A5370", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING
      ══════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "5rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#C9973A", marginBottom: ".75rem" }}>الأسعار</p>
          <h2 style={{ fontFamily: "Sora,sans-serif", fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 700, color: "#F0EDE6", letterSpacing: "-1px" }}>بسيط وواضح</h2>
        </div>

        {/* billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 12, padding: 4, gap: 4 }}>
            {(["monthly", "yearly"] as BillingCycle[]).map(cycle => (
              <button key={cycle} onClick={() => setBilling(cycle)} style={{
                padding: ".5rem 1.25rem", borderRadius: 9, border: "none", cursor: "pointer",
                fontFamily: "Tajawal,sans-serif", fontWeight: 600, fontSize: ".875rem",
                transition: "all .2s",
                background: billing === cycle ? "#C9973A" : "transparent",
                color: billing === cycle ? "#08080F" : "#5A5370",
                display: "inline-flex", alignItems: "center", gap: ".4rem",
              }}>
                {cycle === "monthly" ? "شهري" : "سنوي"}
                {cycle === "yearly" && (
                  <span style={{
                    fontSize: ".62rem", background: billing === "yearly" ? "#08080F22" : "#C9973A22",
                    color: billing === "yearly" ? "#08080F" : "#C9973A",
                    padding: ".1rem .45rem", borderRadius: 5,
                  }}>وفّر 35%</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: "1rem", alignItems: "stretch" }}>
          {PLANS.map((p, i) => (
            <div key={i} style={{
              background: i === 1 ? "linear-gradient(145deg,#1A1508,#1E1B0C)" : i === 2 ? "linear-gradient(145deg,#110B1E,#160E22)" : "#0E0E1A",
              border: `1.5px solid ${i === 1 ? "#C9973A50" : i === 2 ? "#7C3AED50" : "#1E1E2E"}`,
              borderRadius: 20, padding: "2rem", position: "relative",
              boxShadow: i === 1 ? "0 20px 60px #C9973A14" : i === 2 ? "0 20px 60px #7C3AED10" : "none",
              display: "flex", flexDirection: "column",
              transition: "transform .25s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {p.badge && (
                <div style={{
                  position: "absolute", top: -12, right: 20,
                  padding: ".25rem .875rem", borderRadius: 20,
                  background: i === 2 ? "#7C3AED" : "#C9973A",
                  color: "#08080F", fontSize: ".68rem", fontWeight: 700, letterSpacing: "1px",
                }}>{p.badge}</div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{ fontSize: ".8rem", color: "#5A5370", marginBottom: ".5rem" }}>{p.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: ".25rem" }}>
                  <span style={{
                    fontFamily: "Sora,sans-serif", fontSize: "2.75rem", fontWeight: 800,
                    color: i === 1 ? "#C9973A" : i === 2 ? "#A78BFA" : "#F0EDE6",
                  }}>
                    ${billing === "yearly" && p.yearlyPrice !== "0" ? p.yearlyPrice : p.monthlyPrice}
                  </span>
                  <span style={{ fontSize: ".8rem", color: "#2E2B40" }}>/{p.period}</span>
                </div>
                {billing === "yearly" && p.yearlyNote && (
                  <p style={{ fontSize: ".72rem", color: "#4ADE80", marginTop: ".25rem" }}>{p.yearlyNote}</p>
                )}
                {billing === "yearly" && p.monthlyPrice !== "0" && (
                  <p style={{ fontSize: ".72rem", color: "#2E2B40", textDecoration: "line-through" }}>${p.monthlyPrice}/شهرياً</p>
                )}
              </div>

              <div style={{ marginBottom: "1.75rem", flex: 1 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: ".5rem", padding: ".45rem 0",
                    borderBottom: "1px solid #1A1826",
                  }}>
                    <span style={{ fontSize: ".82rem", color: "#C4BDB5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                    <span style={{ color: "#4ADE80", fontSize: ".85rem", flexShrink: 0 }}>✓</span>
                  </div>
                ))}
                {p.missing.map((f, j) => (
                  <div key={j} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: ".5rem", padding: ".45rem 0",
                    borderBottom: "1px solid #1A1826", opacity: .22,
                  }}>
                    <span style={{ fontSize: ".82rem", color: "#3A3650", whiteSpace: "nowrap" }}>{f}</span>
                    <span style={{ color: "#3A3650", fontSize: ".85rem", flexShrink: 0 }}>✗</span>
                  </div>
                ))}
              </div>

              <Link to="/register" style={{
                display: "block", textAlign: "center",
                padding: ".875rem", borderRadius: 12,
                background: i === 1 ? "linear-gradient(135deg,#E0A840,#C9813A)" : i === 2 ? "#7C3AED" : "#161424",
                color: i === 0 ? "#5A5370" : "#fff",
                fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: ".9rem",
                textDecoration: "none", transition: "all .2s",
                boxShadow: i === 1 ? "0 6px 20px #C9973A28" : "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = ".85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
              >{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{ padding: "5rem 1.5rem", textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg,#0E0E1A,#13131E)",
          border: "1px solid #C9973A1A",
          borderRadius: 24, padding: "3.5rem 2rem",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
            width: 240, height: 120,
            background: "radial-gradient(ellipse,#C9973A12,transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "#C9973A" }}>✦</div>
          <h2 style={{
            fontFamily: "Sora,sans-serif",
            fontSize: "clamp(1.5rem,4vw,2rem)",
            fontWeight: 700, color: "#F0EDE6",
            letterSpacing: "-1px", marginBottom: "1rem",
          }}>جاهز تبني براندك؟</h2>
          <p style={{ fontSize: ".9rem", color: "#5A5370", lineHeight: 1.85, marginBottom: "1.75rem" }}>
            انضم لمئات المشاريع العربية اللي بنت هويتها بـ ArabBrand
          </p>
          <Link to="/register" style={{
            display: "inline-block", padding: "1rem 2.5rem", borderRadius: 14,
            background: "linear-gradient(135deg,#E0A840,#C9813A)",
            color: "#08080F",
            fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: "1rem",
            textDecoration: "none", boxShadow: "0 8px 32px #C9973A28",
            transition: "all .2s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 40px #C9973A40"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px #C9973A28"; }}
          >ابدأ مجاناً الآن ✦</Link>
        </div>
      </section>

{/* ══════════════════════════════════════
    FOOTER
══════════════════════════════════════ */}
<footer style={{ padding: "2rem 1.5rem", borderTop: "1px solid #141220", textAlign: "center" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: ".75rem" }}>
    {/* Hexagon icon */}
    <svg width="28" height="28" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="17,2 30,9 30,25 17,32 4,25 4,9" fill="url(#footerHex)" />
      <text x="17" y="21" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="800" fill="#0A0800">AB</text>
      <defs>
        <linearGradient id="footerHex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0C96B"/>
          <stop offset="100%" stopColor="#C9973A"/>
        </linearGradient>
      </defs>
    </svg>
    {/* Brand name */}
    <span style={{
      fontFamily: "Sora, sans-serif",
      fontSize: "14px",
      fontWeight: 800,
      letterSpacing: "0.5px",
      background: "linear-gradient(90deg,#F0C96B,#C9973A)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}>ArabBrand</span>
  </div>
  <p style={{ fontSize: ".72rem", color: "#2E2B40", letterSpacing: ".5px" }}>
    © {new Date().getFullYear()} ArabBrand — جميع الحقوق محفوظة
  </p>
</footer>

    </div>
  );
}