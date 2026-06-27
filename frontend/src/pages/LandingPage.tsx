import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { apiFetch } from "../lib/api";
/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type BillingCycle = "monthly" | "yearly";
type Brand = { name: string; category: string; color: string };

/* ─────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────── */
const FEATURES = [
  { icon: "🎨", title: "الهوية البصرية",    desc: "هوية بصرية متكاملة تعبّر عن روح براندك بدقة" },
  { icon: "🏷️", title: "الشعار",            desc: "لوجو SVG احترافي قابل للتعديل بدون فقدان الجودة" },
  { icon: "📱", title: "السوشيال ميديا",     desc: "منشورات Instagram و TikTok و Twitter جاهزة للنشر" },
  { icon: "🌐", title: "صفحة الهبوط",        desc: "Landing Page HTML كاملة جاهزة للرفع فوراً" },
  { icon: "📄", title: "البروشور",           desc: "بروشور احترافي جاهز للطباعة والمشاركة" },
  { icon: "💼", title: "بطاقة العمل",        desc: "بطاقة عمل أنيقة تعكس هويتك المهنية" },
  { icon: "🚀", title: "خطة الإطلاق",        desc: "خطة إطلاق مدروسة خطوة بخطوة لضمان النجاح" },
  { icon: "📊", title: "تحليل SWOT",         desc: "تحليل شامل لنقاط القوة والضعف والفرص والتهديدات" },
  { icon: "💬", title: "الاعتراضات",         desc: "ردود جاهزة على اعتراضات العملاء المحتملين" },
  { icon: "👤", title: "العميل المثالي",      desc: "بروفايل تفصيلي لجمهورك المستهدف" },
  { icon: "🎬", title: "سكريبت إعلان",       desc: "سكريبت إعلاني جذاب يحول المشاهد لعميل" },
  { icon: "📧", title: "حملة إيميل",         desc: "سلسلة إيميلات تسويقية مصممة للتحويل" },
  { icon: "🔍", title: "تحليل المنافسين",     desc: "دراسة معمقة للمنافسين وكيف تتميز عنهم" },
  { icon: "🏢", title: "شرح البيزنس",        desc: "عرض تقديمي واضح لفكرة مشروعك" },
  { icon: "🎯", title: "تفضيلات الأجيال",     desc: "استراتيجية مخصصة لكل شريحة عمرية في السوق" },
  { icon: "❓", title: "الأسئلة الشائعة",     desc: "FAQ جاهز يجيب على كل أسئلة عملائك" },
  { icon: "🌍", title: "جوجل",               desc: "تهيئة SEO واستراتيجية ظهور على محركات البحث" },
];

const STEPS = [
  { n: "01", title: "أدخل فكرتك",  desc: "صف مشروعك أو براندك بكلماتك العادية" },
  { n: "02", title: "اختر أسلوبك", desc: "اختر الألوان والأسلوب البصري المناسب" },
  { n: "03", title: "الـ AI يعمل", desc: "AI يولّد هويتك الكاملة خلال دقيقة" },
  { n: "04", title: "حمّل وابدأ",  desc: "حمّل كل ملفاتك وابدأ براندك فوراً" },
];

const CATEGORY_COLORS = [
  "#C9813A","#1A56DB","#0E9F6E","#9333EA","#0891B2","#D97706","#E11D48","#059669","#7C3AED",
];

const PLANS = [
  {
    name: "مجاني", monthlyPrice: "0", yearlyPrice: "0",
    period: "دائماً", yearlyNote: "", color: "#1E1E2E", badge: undefined,
    features: ["3 براندات شهرياً","الشعار SVG","الهوية البصرية","Brand Score"],
    missing: ["السوشيال ميديا","صفحة الهبوط","البروشور","Export ZIP"],
    cta: "ابدأ مجاناً",
  },
  {
    name: "Pro", monthlyPrice: "29", yearlyPrice: "19",
    period: "شهرياً", yearlyNote: "توفّر $120 سنوياً", color: "#C9973A", badge: "الأشهر",
    features: ["براندات غير محدودة","الشعار SVG","الهوية البصرية","Brand Score","السوشيال ميديا","صفحة الهبوط","البروشور","بطاقة العمل","خطة الإطلاق","تحليل SWOT","Export ZIP"],
    missing: [], cta: "جرّب Pro",
  },
  {
    name: "Business", monthlyPrice: "79", yearlyPrice: "55",
    period: "شهرياً", yearlyNote: "توفّر $288 سنوياً", color: "#7C3AED", badge: "للشركات",
    features: ["براندات غير محدودة","شعار + AI Variations","هوية موسّعة","Brand Score + تقرير PDF","سوشيال (30 منشور/شهر)","صفحات هبوط متعددة","بروشور + كتالوج","بطاقة عمل","خطة إطلاق","SWOT + تحليل منافسين","سكريبت إعلان","حملة إيميل","تهيئة جوجل","العميل المثالي","Export ZIP","White Label","أولوية في الدعم"],
    missing: [], cta: "ابدأ Business",
  },
];

const TESTIMONIALS = [
  { name: "أحمد السيد", role: "مؤسس كافيه الصفا", text: "EG Brand غيّر تصوري للكليشة إنه محتاج شركة تسويق كاملة. في أقل من دقيقة عندي لوجو وهوية وصفحة هبوط احترافية.", avatar: "أس", color: "#C9813A" },
  { name: "سارة المنصور", role: "مديرة تك ستوديو", text: "الـ SWOT والعميل المثالي اللي الـ AI ولّدهم كانوا أدق من تقرير استشاري دفعنا فيه آلاف. مفاجأة حقيقية!", avatar: "سم", color: "#7C3AED" },
  { name: "محمد الغامدي", role: "صاحب ميدا كلينيك", text: "سكريبت الإعلان والحملة الإيميلية حولوا معدل التحويل عندنا بشكل ملحوظ جداً. أنصح كل صاحب مشروع.", avatar: "مغ", color: "#0E9F6E" },
];

