import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const STYLES = [
  { id: "modern",  ar: "عصري",   en: "Modern"   },
  { id: "luxury",  ar: "فاخر",   en: "Luxury"   },
  { id: "youth",   ar: "شبابي",  en: "Youthful" },
  { id: "minimal", ar: "بسيط",   en: "Minimal"  },
  { id: "arabic",  ar: "تراثي",  en: "Heritage" },
  { id: "tech",    ar: "تقني",   en: "Tech"     },
];

const COLORS = [
  { id: "gold",   ar: "ذهبي",   hex: "#C9973A" },
  { id: "navy",   ar: "كحلي",   hex: "#1B3A6B" },
  { id: "green",  ar: "أخضر",   hex: "#16A34A" },
  { id: "red",    ar: "أحمر",   hex: "#DC2626" },
  { id: "purple", ar: "بنفسجي", hex: "#7C3AED" },
  { id: "teal",   ar: "تيل",    hex: "#0D9488" },
  { id: "black",  ar: "أسود",   hex: "#1A1A1A" },
  { id: "coral",  ar: "مرجاني", hex: "#EA580C" },
];

const PHASES = [
  { key: "brand",   label: "بناء الهوية والاستراتيجية",  pct: 30 },
  { key: "logo",    label: "تصميم اللوجو SVG",            pct: 55 },
  { key: "social",  label: "توليد محتوى السوشيال",        pct: 78 },
  { key: "landing", label: "بناء الـ Landing Page",       pct: 95 },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "wizard" | "generating" | "result">("list");
  
  // Wizard States
  const [apiKey, setApiKey] = useState("");
  const [idea, setIdea] = useState("");
  const [bname, setBname] = useState("");
  const [style, setStyle] = useState("");
  const [cols, setCols] = useState<string[]>([]);
  const [err, setErr] = useState("");

  // Generation / Loading States
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);

  // Result States
  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState("identity");

  const navigate = useNavigate();
  const pollTimerRef = useRef<any>(null);
  const fakeProgressTimerRef = useRef<any>(null);

  // Verify Auth & Load Projects
  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) {
          navigate("/login");
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);

        // Fetch Projects
        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData.projects || []);
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (fakeProgressTimerRef.current) clearInterval(fakeProgressTimerRef.current);
    };
  }, [navigate]);

  const toggleColor = (id: string) => {
    setCols(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id].slice(0, 3));
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return setErr("الرجاء إدخال وصف فكرة مشروعك");
    if (!style) return setErr("الرجاء اختيار الأسلوب البصري");
    setErr("");
    
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-gemini-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          idea,
          customBrandName: bname,
          selectedStyle: style,
          selectedColors: cols,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "حدث خطأ أثناء إطلاق طلب التوليد");
        return;
      }

      setCurrentProjectId(data.projectId);
      setView("generating");
      setPhase(0);
      setPct(5);

      // Start Fake progress animation to feel responsive
      let currentPct = 5;
      fakeProgressTimerRef.current = setInterval(() => {
        currentPct += Math.floor(Math.random() * 3) + 1;
        if (currentPct > 95) currentPct = 95; // Wait at 95% for actual completion
        setPct(currentPct);

        // Set Phase index based on percentage threshold
        if (currentPct < 30) setPhase(0);
        else if (currentPct < 55) setPhase(1);
        else if (currentPct < 78) setPhase(2);
        else setPhase(3);
      }, 500);

      // Start status polling
      startPolling(data.projectId);
    } catch (e) {
      setErr("فشل الاتصال بالخادم، يرجى المحاولة لاحقاً");
    }
  };

  const startPolling = (projectId: string) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    
    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;

        const data = await res.json();
        const { status } = data.project;

        if (status === "completed") {
          // Stop timers
          clearInterval(pollTimerRef.current);
          clearInterval(fakeProgressTimerRef.current);
          setPct(100);
          setPhase(3);

          // Get Result
          setTimeout(async () => {
            const resultRes = await fetch(`/api/projects/${projectId}/result`);
            if (resultRes.ok) {
              const resultData = await resultRes.json();
              setResult(resultData.result);
              setView("result");
              setTab("identity");
              // Refresh projects list in background
              fetchProjectsList();
            } else {
              setErr("فشل تحميل نتائج البراند المولد");
              setView("wizard");
            }
          }, 800);
        } else if (status === "failed") {
          clearInterval(pollTimerRef.current);
          clearInterval(fakeProgressTimerRef.current);
          setErr("فشل الذكاء الاصطناعي في إتمام التوليد، يرجى إعادة المحاولة ووصف فكرتك بدقة أكبر.");
          setView("wizard");
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);
  };

  const fetchProjectsList = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResult = async (projId: string) => {
    setLoading(true);
    try {
      const resultRes = await fetch(`/api/projects/${projId}/result`);
      if (resultRes.ok) {
        const resultData = await resultRes.json();
        setResult(resultData.result);
        setView("result");
        setTab("identity");
      } else {
        alert("فشل تحميل هذا المشروع، ربما لم يكتمل توليده بعد");
      }
    } catch (e) {
      alert("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080F" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #C9973A33", borderTop: "3px solid #C9973A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", minHeight: "100vh", background: "#08080F", color: "#F0EDE6", paddingTop: 64 }}>
      {/* ── Navbar Spacer & Top Header ── */}
      <header style={{
        position: "fixed", top: 0, right: 0, left: 0, zIndex: 90,
        height: 64, background: "rgba(8,8,15,.92)", borderBottom: "1px solid #1E1E2E",
        backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem"
      }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: ".5rem" }}>
          <div className="mark-sm">ع</div>
          <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>ArabBrand <span style={{ color: "#C9973A" }}>Studio</span></span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: ".8rem", color: "#8A8498" }}>مرحباً، {user?.fullName} ({user?.credits} رصيد)</span>
          <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #1E1E2E", color: "#8A8498", padding: ".35rem .75rem", borderRadius: 8, fontSize: ".75rem", cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#F8717144"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#1E1E2E"}>تسجيل الخروج</button>
        </div>
      </header>

      {view === "list" && (
        <div className="page fade-up">
          <div className="wrap" style={{ maxWidth: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 800 }}>برانداتك الهوية</h1>
                <p style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}>إدارة واستعراض العلامات البصرية التي قمت بتوليدها</p>
              </div>
              <button className="gold-btn" style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }} onClick={() => { setView("wizard"); setErr(""); }}>
                ✦ براند جديد
              </button>
            </div>

            {projects.length === 0 ? (
              <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>لا توجد براندات مولدة بعد</h3>
                <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: "1.5rem" }}>ابدأ الآن بتوليد علامتك التجارية البصرية الأولى بالذكاء الاصطناعي</p>
                <button className="gold-btn" style={{ padding: ".75rem 1.75rem" }} onClick={() => setView("wizard")}>ابدأ بتوليد براندك</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {projects.map((proj) => (
                  <div key={proj._id} style={{
                    background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 16,
                    padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between",
                    transition: "all .2s", cursor: "default"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#C9973A44"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1E1E2E"}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
                        <span style={{
                          padding: ".2rem .5rem", borderRadius: 6, fontSize: ".65rem", fontWeight: 700,
                          background: proj.status === "completed" ? "#4ADE8015" : proj.status === "failed" ? "#F8717115" : "#C9973A15",
                          color: proj.status === "completed" ? "#4ADE80" : proj.status === "failed" ? "#F87171" : "#C9973A"
                        }}>
                          {proj.status === "completed" ? "مكتمل" : proj.status === "failed" ? "فشل" : "جاري التوليد"}
                        </span>
                        <span style={{ fontSize: ".65rem", color: "#3A3650" }}>{new Date(proj.createdAt).toLocaleDateString("ar-EG")}</span>
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "#F0EDE6" }}>{proj.projectTitle}</h3>
                      <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 38 }}>
                        {proj.idea}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: ".75rem", marginTop: "1rem" }}>
                      {proj.status === "completed" ? (
                        <button onClick={() => handleViewResult(proj._id)} style={{
                          width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent",
                          border: "1.5px solid #1E1E2E", color: "#C9973A", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", transition: "all .2s"
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#C9973A"; e.currentTarget.style.color = "#08080F"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9973A"; }}>
                          استعراض الهوية 🎨
                        </button>
                      ) : proj.status === "generating" ? (
                        <button onClick={() => { setView("generating"); setPct(40); setPhase(1); startPolling(proj._id); }} style={{
                          width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent",
                          border: "1.5px solid #1E1E2E", color: "#8A8498", fontSize: ".8rem", cursor: "pointer"
                        }}>
                          متابعة التوليد ⏳
                        </button>
                      ) : (
                        <button onClick={() => { setView("wizard"); setIdea(proj.idea); setBname(proj.customBrandName || ""); setStyle(proj.selectedStyle); }} style={{
                          width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent",
                          border: "1.5px solid #F8717133", color: "#F87171", fontSize: ".8rem", cursor: "pointer"
                        }}>
                          إعادة المحاولة 🔄
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "wizard" && (
        <div className="page fade-up">
          <div className="wrap">
            <div className="topbar">
              <button className="icon-btn" onClick={() => setView("list")}>←</button>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>توليد براند جديد بالذكاء الاصطناعي</h2>
              <div style={{ width: 36 }} />
            </div>

            {/* Optional API Key Override */}
            <div className="card" style={{ borderColor: "#4285F433" }}>
              <div className="clabel" style={{ color: "#4285F4" }}>
                🔑 مفتاح Gemini API Key الشخصي (اختياري)
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: "#C9973A", textDecoration: "none", marginRight: ".5rem", fontSize: ".72rem" }}>
                  احصل عليه مجاناً ←
                </a>
              </div>
              <input className="field" type="password" placeholder="اتركه فارغاً للاستخدام الافتراضي..." value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ fontFamily: "monospace", direction: "ltr", textAlign: "left" }} />
              <p style={{ fontSize: ".65rem", color: "#3A3650", marginTop: ".35rem" }}>🔒 يتم تشفير وإرسال المفتاح إلى Gemini فقط لتغطية التكلفة، أو اترك الحقل فارغاً لنستخدم مفتاح الخادم.</p>
            </div>

            {/* Idea */}
            <div className="card">
              <div className="clabel">فكرة مشروعك بالتفصيل *</div>
              <textarea className="field" rows={4} placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة والحلويات الشرقية التراثية بلمسة حديثة تستهدف فئة الشباب والموظفين..." value={idea} onChange={e => setIdea(e.target.value)} />
            </div>

            {/* Custom Name */}
            <div className="card">
              <div className="clabel">اسم البراند <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختياري)</span></div>
              <input className="field" placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة ونختار الأفضل" value={bname} onChange={e => setBname(e.target.value)} />
            </div>

            {/* Style */}
            <div className="card">
              <div className="clabel">الأسلوب البصري والشخصية *</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem" }}>
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={`style-btn ${style === s.id ? "on" : ""}`}>
                    <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{s.ar}</div>
                    <div style={{ fontSize: ".65rem", opacity: .6, marginTop: 2 }}>{s.en}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="card">
              <div className="clabel">الألوان المفضلة <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختر حتى 3 ألوان)</span></div>
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                {COLORS.map(c => (
                  <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <button onClick={() => toggleColor(c.id)} style={{
                      width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer",
                      border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent",
                      boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none",
                      transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem", transition: "all .15s"
                    }}>{cols.includes(c.id) ? "✓" : ""}</button>
                    <span style={{ fontSize: ".62rem", color: "#6B6478" }}>{c.ar}</span>
                  </div>
                ))}
              </div>
            </div>

            {err && <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>{err}</div>}

            <button className="gold-btn" style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }} onClick={handleGenerate}>
              ✦ ولّد Brand Kit كامل بـ Gemini AI
            </button>
          </div>
        </div>
      )}

      {view === "generating" && (
        <GenScreen phase={phase} pct={pct} />
      )}

      {view === "result" && result && (
        <ResultScreen result={result} tab={tab} setTab={setTab} onBack={() => { setView("list"); fetchProjectsList(); }} />
      )}
    </div>
  );
}