const NEWS = [
  { date: "يونيو 2026", tag: "ميزة جديدة", title: "إطلاق تحليل المنافسين بالذكاء الاصطناعي", desc: "الآن يقدر EG Brand يحلل منافسيك ويقدملك استراتيجية تميّز مخصصة." },
  { date: "مايو 2026", tag: "تحديث", title: "سكريبت الإعلان وحملة الإيميل متاحين للجميع", desc: "بعد طلبات كتير، أضفنا سكريبت الإعلان وحملة الإيميل لكل خطط Pro وBusiness." },
  { date: "أبريل 2026", tag: "إنجاز", title: "+1000 براند عربي اتولّد بـ EG Brand", desc: "وصلنا لألف براند عربي! شكراً لكل مَن وثق في EG Brand لبناء هويته." },
];

/* ─────────────────────────────────────────────
   HOOK: counter animation
───────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────
   STAT COUNTER COMPONENT
───────────────────────────────────────────── */
function StatCounter({ target, suffix, label, started }: { target: number; suffix: string; label: string; started: boolean }) {
  const count = useCounter(target, 1600, started);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "Sora,sans-serif", fontSize: "2rem", fontWeight: 800, background: "linear-gradient(135deg,#E8C46A,#D4A847)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: ".72rem", color: "#2E2B40", marginTop: 4, letterSpacing: ".5px" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOOK: جلب عدد المشاريع
───────────────────────────────────────────── */
function useProjectCount() {
  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    apiFetch("/api/projects/count", { credentials: "include" })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(({ count }) => setCount(count))
      .catch(() => {});
  }, []);
  return count;
}

/* ─────────────────────────────────────────────
   HOOK: جلب البراندات
───────────────────────────────────────────── */
function useRealBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const c = new AbortController();
    apiFetch("/api/projects", {  signal: c.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(({ projects }) => {
        setBrands((projects as any[])
          .filter((p: any) => p.status === "completed" && (p.customBrandName || p.projectTitle))
          .slice(0, 6)
          .map((p: any, i: number) => ({ name: p.customBrandName || p.projectTitle, category: p.selectedStyle || "براند", color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] })));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => c.abort();
  }, []);
  return { brands, loading };
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */
function BrandSkeleton() {
  return <div style={{ background: "linear-gradient(90deg,#0E0E1A 25%,#13131E 50%,#0E0E1A 75%)", backgroundSize: "200% 100%", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem 1.25rem", height: 62, animation: "shimmer 1.6s ease-in-out infinite" }} />;
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function LandingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { brands, loading } = useRealBrands();
  const projectCount = useProjectCount();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // ← STATS دلوقتي بتاخد العدد الحقيقي من الـ API
  const STATS = useMemo(() => [
    { target: projectCount, suffix: "+", label: "براند اتولّد" },
    { target: 17,           suffix: "",  label: "مخرجات بالـ AI" },
    { target: 1,            suffix: " دقيقة", label: "وقت التوليد" },
  ], [projectCount]);

  /* ── ADVANCED CANVAS: particles + glowing lines + waves + orbs ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width;
    const H = () => canvas.height;

    /* particles */
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      r: Math.random() * 2 + 0.3,
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.6,
    }));

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].gold
              ? `rgba(212,168,71,${alpha})`
              : `rgba(139,92,246,${alpha * 0.7})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const drawWaves = () => {
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amp = 18 + w * 8;
        const freq = 0.006 + w * 0.002;
        const phase = t * 0.4 + w * 1.2;
        const yBase = H() * (0.25 + w * 0.25);
        for (let x = 0; x <= W(); x += 4) {
          const y = yBase + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = 0.04 - w * 0.01;
        ctx.strokeStyle = w % 2 === 0 ? `rgba(212,168,71,${alpha})` : `rgba(139,92,246,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const stars = Array.from({ length: 500 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 1.3 + 0.15,
      o: Math.random() * 0.8 + 0.15,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.75,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.5,
    }));

    const drawSparkle = (x: number, y: number, size: number, alpha: number, gold: boolean) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = gold ? "#E8C46A" : "#ffffff";
      ctx.lineWidth = size * 0.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.4;
      ctx.lineWidth = size * 0.25;
      const d = size * 0.55;
      ctx.beginPath();
      ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
      ctx.stroke();
      ctx.restore();
    };

    const drawStars = () => {
      stars.forEach(s => {
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0) s.x = W(); if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H(); if (s.y > H()) s.y = 0;
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.o * twinkle;
        if (s.r > 0.7) {
          drawSparkle(s.x, s.y, s.r * 2.5, alpha, s.gold);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, Math.max(0, s.r), 0, Math.PI * 2);
          ctx.fillStyle = s.gold ? `rgba(232,196,106,${alpha})` : `rgba(255,255,255,${alpha * 0.8})`;
          ctx.fill();
        }
      });
    };

    const orbs = [
      { x: 0.2, y: 0.3, r: 160, color: "212,168,71", speed: 0.0008 },
      { x: 0.8, y: 0.6, r: 120, color: "139,92,246", speed: 0.0012 },
      { x: 0.5, y: 0.8, r: 90,  color: "212,168,71", speed: 0.001  },
    ];

    const drawOrbs = () => {
      orbs.forEach((orb, i) => {
        const cx = (orb.x + Math.sin(t * orb.speed + i) * 0.08) * W();
        const cy = (orb.y + Math.cos(t * orb.speed * 1.3 + i) * 0.06) * H();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        grad.addColorStop(0, `rgba(${orb.color},0.06)`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, orb.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W(), H());
      drawOrbs();
      drawWaves();
      drawLines();
      drawStars();
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        p.pulse += 0.03;
        if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        const pulsedR = p.r + Math.sin(p.pulse) * 0.5;
        const pulsedO = p.o + Math.sin(p.pulse * 0.7) * 0.08;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, pulsedR), 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? `rgba(212,168,71,${pulsedO})` : `rgba(139,92,246,${pulsedO * 0.6})`;
        ctx.fill();
        if (p.gold && p.r > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0, pulsedR * 3), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,168,71,${pulsedO * 0.06})`;
          ctx.fill();
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  /* ── scroll reveal ── */
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }, i * 60);
        }
      });
    }, { threshold: 0.08 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── stats counter trigger ── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const sectionStyle: React.CSSProperties = { padding: "6rem 1.5rem", maxWidth: 940, margin: "0 auto" };
  const sectionLabelStyle: React.CSSProperties = { fontSize: ".7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#D4A847", marginBottom: ".75rem" };
  const sectionTitleStyle: React.CSSProperties = { fontFamily: "Sora,sans-serif", fontSize: "clamp(1.75rem,4vw,2.4rem)", fontWeight: 700, color: "#EAE6DE", letterSpacing: "-1px" };
  const revealStyle: React.CSSProperties = { opacity: 0, transform: "translateY(32px)", transition: "all 0.75s cubic-bezier(0.16,1,0.3,1)" };

  return (
    <div dir="rtl" style={{ paddingTop: 64, fontFamily: "Tajawal,sans-serif", background: "#07070F", color: "#EAE6DE" }}>

      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Tajawal:wght@400;500;700&display=swap');

        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUpSlow { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes orbFloat { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-24px)} }
        @keyframes orbFloat2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(5deg)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-12px,-20px)} }
        @keyframes sparkle { 0%,100%{transform:scale(1) rotate(0deg);opacity:.8} 25%{transform:scale(1.15) rotate(12deg);opacity:1} 75%{transform:scale(.9) rotate(-6deg);opacity:.7} }
        @keyframes ctaBreathe { 0%,100%{box-shadow:0 0 0 0 rgba(212,168,71,0),0 8px 32px rgba(212,168,71,.3)} 50%{box-shadow:0 0 0 8px rgba(212,168,71,.08),0 16px 48px rgba(212,168,71,.45)} }
        @keyframes ctaShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes lineSlide { from{transform:scaleX(0);transform-origin:right} to{transform:scaleX(1);transform-origin:right} }
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
        @keyframes glowPulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes textReveal { from{opacity:0;transform:translateY(20px) skewY(2deg)} to{opacity:1;transform:translateY(0) skewY(0deg)} }
        @keyframes badgeSlide { from{opacity:0;transform:translateY(-12px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes statPop { from{opacity:0;transform:scale(.8) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }

  @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }






        .fu-badge { animation: badgeSlide .5s .05s cubic-bezier(.34,1.56,.64,1) both }
        .fu1 { animation: textReveal .7s .15s cubic-bezier(.16,1,.3,1) both }
        .fu2 { animation: textReveal .7s .3s cubic-bezier(.16,1,.3,1) both }
        .fu3 { animation: fadeUp .7s .45s cubic-bezier(.16,1,.3,1) both }
        .fu4 { animation: fadeUp .7s .6s cubic-bezier(.16,1,.3,1) both }
        .fu5 { animation: statPop .6s .8s cubic-bezier(.34,1.56,.64,1) both }

        * { box-sizing:border-box; margin:0; padding:0; }
        ::selection { background:#D4A84733; }

        .feat-card { transition: all .4s cubic-bezier(.34,1.2,.64,1) !important; }
        .feat-card:hover {
          border-color:rgba(212,168,71,.3) !important;
          transform: translateY(-8px) scale(1.02) !important;
          background: linear-gradient(145deg,#12121F,#15152A) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 0 1px rgba(212,168,71,.1), inset 0 1px 0 rgba(255,255,255,.04) !important;
        }
        .feat-card:hover .feat-line { transform:scaleX(1) !important; }
        .feat-card:hover .feat-icon {
          background: rgba(212,168,71,.16) !important;
          border-color: rgba(212,168,71,.4) !important;
          transform: scale(1.1) rotate(-4deg) !important;
          box-shadow: 0 0 20px rgba(212,168,71,.2) !important;
        }

        .step-item { transition: all .35s cubic-bezier(.34,1.2,.64,1) !important; }
        .step-item:hover {
          border-color: rgba(212,168,71,.3) !important;
          background: linear-gradient(135deg,#12121F,#15152A) !important;
          transform: translateX(-6px) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,.3), 4px 0 0 rgba(212,168,71,.4) !important;
        }
        .step-item:hover .step-num {
          background: rgba(212,168,71,.15) !important;
          border-color: #D4A847 !important;
          box-shadow: 0 0 20px rgba(212,168,71,.3) !important;
        }

        .brand-card { transition: all .35s cubic-bezier(.34,1.56,.64,1) !important; }
        .brand-card:hover {
          background: #13131E !important;
          transform: translateY(-4px) scale(1.01) !important;
          box-shadow: 0 10px 30px rgba(0,0,0,.3) !important;
        }

        .plan-card { transition: all .4s cubic-bezier(.34,1.56,.64,1) !important; }
        .plan-card:hover { transform: translateY(-10px) scale(1.02) !important; }
        .plan-card:hover .plan-cta { transform: translateY(-1px) !important; opacity: .9 !important; }

        .news-card { transition: all .35s cubic-bezier(.34,1.2,.64,1) !important; }
        .news-card:hover {
          border-color: rgba(212,168,71,.3) !important;
          transform: translateY(-5px) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,.3), 0 0 0 1px rgba(212,168,71,.08) !important;
          background: linear-gradient(145deg,#10101D,#13132A) !important;
        }

        .team-card { transition: all .35s cubic-bezier(.34,1.2,.64,1) !important; }
        .team-card:hover {
          border-color: rgba(212,168,71,.3) !important;
          transform: translateY(-5px) scale(1.03) !important;
          box-shadow: 0 12px 36px rgba(0,0,0,.3) !important;
        }

        .testimonial-card { transition: all .35s cubic-bezier(.34,1.2,.64,1) !important; }
        .testimonial-card:hover {
          border-color: rgba(212,168,71,.25) !important;
          transform: translateY(-5px) !important;
          box-shadow: 0 16px 48px rgba(0,0,0,.3) !important;
        }

        .cta-btn-main {
          animation: ctaBreathe 3s ease-in-out infinite;
          background-size: 200% auto !important;
        }
        .cta-btn-main:hover {
          animation: none !important;
          transform: translateY(-4px) scale(1.03) !important;
          box-shadow: 0 20px 60px rgba(212,168,71,.45) !important;
        }

        .section-underline { display: inline-block; position: relative; }
        .section-underline::after {
          content: '';
          position: absolute;
          bottom: -6px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #D4A847, transparent);
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform .4s ease;
        }
        .section-underline:hover::after { transform: scaleX(1); }

        .nav-link-animated {
          position: relative;
          font-size:.83rem; color:#6B6480; text-decoration:none;
          transition: color .25s; white-space:nowrap; padding-bottom: 4px;
        }
        .nav-link-animated::after {
          content:'';
          position:absolute; bottom:0; left:50%; right:50%;
          height:1.5px;
          background: linear-gradient(90deg,#E8C46A,#D4A847);
          border-radius:2px;
          transition: left .3s cubic-bezier(.34,1.2,.64,1), right .3s cubic-bezier(.34,1.2,.64,1);
        }
        .nav-link-animated:hover { color: #D4A847 !important; }
        .nav-link-animated:hover::after { left:0; right:0; }
        .nav-link-animated.active { color: #D4A847 !important; }
        .nav-link-animated.active::after { left:0; right:0; }
      `}</style>

      {/* ══════════ HERO ══════════ */}
      <section style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "6rem 1.5rem 4rem", position: "relative", overflow: "hidden" }}>

        <div style={{ position:"absolute", top:"-15%", left:"50%", width:600, height:500, background:"radial-gradient(ellipse,rgba(212,168,71,.10),transparent 65%)", filter:"blur(50px)", pointerEvents:"none", animation:"orbFloat 9s ease-in-out infinite" }} />
        <div style={{ position:"absolute", bottom:"5%", right:"3%", width:320, height:320, background:"radial-gradient(circle,rgba(139,92,246,.09),transparent 70%)", filter:"blur(35px)", pointerEvents:"none", animation:"orbFloat2 11s ease-in-out infinite" }} />
        <div style={{ position:"absolute", top:"20%", left:"8%", width:200, height:200, background:"radial-gradient(circle,rgba(212,168,71,.06),transparent 70%)", filter:"blur(25px)", pointerEvents:"none", animation:"orbFloat3 13s ease-in-out infinite" }} />

        <div style={{ position:"absolute", inset:0, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(212,168,71,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,71,.03) 1px,transparent 1px)", backgroundSize:"56px 56px", maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)", WebkitMaskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)" }} />

        <div style={{ maxWidth: 660, position: "relative", zIndex: 1 }}>
          <div className="fu-badge" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:".35rem 1rem", borderRadius:50, border:"1px solid rgba(212,168,71,.3)", background:"rgba(212,168,71,.07)", fontSize:".75rem", color:"#D4A847", marginBottom:"1.75rem", backdropFilter:"blur(8px)" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#D4A847", animation:"pulse 2s ease-in-out infinite", display:"inline-block" }} />
            مدعوم بالذكاء الاصطناعي للسوق العربي
          </div>

          <div style={{ overflow: "hidden", marginBottom: ".5rem" }}>
            <h1 className="fu1" style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(2.4rem,6.5vw,4rem)", fontWeight:800, lineHeight:1.05, letterSpacing:"-2.5px" }}>
              <span style={{ background:"linear-gradient(135deg,#E8C46A 0%,#D4A847 40%,#C8903A 70%,#E8C46A 100%)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"ctaShimmer 4s linear infinite" }}>EG Brand</span>
            </h1>
          </div>

          <div style={{ overflow: "hidden", marginBottom: "1.25rem" }}>
            <div className="fu2" style={{ fontSize:"clamp(1.3rem,3.5vw,2rem)", color:"#6B6480", fontFamily:"Sora,sans-serif", fontWeight:600 }}>
              براندك في دقيقة واحدة
            </div>
          </div>

          <p className="fu3" style={{ fontSize:"1rem", color:"#4A4560", lineHeight:1.9, maxWidth:490, margin:"0 auto 2.25rem" }}>
            من فكرة في دماغك إلى براند كامل بلوجو وهوية ومحتوى وصفحة هبوط — كل ده بالذكاء الاصطناعي خصيصاً للسوق العربي
          </p>

          <div className="fu4" style={{ display:"flex", gap:".75rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"3rem" }}>
            <Link to="/register" className="cta-btn-main" style={{ padding:".95rem 2.25rem", borderRadius:14, background:"linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)", color:"#08080F", border:"none", fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1.05rem", textDecoration:"none", display:"inline-block", transition:"all .3s cubic-bezier(.34,1.56,.64,1)" }}>
              ابدأ مجاناً ✦
            </Link>
            <a href="#how" style={{ padding:".95rem 2.25rem", borderRadius:14, border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.02)", color:"#6B6480", fontFamily:"Tajawal,sans-serif", fontWeight:600, fontSize:"1rem", textDecoration:"none", transition:"all .25s", display:"inline-block", backdropFilter:"blur(8px)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(212,168,71,.4)"; (e.currentTarget as HTMLElement).style.color="#D4A847"; (e.currentTarget as HTMLElement).style.background="rgba(212,168,71,.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)"; (e.currentTarget as HTMLElement).style.color="#6B6480"; (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,.02)"; }}
            >كيف يعمل؟</a>
          </div>

          <div ref={statsRef} className="fu5" style={{ display:"flex", gap:"2.5rem", justifyContent:"center", flexWrap:"wrap" }}>
            {STATS.map((s) => (
              <StatCounter key={s.label} target={s.target} suffix={s.suffix} label={s.label} started={statsStarted} />
            ))}
          </div>
        </div>
      </section>






















{/* ══════════ REAL BRANDS MARQUEE ══════════ */}
<section style={{ padding: "4rem 0" }} className="reveal">
  <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
    <p style={sectionLabelStyle}>براندات اتولّدت فعلاً</p>
  </div>

  <div style={{ position: "relative", overflow: "hidden" }}>
    {/* Fade edges */}
    <div style={{
      position: "absolute", top: 0, left: 0, bottom: 0, width: 80, zIndex: 2,
      background: "linear-gradient(to right, #080816, transparent)", pointerEvents: "none"
    }} />
    <div style={{
      position: "absolute", top: 0, right: 0, bottom: 0, width: 80, zIndex: 2,
      background: "linear-gradient(to left, #080816, transparent)", pointerEvents: "none"
    }} />

    {loading ? (
      <div style={{ display: "flex", gap: 12, padding: "0 1rem" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            background: "#0D0D1C",
            border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 10,
            padding: ".75rem 1.1rem",
            width: 180,
            height: 40,
            flexShrink: 0,
            opacity: 0.4,
          }} />
        ))}
      </div>
    ) : brands.length === 0 ? (
      <div style={{ textAlign: "center", color: "rgba(255,255,255,.3)", padding: "2rem", fontSize: ".85rem" }}>
        لا توجد براندات بعد — كن أول من يبني هويته!
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          gap: 12,
          width: "max-content",
          animation: "marquee 22s linear infinite",
        }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
      >
        {[...brands, ...brands].map((b, i) => (
          <div key={i} style={{
            background: "#0D0D1C",
            border: "1px solid rgba(255,255,255,.06)",
            borderRight: `3px solid ${b.color}`,
            borderRadius: 10,
            padding: ".75rem 1.1rem",
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: b.color,
              boxShadow: `0 0 10px ${b.color}`,
              flexShrink: 0,
              animation: "glowPulse 2s ease-in-out infinite",
            }} />
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: ".9rem", color: "#EAE6DE" }}>
              {b.name.length > 28 ? b.name.slice(0, 28) + "…" : b.name}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>




















      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ ...sectionStyle, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={sectionLabelStyle}>المميزات</p>
          <h2 style={sectionTitleStyle}>كل اللي براندك محتاجه</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:"1rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card" style={{ background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"1.5rem", cursor:"default", position:"relative", overflow:"hidden" }}>
              <div className="feat-line" style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,#D4A847,transparent)", transform:"scaleX(0)", transition:"transform .5s ease" }} />
              <div className="feat-icon" style={{ width:44, height:44, borderRadius:12, background:"rgba(212,168,71,.07)", border:"1px solid rgba(212,168,71,.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", marginBottom:".875rem", transition:"all .4s cubic-bezier(.34,1.56,.64,1)" }}>{f.icon}</div>
              <h3 style={{ fontSize:".95rem", fontWeight:700, color:"#EAE6DE", marginBottom:".5rem" }}>{f.title}</h3>
              <p style={{ fontSize:".8rem", color:"#6B6480", lineHeight:1.75 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how" style={{ ...sectionStyle, maxWidth:700, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={sectionLabelStyle}>كيف يعمل</p>
          <h2 style={sectionTitleStyle}>4 خطوات بس</h2>
        </div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", right:29, top:0, bottom:0, width:1, background:"linear-gradient(to bottom,transparent,rgba(212,168,71,.25) 20%,rgba(212,168,71,.25) 80%,transparent)", pointerEvents:"none" }} />
          {STEPS.map((s, i) => (
            <div key={i} className="step-item" style={{ display:"flex", gap:"1.25rem", alignItems:"flex-start", padding:"1.5rem", background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:16, marginBottom:".625rem", position:"relative" }}>
              <div className="step-num" style={{ width:44, height:44, borderRadius:"50%", border:"1.5px solid rgba(212,168,71,.3)", background:"rgba(212,168,71,.05)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .35s cubic-bezier(.34,1.56,.64,1)" }}>
                <span style={{ fontFamily:"Sora,sans-serif", fontSize:".7rem", fontWeight:800, color:"#D4A847" }}>{s.n}</span>
              </div>
              <div style={{ paddingTop:".5rem" }}>
                <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#EAE6DE", marginBottom:".375rem" }}>{s.title}</h3>
                <p style={{ fontSize:".82rem", color:"#6B6480", lineHeight:1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section id="clients" style={{ ...sectionStyle, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={sectionLabelStyle}>العملاء</p>
          <h2 style={sectionTitleStyle}>بيقولوا عننا إيه؟</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:"1rem" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"1.75rem", cursor:"default", position:"relative" }}>
              <div style={{ fontSize:"1.5rem", color:"#D4A847", marginBottom:"1rem", opacity:0.6 }}>"</div>
              <p style={{ fontSize:".87rem", color:"#9990AA", lineHeight:1.85, marginBottom:"1.25rem" }}>{t.text}</p>
              <div style={{ display:"flex", alignItems:"center", gap:".75rem" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:`${t.color}22`, border:`1px solid ${t.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Sora,sans-serif", fontSize:".75rem", fontWeight:700, color:t.color }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize:".87rem", fontWeight:700, color:"#EAE6DE" }}>{t.name}</div>
                  <div style={{ fontSize:".75rem", color:"#6B6480" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ NEWS ══════════ */}
      <section id="news" style={{ ...sectionStyle, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={sectionLabelStyle}>الأخبار</p>
          <h2 style={sectionTitleStyle}>آخر التحديثات</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:"1rem" }}>
          {NEWS.map((n,i)=>(
            <div key={i} className="news-card" style={{ background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:18, padding:"1.75rem", cursor:"default" }}>
              <div style={{ display:"flex", alignItems:"center", gap:".5rem", marginBottom:"1rem" }}>
                <span style={{ fontSize:".65rem", fontWeight:700, padding:".25rem .625rem", borderRadius:20, background:"rgba(212,168,71,.1)", color:"#D4A847", border:"1px solid rgba(212,168,71,.2)" }}>{n.tag}</span>
                <span style={{ fontSize:".72rem", color:"#2E2B40" }}>{n.date}</span>
              </div>
              <h3 style={{ fontSize:".97rem", fontWeight:700, color:"#EAE6DE", marginBottom:".625rem", lineHeight:1.5 }}>{n.title}</h3>
              <p style={{ fontSize:".8rem", color:"#6B6480", lineHeight:1.75 }}>{n.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ ABOUT ══════════ */}
      <section id="about" style={{ ...sectionStyle, ...revealStyle }} className="reveal">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"3rem", alignItems:"center" }}>
          <div>
            <p style={sectionLabelStyle}>عن الشركة</p>
            <h2 style={{ ...sectionTitleStyle, marginBottom:"1.25rem" }}>بنبني هويات براندات عربية حقيقية</h2>
            <p style={{ fontSize:".92rem", color:"#6B6480", lineHeight:1.9, marginBottom:"1.5rem" }}>EG Brand منصة مصرية بتستخدم الذكاء الاصطناعي علشان تساعد أصحاب المشاريع والشركات الصغيرة في السوق العربي إنهم يبنوا هويتهم البصرية بسهولة وبسرعة وبجودة احترافية.</p>
            <p style={{ fontSize:".92rem", color:"#6B6480", lineHeight:1.9, marginBottom:"2rem" }}>فريقنا بيؤمن إن كل فكرة تستحق هوية قوية، وإن التسويق الاحترافي مش حكر على الشركات الكبيرة.</p>
            <div style={{ display:"flex", gap:"2rem", flexWrap:"wrap" }}>
              {[["2026","سنة التأسيس"],["+","عضو في الفريق"],["3","دول عربية"]].map(([n,l])=>(
                <div key={l} style={{ animation:"float1 4s ease-in-out infinite" }}>
                  <div style={{ fontFamily:"Sora,sans-serif", fontSize:"1.5rem", fontWeight:800, background:"linear-gradient(135deg,#E8C46A,#D4A847)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{n}</div>
                  <div style={{ fontSize:".75rem", color:"#2E2B40", marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
            {[
              { icon:"🚀", title:"الرؤية", desc:"نكون المنصة الأولى للهوية البصرية في السوق العربي" },
              { icon:"🎯", title:"المهمة", desc:"نمكّن كل صاحب مشروع من براند احترافي في دقيقة" },
              { icon:"💡", title:"الابتكار", desc:"نستخدم أحدث تقنيات الـ AI لخدمة السوق العربي" },
              { icon:"🤝", title:"القيم", desc:"الجودة والأمانة والاحترافية في كل تفاصيلنا" },
            ].map((c,i)=>(
              <div key={i} className="team-card" style={{ background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:14, padding:"1.25rem" }}>
                <div style={{ fontSize:"1.25rem", marginBottom:".625rem" }}>{c.icon}</div>
                <h4 style={{ fontSize:".87rem", fontWeight:700, color:"#EAE6DE", marginBottom:".375rem" }}>{c.title}</h4>
                <p style={{ fontSize:".75rem", color:"#6B6480", lineHeight:1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CONTACT ══════════ */}
      <section id="contact" style={{ ...sectionStyle, maxWidth:700, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={sectionLabelStyle}>اتصل بنا</p>
          <h2 style={sectionTitleStyle}>عندك سؤال؟ احكيلنا</h2>
        </div>
        <div style={{ background:"linear-gradient(145deg,#0D0D1C,#111128)", border:"1px solid rgba(212,168,71,.15)", borderRadius:24, padding:"2.5rem" }}>
          <div style={{ display:"grid", gap:"1rem", marginBottom:"1.5rem" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
              {["الاسم","البريد الإلكتروني"].map(ph=>(
                <input key={ph} type="text" placeholder={ph} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:".75rem 1rem", color:"#EAE6DE", fontSize:".87rem", fontFamily:"Tajawal,sans-serif", outline:"none", transition:"all .25s" }}
                  onFocus={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,168,71,.4)";(e.currentTarget as HTMLElement).style.boxShadow="0 0 0 3px rgba(212,168,71,.06)";}}
                  onBlur={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}
                />
              ))}
            </div>
            <input type="text" placeholder="الموضوع" style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:".75rem 1rem", color:"#EAE6DE", fontSize:".87rem", fontFamily:"Tajawal,sans-serif", outline:"none", transition:"all .25s" }}
              onFocus={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,168,71,.4)";(e.currentTarget as HTMLElement).style.boxShadow="0 0 0 3px rgba(212,168,71,.06)";}}
              onBlur={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}
            />
            <textarea rows={4} placeholder="رسالتك..." style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:10, padding:".75rem 1rem", color:"#EAE6DE", fontSize:".87rem", fontFamily:"Tajawal,sans-serif", outline:"none", resize:"vertical", transition:"all .25s" }}
              onFocus={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(212,168,71,.4)";(e.currentTarget as HTMLElement).style.boxShadow="0 0 0 3px rgba(212,168,71,.06)";}}
              onBlur={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.08)";(e.currentTarget as HTMLElement).style.boxShadow="none";}}
            />
          </div>
          <button className="cta-btn-main" style={{ width:"100%", padding:".95rem", background:"linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)", backgroundSize:"200% auto", border:"none", borderRadius:12, color:"#08080F", fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1rem", cursor:"pointer" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity=".88";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
          >إرسال الرسالة ✦</button>
          <div style={{ display:"flex", gap:"2rem", justifyContent:"center", marginTop:"2rem", flexWrap:"wrap" }}>
            {[{icon:"📧",label:"eg.brand.dev@gmail.com"},{icon:"💬",label:"واتساب: +20 1095496184"}].map((c,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:".5rem", fontSize:".82rem", color:"#6B6480" }}>
                <span>{c.icon}</span><span>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" style={{ ...sectionStyle, ...revealStyle }} className="reveal">
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <p style={sectionLabelStyle}>الأسعار</p>
          <h2 style={sectionTitleStyle}>بسيط وواضح</h2>
        </div>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"inline-flex", background:"#0D0D1C", border:"1px solid rgba(255,255,255,.06)", borderRadius:12, padding:4, gap:4 }}>
            {(["monthly","yearly"] as BillingCycle[]).map(cycle => (
              <button key={cycle} onClick={() => setBilling(cycle)} style={{ padding:".5rem 1.25rem", borderRadius:9, border:"none", cursor:"pointer", fontFamily:"Tajawal,sans-serif", fontWeight:600, fontSize:".875rem", transition:"all .25s cubic-bezier(.34,1.56,.64,1)", background:billing===cycle?"#D4A847":"transparent", color:billing===cycle?"#08080F":"#6B6480", display:"inline-flex", alignItems:"center", gap:".4rem" }}>
                {cycle==="monthly"?"شهري":"سنوي"}
                {cycle==="yearly" && <span style={{ fontSize:".62rem", background:billing==="yearly"?"rgba(8,8,15,.2)":"rgba(212,168,71,.15)", color:billing==="yearly"?"#08080F":"#D4A847", padding:".1rem .45rem", borderRadius:5 }}>وفّر 35%</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1rem", alignItems:"stretch" }}>
          {PLANS.map((p, i) => (
            <div key={i} className="plan-card" style={{ background:i===1?"linear-gradient(145deg,#1A1508,#1E1B0C)":i===2?"linear-gradient(145deg,#110B1E,#160E22)":"#0D0D1C", border:`1.5px solid ${i===1?"rgba(212,168,71,.35)":i===2?"rgba(139,92,246,.35)":"rgba(255,255,255,.06)"}`, borderRadius:20, padding:"2rem", position:"relative", boxShadow:i===1?"0 20px 60px rgba(212,168,71,.12),inset 0 1px 0 rgba(255,255,255,.04)":i===2?"0 20px 60px rgba(139,92,246,.10),inset 0 1px 0 rgba(255,255,255,.04)":"none", display:"flex", flexDirection:"column" }}>
              {p.badge && <div style={{ position:"absolute", top:-13, right:20, padding:".25rem .875rem", borderRadius:20, background:i===2?"#7C3AED":"#D4A847", color:i===2?"#fff":"#08080F", fontSize:".68rem", fontWeight:700, letterSpacing:"1px" }}>{p.badge}</div>}
              <div style={{ marginBottom:"1.5rem" }}>
                <p style={{ fontSize:".8rem", color:"#6B6480", marginBottom:".5rem" }}>{p.name}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:".25rem" }}>
                  <span style={{ fontFamily:"Sora,sans-serif", fontSize:"2.75rem", fontWeight:800, background:i===1?"linear-gradient(135deg,#E8C46A,#D4A847)":"none", WebkitBackgroundClip:i===1?"text":"unset", WebkitTextFillColor:i===1?"transparent":i===2?"#A78BFA":"#EAE6DE", color:i===2?"#A78BFA":i===0?"#EAE6DE":undefined }}>
                    ${billing==="yearly"&&p.yearlyPrice!=="0"?p.yearlyPrice:p.monthlyPrice}
                  </span>
                  <span style={{ fontSize:".8rem", color:"#2E2B40" }}>/{p.period}</span>
                </div>
                {billing==="yearly"&&p.yearlyNote&&<p style={{ fontSize:".72rem", color:"#4ADE80", marginTop:".25rem" }}>{p.yearlyNote}</p>}
                {billing==="yearly"&&p.monthlyPrice!=="0"&&<p style={{ fontSize:".72rem", color:"#2E2B40", textDecoration:"line-through" }}>${p.monthlyPrice}/شهرياً</p>}
              </div>
              <div style={{ marginBottom:"1.75rem", flex:1 }}>
                {p.features.map((f,j)=>(
                  <div key={j} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:".5rem", padding:".4rem 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                    <span style={{ fontSize:".8rem", color:"#C4BDB5" }}>{f}</span>
                    <span style={{ color:"#4ADE80", fontSize:".85rem", flexShrink:0 }}>✓</span>
                  </div>
                ))}
                {p.missing.map((f,j)=>(
                  <div key={j} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:".5rem", padding:".4rem 0", borderBottom:"1px solid rgba(255,255,255,.04)", opacity:.22 }}>
                    <span style={{ fontSize:".8rem", color:"#3A3650" }}>{f}</span>
                    <span style={{ color:"#3A3650", fontSize:".85rem", flexShrink:0 }}>✗</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="plan-cta" style={{ display:"block", textAlign:"center", padding:".875rem", borderRadius:12, background:i===1?"linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)":i===2?"#7C3AED":"rgba(255,255,255,.04)", color:i===0?"#6B6480":i===2?"#fff":"#08080F", border:i===0?"1px solid rgba(255,255,255,.07)":"none", fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:".9rem", textDecoration:"none", transition:"all .25s", boxShadow:i===1?"0 6px 20px rgba(212,168,71,.28)":i===2?"0 6px 20px rgba(139,92,246,.28)":"none" }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity=".85";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
              >{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section style={{ padding:"5rem 1.5rem", textAlign:"center", maxWidth:560, margin:"0 auto", ...revealStyle }} className="reveal">
        <div style={{ background:"linear-gradient(135deg,#0D0D1C,#111128)", border:"1px solid rgba(212,168,71,.18)", borderRadius:24, padding:"3.5rem 2rem", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-60, left:"50%", transform:"translateX(-50%)", width:300, height:160, background:"radial-gradient(ellipse,rgba(212,168,71,.16),transparent 70%)", pointerEvents:"none", animation:"orbFloat 7s ease-in-out infinite" }} />
          <div style={{ position:"absolute", bottom:-40, right:-40, width:200, height:200, background:"radial-gradient(circle,rgba(139,92,246,.08),transparent 70%)", pointerEvents:"none" }} />
          <div style={{ fontSize:"2rem", marginBottom:"1rem", color:"#D4A847", animation:"sparkle 3s ease-in-out infinite" }}>✦</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:700, color:"#EAE6DE", letterSpacing:"-1px", marginBottom:"1rem" }}>جاهز تبني براندك؟</h2>
          <p style={{ fontSize:".9rem", color:"#6B6480", lineHeight:1.85, marginBottom:"1.75rem" }}>انضم لأكثر من ألف مشروع عربي بنى هويته بـ EG Brand</p>
          <Link to="/register" className="cta-btn-main" style={{ display:"inline-block", padding:"1rem 2.5rem", borderRadius:14, background:"linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)", backgroundSize:"200% auto", color:"#08080F", fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1rem", textDecoration:"none", transition:"all .3s cubic-bezier(.34,1.56,.64,1)" }}>
            ابدأ مجاناً الآن ✦
          </Link>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding:"3rem 1.5rem 2rem", borderTop:"1px solid rgba(255,255,255,.05)" }}>
        <div style={{ maxWidth:940, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:"2.5rem", marginBottom:"3rem" }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:"1rem" }}>
                <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
                  <defs>
                    <linearGradient id="footerHex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C46A"/><stop offset="100%" stopColor="#C8903A"/></linearGradient>
                    <filter id="fglow"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#D4A847" floodOpacity="0.5"/></filter>
                  </defs>
                  <polygon points="17,2 30,9 30,25 17,32 4,25 4,9" fill="url(#footerHex)" filter="url(#fglow)"/>
                  <text x="17" y="21" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="800" fill="#0A0800">EG</text>
                </svg>
                <span style={{ fontFamily:"Sora,sans-serif", fontSize:"14px", fontWeight:800, background:"linear-gradient(90deg,#E8C46A,#C8903A)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>EG Brand</span>
              </div>
              <p style={{ fontSize:".8rem", color:"#2E2B40", lineHeight:1.75 }}>منصة الهوية البصرية الأولى للسوق العربي</p>
            </div>
            {[
              { title:"المنتج", links:[["#features","المميزات"],["#pricing","الأسعار"],["#how","كيف يعمل"]] },
              { title:"الشركة", links:[["#about","عن الشركة"],["#news","الأخبار"],["#clients","العملاء"]] },
              { title:"الدعم",  links:[["#contact","اتصل بنا"],["/login","تسجيل الدخول"],["/register","إنشاء حساب"]] },
            ].map(col=>(
              <div key={col.title}>
                <h4 style={{ fontSize:".75rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"#D4A847", marginBottom:"1rem" }}>{col.title}</h4>
                <div style={{ display:"flex", flexDirection:"column", gap:".625rem" }}>
                  {col.links.map(([href,label])=>(
                    <a key={label} href={href} style={{ fontSize:".82rem", color:"#2E2B40", textDecoration:"none", transition:"color .2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#D4A847")}
                      onMouseLeave={e=>(e.currentTarget.style.color="#2E2B40")}
                    >{label}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.04)", paddingTop:"1.5rem", textAlign:"center" }}>
            <p style={{ fontSize:".72rem", color:"#2E2B40", letterSpacing:".5px" }}>© {new Date().getFullYear()} EG Brand — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