/* ── GENERATING LOADER SCREEN ── */
function GenScreen({ phase, pct }: { phase: number, pct: number }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", background: "#08080F" }}>
      <div style={{ position: "relative", width: 110, height: 110 }}>
        <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
          <circle cx="55" cy="55" r="48" fill="none" stroke="#1E1E2E" strokeWidth="4" />
          <circle cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#C9973A" }}>{pct}%</div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#C9973A", marginBottom: ".375rem" }}>{PHASES[phase]?.label}</p>
        <p style={{ fontSize: ".8rem", color: "#6B6478" }}>يقوم الذكاء الاصطناعي ببناء هويتك التجارية الآن...</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", width: "100%", maxWidth: 320 }}>
        {PHASES.map((p, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: ".75rem",
            padding: ".5rem .875rem", borderRadius: 9, fontSize: ".8rem",
            background: i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent",
            color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
            transition: "all .3s"
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
              background: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
              animation: i === phase ? "blink 1s ease-in-out infinite" : "none"
            }} />
            <span>{i < phase ? "✓ " : ""}{p.label}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
    </div>
  );
}

/* ── RESULT DASHBOARD SCREEN ── */
const TABS = [
  { id: "identity", label: "🎨 الهوية" },
  { id: "logo",     label: "🏷️ الشعار" },
  { id: "social",   label: "📱 السوشيال" },
  { id: "landing",  label: "🌐 صفحة الهبوط" },
  { id: "brochure", label: "📄 البروشور" },
];

function ResultScreen({ result, tab, setTab, onBack }: { result: any, tab: string, setTab: (t: string) => void, onBack: () => void }) {
  const { brand, logo, social, landing, displayName, primary, secondary } = result;

  return (
    <div className="page fade-up">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <div className="topbar">
          <button className="icon-btn" onClick={onBack}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <div className="mark-sm">ع</div>
            <span style={{ fontSize: ".9rem", fontWeight: 700 }}>ArabBrand Studio</span>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Hero Card */}
        <div style={{
          background: `linear-gradient(135deg, ${secondary || "#0E0E1A"} 0%, #17172B 100%)`,
          border: "1px solid #C9973A22", borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${primary || "#C9973A"}18, transparent 70%)`, pointerEvents: "none" }} />
          
          {brand?.names?.length > 0 && (
            <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.125rem" }}>
              {brand.names.map((n: string, i: number) => (
                <span key={i} style={{
                  padding: ".25rem .75rem", borderRadius: 20, fontSize: ".72rem",
                  border: n === brand.recommendedName ? `1px solid ${primary || "#C9973A"}` : "1px solid #C9973A33",
                  background: n === brand.recommendedName ? (primary || "#C9973A") : "transparent",
                  color: n === brand.recommendedName ? (secondary || "#08080F") : "#8A8498",
                  fontWeight: n === brand.recommendedName ? 700 : 400
                }}>{n}</span>
              ))}
            </div>
          )}

          <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#F0EDE6", marginBottom: ".375rem", letterSpacing: "-1px" }}>
            {displayName || brand?.recommendedName}
          </h1>
          <p style={{ fontSize: "1rem", color: primary || "#C9973A", fontWeight: 500, marginBottom: ".25rem" }}>{brand?.tagline?.ar}</p>
          <p style={{ fontSize: ".78rem", color: "#8A8498", fontStyle: "italic" }}>{brand?.tagline?.en}</p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1.5rem", scrollbarWidth: "none" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? (primary || "#C9973A") : "#1E1E2E"}`,
              background: tab === t.id ? (primary || "#C9973A") : "transparent",
              color: tab === t.id ? (secondary || "#08080F") : "#8A8498",
              fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500,
              cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* Dynamic Tab Views */}
        {tab === "identity" && <IdentityTab brand={brand} primary={primary || "#C9973A"} />}
        {tab === "logo"     && <LogoTab logo={logo} displayName={displayName || brand?.recommendedName || "Brand"} brand={brand} />}
        {tab === "social"   && <SocialTab social={social} displayName={displayName || brand?.recommendedName || "Brand"} />}
        {tab === "landing"  && <LandingTab landing={landing} displayName={displayName || brand?.recommendedName || "Brand"} primary={primary || "#C9973A"} secondary={secondary || "#0E0E1A"} />}
        {tab === "brochure" && <BrochureTab brand={brand} displayName={displayName || brand?.recommendedName || "Brand"} primary={primary || "#C9973A"} secondary={secondary || "#0E0E1A"} />}

        <button onClick={onBack} style={{
          width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E",
          color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}>
          ← العودة للبراندات
        </button>
      </div>
    </div>
  );
}

/* ── RESULT: IDENTITY TAB ── */
function IdentityTab({ brand, primary }: { brand: any, primary: string }) {
  const scores = [
    { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
    { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
    { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
    { l: "الملاءمة والمطابقة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
  ];

  return (
    <div className="fade-up">
      {/* Colors */}
      <div className="card">
        <div className="clabel">لوحة ألوان الهوية الموصى بها</div>
        <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", height: 60, marginBottom: "1rem" }}>
          {brand?.colors?.map((c: any, i: number) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: c.hex, padding: 4 }}>
              <span style={{ fontSize: "9px", color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)", fontWeight: 700 }}>{c.name}</span>
              <span style={{ fontSize: "8px", color: i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)", fontFamily: "monospace" }}>{c.hex}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {brand?.colors?.map((c: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: "1px solid rgba(255,255,255,.1)" }} />
              <span style={{ color: "#C4BDB5" }}>{c.name}</span>
              <span style={{ fontFamily: "monospace", color: "#8A8498" }}>{c.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scores */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div className="clabel" style={{ marginBottom: 0 }}>مؤشر قوة البراند والتأثير</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.75rem", fontWeight: 900, color: primary, lineHeight: 1, fontFamily: "Sora,sans-serif" }}>{brand?.score?.overall ?? 86}</div>
            <div style={{ fontSize: ".6rem", color: "#8A8498" }}>/100</div>
          </div>
        </div>
        {scores.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".65rem" }}>
            <span style={{ fontSize: ".77rem", color: "#8A8498", width: 180, textAlign: "right", flexShrink: 0 }}>{s.l}</span>
            <div style={{ flex: 1, height: 6, background: "#1E1E2E", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", background: `linear-gradient(90deg, ${primary}, ${primary}88)`, borderRadius: 3, width: `${s.v}%` }} />
            </div>
            <span style={{ fontSize: ".75rem", fontWeight: 700, color: primary, width: 24, textAlign: "left" }}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Strategy */}
      <div className="card">
        <div className="clabel">استراتيجية التموضع والجمهور</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
            <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>التموضع التسويقي (Positioning)</div>
            <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.positioning}</div>
          </div>
          <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
            <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>الجمهور المستهدف (Audience)</div>
            <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.audience}</div>
          </div>
        </div>
        <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
          <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>القيمة الفريدة المقترحة (Unique Value Proposition)</div>
          <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.value}</div>
        </div>
      </div>

      {/* Story */}
      <div className="card">
        <div className="clabel">قصة العلامة التجارية (Brand Story)</div>
        <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>{brand?.story?.ar}</p>
        <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>{brand?.story?.en}</p>
      </div>

      {/* Typography */}
      <div className="card">
        <div className="clabel">هوية الخطوط المقترحة (Typography)</div>
        <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #1E1E2E" }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: primary, marginBottom: ".25rem" }}>{brand?.typography?.display}</div>
          <div style={{ fontSize: "1.1rem", color: "rgba(240,237,230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>{brand?.typography?.arabic}</div>
          <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand?.typography?.style}</div>
        </div>
      </div>

      {/* Voice & Messages */}
      <div className="card">
        <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
        <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand?.voice?.tone}</span></p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.25rem" }}>
          {brand?.voice?.traits?.map((t: string, i: number) => (
            <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem", fontWeight: 600 }}>{t}</span>
          ))}
        </div>
        
        <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: "1rem" }}>
          <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#8A8498", marginBottom: ".5rem" }}>الرسائل التسويقية الأساسية:</p>
          {brand?.messages?.map((m: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".4rem 0" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: ".45rem", flexShrink: 0 }} />
              <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── RESULT: LOGO TAB ── */
function LogoTab({ logo, displayName, brand }: { logo: string, displayName: string, brand: any }) {
  const [copied, setCopied] = useState(false);
  const lightBg = brand?.colors?.[3]?.hex || "#F8F5F0";

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([logo], { type: "image/svg+xml" }));
    a.download = `${displayName}-logo.svg`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(logo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fade-up">
      <div className="card">
        <div className="clabel">الشعار على خلفية فاتحة</div>
        <div style={{ background: lightBg, borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyCenter: "center", minHeight: 240, justifyContent: "center" }}>
          <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
        </div>
        <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
          <button className="outline-btn" onClick={handleDownload}>⬇ تحميل SVG للوجو</button>
          <button className="outline-btn" onClick={handleCopy}>{copied ? "✓ تم النسخ" : "📋 نسخ كود SVG"}</button>
        </div>
      </div>

      <div className="card">
        <div className="clabel">الشعار على خلفية داكنة</div>
        <div style={{ background: "#08080F", border: "1px solid #1E1E2E", borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
          <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
        </div>
      </div>

      <div className="card">
        <div className="clabel">كود المصدر الرمزي (SVG Code)</div>
        <pre style={{
          background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#4ADE80",
          overflowX: "auto", lineHeight: 1.6, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all"
        }}>{logo}</pre>
      </div>
    </div>
  );
}

/* ── RESULT: SOCIAL TAB ── */
function SocialTab({ social, displayName }: { social: any, displayName: string }) {
  const [ptab, setPtab] = useState("ig");

  return (
    <div className="fade-up">
      <div className="card">
        <div className="clabel">منشورات وحملات جاهزة للنشر</div>
        <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem" }}>
          {[["ig", "Instagram"], ["tt", "TikTok"], ["tw", "Twitter/X"]].map(([k, l]) => (
            <button key={k} onClick={() => setPtab(k)} style={{
              padding: ".4rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E",
              background: ptab === k ? "#1E1E2E" : "transparent",
              color: ptab === k ? "#F0EDE6" : "#8A8498",
              fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer", transition: "all .2s"
            }}>{l}</button>
          ))}
        </div>

        {ptab === "ig" && (social?.instagram || []).map((p: any, i: number) => (
          <div key={i} style={{ background: "linear-gradient(180deg,#13131E,#0A0A14)", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem", marginBottom: ".75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".875rem" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
                display: "flex", alignItems: "center", justifyCenter: "center", fontSize: ".68rem", fontWeight: 700, color: "#fff", flexShrink: 0, justifyContent: "center"
              }}>{displayName.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
                <div style={{ fontSize: ".65rem", color: "#3A3650" }}>حساب رسمي</div>
              </div>
            </div>
            <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".625rem", whiteSpace: "pre-wrap" }}>{p.caption}</p>
            <p style={{ fontSize: ".78rem", color: "#60A5FA", lineHeight: 1.8, marginBottom: ".5rem" }}>{p.hashtags}</p>
            <span style={{ display: "inline-block", padding: ".18rem .55rem", borderRadius: 5, fontSize: ".65rem", background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)" }}>{p.theme}</span>
          </div>
        ))}

        {ptab === "tt" && (social?.tiktok || []).map((v: any, i: number) => (
          <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem", marginBottom: ".75rem", borderRight: "3px solid #69C9D0" }}>
            <p style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: 2, color: "#69C9D0", marginBottom: ".5rem" }}>فيديو تيك توك المقترح {i + 1}</p>
            <p style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>🎬 البداية المشوقة: {v.hook}</p>
            <p style={{ fontSize: ".82rem", color: "#8A8498", marginBottom: ".5rem" }}>💡 فكرة المحتوى: {v.idea}</p>
            <p style={{ fontSize: ".78rem", color: "#8A8498", background: "#08080F", borderRadius: 8, padding: ".625rem", lineHeight: 1.65 }}>
              📝 سكريبت الفيديو: <span style={{ color: "#C4BDB5" }}>{v.script}</span>
            </p>
          </div>
        ))}

        {ptab === "tw" && (social?.twitter || []).map((t: any, i: number) => (
          <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.125rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0" }}>
            <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.text}</p>
          </div>
        ))}
      </div>

      {social?.strategy && (
        <div className="card">
          <div className="clabel">خطة النشر المقترحة</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem", marginBottom: ".75rem" }}>
            <div style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
              <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>أفضل أوقات النشر</div>
              <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{social.strategy.bestTimes}</div>
            </div>
            <div style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
              <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>معدل التنزيل</div>
              <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{social.strategy.frequency}</div>
            </div>
          </div>
          <div>
            <p style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".5rem" }}>أعمدة المحتوى الأساسية:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
              {social.strategy.pillars?.map((p: string, i: number) => (
                <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)", fontSize: ".75rem" }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── RESULT: LANDING TAB ── */
function LandingTab({ landing, displayName, primary, secondary }: { landing: any, displayName: string, primary: string, secondary: string }) {
  const [view, setView] = useState("preview");

  const htmlCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${displayName}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Tajawal',sans-serif;direction:rtl;background:${secondary || "#08080F"};color:#F0EDE6}
nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:${secondary || "#08080F"}cc;backdrop-filter:blur(12px)}
.logo{font-size:1.25rem;font-weight:900;color:${primary || "#C9973A"}}.cta{padding:.5rem 1.25rem;border-radius:8px;background:${primary || "#C9973A"};color:${secondary || "#08080F"};font-weight:700;border:none;cursor:pointer;font-family:'Tajawal',sans-serif}
.hero{padding:5rem 2rem;text-align:center;max-width:680px;margin:0 auto}.hero h1{font-size:2.75rem;font-weight:900;margin-bottom:1rem;line-height:1.25;color:#ffffff}
.hero p{font-size:1.05rem;color:rgba(240,237,230,.65);margin-bottom:2rem;line-height:1.7}.btn{display:inline-block;padding:1rem 2.5rem;border-radius:12px;background:${primary || "#C9973A"};color:${secondary || "#08080F"};font-weight:700;font-size:1rem;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;text-decoration:none}
.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;padding:3rem 2rem;max-width:860px;margin:0 auto}
.feat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:1.5rem}.icon{font-size:2rem;margin-bottom:.75rem}.feat h3{font-size:1rem;font-weight:700;color:${primary || "#C9973A"};margin-bottom:.5rem}.feat p{font-size:.875rem;color:rgba(240,237,230,.6);line-height:1.65}
.quote-sec{padding:3rem 2rem;text-align:center;border-top:1px solid rgba(255,255,255,.08)}.quote{font-size:1.1rem;font-style:italic;max-width:520px;margin:0 auto 1rem;color:rgba(240,237,230,.8);line-height:1.75}.author{font-size:.8rem;color:rgba(240,237,230,.4)}
.cta-sec{padding:4rem 2rem;text-align:center;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.08)}.cta-sec h2{font-size:2rem;font-weight:900;margin-bottom:.75rem;color:#ffffff}.cta-sec p{color:rgba(240,237,230,.6);margin-bottom:1.75rem}
footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.08);text-align:center;font-size:.8rem;color:rgba(240,237,230,.3)}
</style></head><body>
<nav><div class="logo">${displayName}</div><button class="cta">${landing?.hero?.cta || "اتصل بنا"}</button></nav>
<div class="hero"><h1>${landing?.hero?.headline || ""}</h1><p>${landing?.hero?.subheadline || ""}</p><button class="btn">${landing?.hero?.cta || "ابدأ الاستكشاف"}</button></div>
<div class="feats">${(landing?.features || []).map((f: any) => `<div class="feat"><div class="icon">${f.emoji}</div><h3>${f.title}</h3><p>${f.desc}</p></div>`).join("")}</div>
<div class="quote-sec"><p class="quote">"${landing?.testimonial?.text || ""}"</p><div class="author">${landing?.testimonial?.name || ""} — ${landing?.testimonial?.role || ""}</div></div>
<div class="cta-sec"><h2>${landing?.cta?.headline || ""}</h2><p>${landing?.cta?.subheadline || ""}</p><button class="btn">${landing?.cta?.button || "اشترك الآن"}</button></div>
<footer>© ${new Date().getFullYear()} ${displayName}</footer>
</body></html>`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([htmlCode], { type: "text/html" }));
    a.download = `${displayName}-landing.html`;
    a.click();
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem", alignItems: "center" }}>
        {[["preview", "👁 معاينة الصفحة"], ["code", "{ } الكود المصدري"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E",
            background: view === k ? "#1E1E2E" : "transparent",
            color: view === k ? "#F0EDE6" : "#8A8498",
            fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer"
          }}>{l}</button>
        ))}
        <button className="gold-btn" style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={handleDownload}>⬇ تحميل كود HTML</button>
      </div>

      {view === "preview" ? (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", justifyBetween: "space-between", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>{displayName.toLowerCase().replace(/\s+/g, "-")}.html</span>
            <div style={{ width: 40 }} />
          </div>
          <iframe title="Landing Page Preview" srcDoc={htmlCode} style={{ width: "100%", height: "550px", border: "none", background: secondary || "#08080F" }} />
        </div>
      ) : (
        <div className="card">
          <pre style={{
            background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80",
            overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all"
          }}>{htmlCode}</pre>
        </div>
      )}
    </div>
  );
}

/* ── RESULT: BROCHURE TAB ── */
function BrochureTab({ brand, displayName, primary, secondary }: { brand: any, displayName: string, primary: string, secondary: string }) {
  const htmlBrochure = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${displayName} — بروشور الشركة</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Sora:wght@400;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Tajawal',sans-serif;direction:rtl;background:#ffffff;color:#1A1A28;padding:2rem;max-width:800px;margin:0 auto}
.head{background:${secondary || "#08080F"};padding:3rem 2.5rem;text-align:center;position:relative;overflow:hidden;border-radius:14px 14px 0 0;color:#F0EDE6}
.pat{position:absolute;inset:0;background-image:radial-gradient(circle,${primary || "#C9973A"}22 1px,transparent 1px);background-size:24px 24px}
.rel{position:relative}.bname{font-family:'Sora',sans-serif;font-size:3.5rem;font-weight:900;color:${primary || "#C9973A"};margin-bottom:.5rem}
.btag{font-size:1.2rem;color:rgba(240,237,230,.75);font-weight:300}
.body{background:#F8F8FC;padding:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;border-left:1px solid #e5e5ed;border-right:1px solid #e5e5ed}
.sec{padding:1.25rem;border-right:4px solid ${primary || "#C9973A"};background:#ffffff;border-radius:0 12px 12px 0;box-shadow:0 4px 6px rgba(0,0,0,0.02)}
.sl{font-size:.72rem;font-weight:900;letter-spacing:1px;color:${primary || "#C9973A"};margin-bottom:.5rem;text-transform:uppercase}
.sb{font-size:.85rem;color:#4A4A5A;line-height:1.7}
.cstrip{display:flex;height:12px}.csw{flex:1}
.foot{background:${secondary || "#08080F"};padding:1.25rem 2.5rem;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:rgba(240,237,230,.35);border-radius:0 0 14px 14px}
.dots{display:flex;gap:6px}.dot{width:12px;height:12px;border-radius:50%}
</style></head><body>
<div class="head"><div class="pat"></div><div class="rel"><div class="bname">${displayName}</div><div class="btag">${brand?.tagline?.ar || ""}</div><div style="font-size:.8rem;color:rgba(240,237,230,.3);font-style:italic;margin-top:.25rem">${brand?.tagline?.en || ""}</div></div></div>
<div class="body">
  <div class="sec"><div class="sl">قصة العلامة التجارية</div><div class="sb">${brand?.story?.ar || ""}</div></div>
  <div class="sec"><div class="sl">الجمهور المستهدف</div><div class="sb">${brand?.strategy?.audience || ""}</div></div>
  <div class="sec"><div class="sl">القيمة المقترحة الفريدة</div><div class="sb">${brand?.strategy?.value || ""}</div></div>
  <div class="sec"><div class="sl">صوت ورسالة البراند</div><div class="sb">${brand?.messages?.[0] || ""}</div></div>
</div>
<div class="cstrip">${(brand?.colors || []).map((c: any) => `<div class="csw" style="background:${c.hex}"></div>`).join("")}</div>
<div class="foot"><span>${displayName}</span><div class="dots">${(brand?.colors || []).map((c: any) => `<div class="dot" style="background:${c.hex}"></div>`).join("")}</div><span>Brand Kit Brochure</span></div>
</body></html>`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([htmlBrochure], { type: "text/html" }));
    a.download = `${displayName}-brochure.html`;
    a.click();
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تنزيل بروشور HTML للطباعة</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", justifyBetween: "space-between", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#FF5F56", "#FFBD2E", "#27C93F"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>brochure-preview.html</span>
          <div style={{ width: 40 }} />
        </div>
        <iframe title="Brochure Preview" srcDoc={htmlBrochure} style={{ width: "100%", height: "550px", border: "none", background: "#ffffff" }} />
      </div>
    </div>
  );
}
