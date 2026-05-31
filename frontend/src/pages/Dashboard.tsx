// import { useNavigate, Link } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";

// const STYLES = [
//   { id: "modern", ar: "عصري", en: "Modern" },
//   { id: "luxury", ar: "فاخر", en: "Luxury" },
//   { id: "youth", ar: "شبابي", en: "Youthful" },
//   { id: "minimal", ar: "بسيط", en: "Minimal" },
//   { id: "arabic", ar: "تراثي", en: "Heritage" },
//   { id: "tech", ar: "تقني", en: "Tech" },
// ];

// const COLORS = [
//   { id: "gold", ar: "ذهبي", hex: "#C9973A" },
//   { id: "navy", ar: "كحلي", hex: "#1B3A6B" },
//   { id: "green", ar: "أخضر", hex: "#16A34A" },
//   { id: "red", ar: "أحمر", hex: "#DC2626" },
//   { id: "purple", ar: "بنفسجي", hex: "#7C3AED" },
//   { id: "teal", ar: "تيل", hex: "#0D9488" },
//   { id: "black", ar: "أسود", hex: "#1A1A1A" },
//   { id: "coral", ar: "مرجاني", hex: "#EA580C" },
// ];

// const PHASES = [
//   { key: "brand", label: "بناء الهوية والاستراتيجية", pct: 25 },
//   { key: "logo", label: "تصميم الشعار SVG", pct: 45 },
//   { key: "social", label: "توليد محتوى السوشيال", pct: 65 },
//   { key: "landing", label: "بناء الـ Landing Page", pct: 80 },
//   { key: "competitors", label: "تحليل المنافسين والسوق", pct: 95 },
// ];

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<"list" | "wizard" | "generating" | "result">("list");

//   const [idea, setIdea] = useState("");
//   const [bname, setBname] = useState("");
//   const [style, setStyle] = useState("");
//   const [cols, setCols] = useState<string[]>([]);
//   const [err, setErr] = useState("");

//   const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
//   const [phase, setPhase] = useState(0);
//   const [pct, setPct] = useState(0);

//   const [result, setResult] = useState<any>(null);
//   const [tab, setTab] = useState("identity");

//   const navigate = useNavigate();
//   const pollTimerRef = useRef<any>(null);
//   const fakeProgressTimerRef = useRef<any>(null);

//   const safeSetResult = (data: any) => {
//     console.log("RESULT API RESPONSE:", JSON.stringify(data, null, 2));
//     if (!data) return false;
//     const extracted = data?.result ?? data?.data ?? data;
//     console.log("RESULT EXTRACTED keys:", Object.keys(extracted || {}));
//     setResult(extracted);
//     return true;
//   };

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const userRes = await fetch("/api/auth/me");
//         if (!userRes.ok) { navigate("/login"); return; }
//         const userData = await userRes.json();
//         setUser(userData.user);
//         const projRes = await fetch("/api/projects");
//         if (projRes.ok) {
//           const projData = await projRes.json();
//           setProjects(projData.projects || []);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//     return () => { stopAllTimers(); };
//   }, [navigate]);

//   const stopAllTimers = () => {
//     if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
//     if (fakeProgressTimerRef.current) { clearInterval(fakeProgressTimerRef.current); fakeProgressTimerRef.current = null; }
//   };

//   const toggleColor = (id: string) =>
//     setCols((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id].slice(0, 3));

//   const handleGenerate = async () => {
//     if (!idea.trim()) return setErr("الرجاء إدخال وصف فكرة مشروعك");
//     if (!style) return setErr("الرجاء اختيار الأسلوب البصري");
//     setErr("");

//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idea,
//           customBrandName: bname,
//           selectedStyle: style,
//           selectedColors: cols,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setErr(data.message || "حدث خطأ أثناء إطلاق طلب التوليد"); return; }

//       setCurrentProjectId(data.projectId);
//       setView("generating");
//       setPhase(0);
//       setPct(5);

//       let currentPct = 5;
//       fakeProgressTimerRef.current = setInterval(() => {
//         currentPct += Math.floor(Math.random() * 3) + 1;
//         if (currentPct > 90) currentPct = 90;
//         setPct(currentPct);
//         if (currentPct < 25) setPhase(0);
//         else if (currentPct < 45) setPhase(1);
//         else if (currentPct < 65) setPhase(2);
//         else if (currentPct < 80) setPhase(3);
//         else setPhase(4);
//       }, 500);

//       startPolling(data.projectId);
//     } catch (e) {
//       setErr("فشل الاتصال بالخادم، يرجى المحاولة لاحقاً");
//     }
//   };

//   const startPolling = (projectId: string) => {
//     if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//     pollTimerRef.current = setInterval(async () => {
//       try {
//         const res = await fetch(`/api/projects/${projectId}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const { status } = data.project;

//         if (status === "completed") {
//           stopAllTimers();
//           setPct(100);
//           setPhase(4);
//           setTimeout(async () => {
//             try {
//               const resultRes = await fetch(`/api/projects/${projectId}/result`);
//               if (!resultRes.ok) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); return; }
//               const resultData = await resultRes.json();
//               const success = safeSetResult(resultData);
//               if (success) { setView("result"); setTab("identity"); fetchProjectsList(); }
//               else { setErr("البيانات المستلمة غير مكتملة"); setView("wizard"); }
//             } catch (e) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); }
//           }, 1000);
//         } else if (status === "failed") {
//           stopAllTimers();
//           setErr("فشل الذكاء الاصطناعي، يرجى إعادة المحاولة بوصف أكثر تفصيلاً.");
//           setView("wizard");
//         }
//       } catch (e) { console.error("Polling error:", e); }
//     }, 2000);
//   };

//   const fetchProjectsList = async () => {
//     try {
//       const res = await fetch("/api/projects");
//       if (res.ok) { const data = await res.json(); setProjects(data.projects || []); }
//     } catch (e) { console.error(e); }
//   };

//   const handleViewResult = async (projId: string) => {
//     setLoading(true);
//     try {
//       const resultRes = await fetch(`/api/projects/${projId}/result`);
//       if (!resultRes.ok) { alert("فشل تحميل هذا المشروع"); return; }
//       const resultData = await resultRes.json();
//       const success = safeSetResult(resultData);
//       if (success) { setView("result"); setTab("identity"); }
//       else alert("بيانات المشروع غير مكتملة");
//     } catch (e) { alert("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   const handleLogout = async () => {
//     try { await fetch("/api/auth/logout", { method: "POST" }); navigate("/login"); }
//     catch (e) { console.error(e); }
//   };

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080F" }}>
//       <div style={{ width: 40, height: 40, border: "3px solid #C9973A33", borderTop: "3px solid #C9973A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", minHeight: "100vh", background: "#08080F", color: "#F0EDE6", paddingTop: 64 }}>
//       {/* Navbar */}
//       <header style={{ position: "fixed", top: 0, right: 0, left: 0, zIndex: 90, height: 64, background: "rgba(8,8,15,.92)", borderBottom: "1px solid #1E1E2E", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem" }}>
//         <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: ".5rem" }}>
//           <div className="mark-sm">ع</div>
//           <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>ArabBrand <span style={{ color: "#C9973A" }}>Studio</span></span>
//         </Link>
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <span style={{ fontSize: ".8rem", color: "#8A8498" }}>مرحباً، {user?.fullName} ({user?.credits} رصيد)</span>
//           <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #1E1E2E", color: "#8A8498", padding: ".35rem .75rem", borderRadius: 8, fontSize: ".75rem", cursor: "pointer" }}
//             onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#F8717144")}
//             onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}>
//             تسجيل الخروج
//           </button>
//         </div>
//       </header>

//       {/* LIST VIEW */}
//       {view === "list" && (
//         <div className="page fade-up">
//           <div className="wrap" style={{ maxWidth: 800 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
//               <div>
//                 <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 800 }}>براندات الهوية</h1>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}>إدارة واستعراض العلامات البصرية المولدة</p>
//               </div>
//               <button className="gold-btn" style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }} onClick={() => { setView("wizard"); setErr(""); }}>
//                 ✦ براند جديد
//               </button>
//             </div>

//             {projects.length === 0 ? (
//               <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
//                 <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
//                 <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>لا توجد براندات مولدة بعد</h3>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: "1.5rem" }}>ابدأ الآن بتوليد علامتك التجارية الأولى بالذكاء الاصطناعي</p>
//                 <button className="gold-btn" style={{ padding: ".75rem 1.75rem" }} onClick={() => setView("wizard")}>ابدأ بتوليد براندك</button>
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
//                 {projects.map((proj) => (
//                   <div key={proj._id} style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 16, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all .2s" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9973A44")}
//                     onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}>
//                     <div>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
//                         <span style={{ padding: ".2rem .5rem", borderRadius: 6, fontSize: ".65rem", fontWeight: 700, background: proj.status === "completed" ? "#4ADE8015" : proj.status === "failed" ? "#F8717115" : "#C9973A15", color: proj.status === "completed" ? "#4ADE80" : proj.status === "failed" ? "#F87171" : "#C9973A" }}>
//                           {proj.status === "completed" ? "مكتمل" : proj.status === "failed" ? "فشل" : "جاري التوليد"}
//                         </span>
//                         <span style={{ fontSize: ".65rem", color: "#3A3650" }}>{new Date(proj.createdAt).toLocaleDateString("ar-EG")}</span>
//                       </div>
//                       <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "#F0EDE6" }}>{proj.projectTitle}</h3>
//                       <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 38 }}>{proj.idea}</p>
//                     </div>
//                     <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: ".75rem", marginTop: "1rem" }}>
//                       {proj.status === "completed" ? (
//                         <button onClick={() => handleViewResult(proj._id)} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#C9973A", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", transition: "all .2s" }}
//                           onMouseEnter={(e) => { e.currentTarget.style.background = "#C9973A"; e.currentTarget.style.color = "#08080F"; }}
//                           onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9973A"; }}>
//                           استعراض الهوية 🎨
//                         </button>
//                       ) : proj.status === "generating" ? (
//                         <button onClick={() => { setView("generating"); setPct(40); setPhase(1); startPolling(proj._id); }} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontSize: ".8rem", cursor: "pointer" }}>
//                           متابعة التوليد ⏳
//                         </button>
//                       ) : (
//                         <button onClick={() => { setView("wizard"); setIdea(proj.idea); setBname(proj.customBrandName || ""); setStyle(proj.selectedStyle); }} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #F8717133", color: "#F87171", fontSize: ".8rem", cursor: "pointer" }}>
//                           إعادة المحاولة 🔄
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* WIZARD VIEW */}
//       {view === "wizard" && (
//         <div className="page fade-up">
//           <div className="wrap">
//             <div className="topbar">
//               <button className="icon-btn" onClick={() => setView("list")}>←</button>
//               <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>توليد براند جديد بالذكاء الاصطناعي</h2>
//               <div style={{ width: 36 }} />
//             </div>

//             <div className="card">
//               <div className="clabel">فكرة مشروعك بالتفصيل *</div>
//               <textarea className="field" rows={4} placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة للشباب في الرياض..." value={idea} onChange={(e) => setIdea(e.target.value)} />
//               <p style={{ fontSize: ".7rem", color: "#3A3650", marginTop: ".35rem" }}>💡 كلما كان الوصف أكثر تفصيلاً، كانت نتائج البراند أكثر دقة وتميزاً</p>
//             </div>

//             <div className="card">
//               <div className="clabel">اسم البراند <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختياري)</span></div>
//               <input className="field" placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة مع شرح كل اسم" value={bname} onChange={(e) => setBname(e.target.value)} />
//               {!bname && (
//                 <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".5rem .75rem", marginTop: ".5rem", fontSize: ".72rem", color: "#C9973A" }}>
//                   ✦ سيقترح الذكاء الاصطناعي 3 أسماء مدروسة مع معنى كل اسم وسبب اختياره
//                 </div>
//               )}
//             </div>

//             <div className="card">
//               <div className="clabel">الأسلوب البصري والشخصية *</div>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem" }}>
//                 {STYLES.map((s) => (
//                   <button key={s.id} onClick={() => setStyle(s.id)} className={`style-btn ${style === s.id ? "on" : ""}`}>
//                     <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{s.ar}</div>
//                     <div style={{ fontSize: ".65rem", opacity: 0.6, marginTop: 2 }}>{s.en}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="card">
//               <div className="clabel">الألوان المفضلة <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختر حتى 3 ألوان)</span></div>
//               <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
//                 {COLORS.map((c) => (
//                   <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
//                     <button onClick={() => toggleColor(c.id)} style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer", border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent", boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none", transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem", transition: "all .15s" }}>
//                       {cols.includes(c.id) ? "✓" : ""}
//                     </button>
//                     <span style={{ fontSize: ".62rem", color: "#6B6478" }}>{c.ar}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {err && (
//               <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
//                 {err}
//               </div>
//             )}

//             <button className="gold-btn" style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }} onClick={handleGenerate}>
//               ✦ ولّد Brand Kit كامل مع تحليل المنافسين
//             </button>
//           </div>
//         </div>
//       )}

//       {view === "generating" && <GenScreen phase={phase} pct={pct} />}

//       {view === "result" && result && (
//         <ResultScreen result={result} tab={tab} setTab={setTab} onBack={() => { setView("list"); fetchProjectsList(); }} />
//       )}

//       {view === "result" && !result && (
//         <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
//           <p style={{ color: "#F87171", fontSize: "1rem" }}>⚠️ فشل تحميل البيانات</p>
//           <button className="gold-btn" onClick={() => setView("list")}>العودة للقائمة</button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── GENERATING SCREEN ── */
// function GenScreen({ phase, pct }: { phase: number; pct: number }) {
//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", background: "#08080F" }}>
//       <div style={{ position: "relative", width: 110, height: 110 }}>
//         <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
//           <circle cx="55" cy="55" r="48" fill="none" stroke="#1E1E2E" strokeWidth="4" />
//           <circle cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4" strokeLinecap="round"
//             strokeDasharray={`${2 * Math.PI * 48}`}
//             strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
//             style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
//         </svg>
//         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#C9973A" }}>{pct}%</div>
//       </div>

//       <div style={{ textAlign: "center" }}>
//         <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#C9973A", marginBottom: ".375rem" }}>{PHASES[phase]?.label}</p>
//         <p style={{ fontSize: ".8rem", color: "#6B6478" }}>الذكاء الاصطناعي يبني هويتك التجارية الآن...</p>
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", width: "100%", maxWidth: 340 }}>
//         {PHASES.map((p, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .875rem", borderRadius: 9, fontSize: ".8rem", background: i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent", color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", transition: "all .3s" }}>
//             <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", animation: i === phase ? "blink 1s ease-in-out infinite" : "none" }} />
//             <span>{i < phase ? "✓ " : ""}{p.label}</span>
//           </div>
//         ))}
//       </div>
//       <style>{`@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
//     </div>
//   );
// }

// /* ── RESULT SCREEN ── */
// const TABS = [
//   { id: "identity", label: "🎨 الهوية" },
//   { id: "logo", label: "🏷️ الشعار" },
//   { id: "social", label: "📱 السوشيال" },
//   { id: "landing", label: "🌐 صفحة الهبوط" },
//   { id: "brochure", label: "📄 البروشور" },
//   { id: "competitors", label: "🔍 المنافسون" },
// ];

// function ResultScreen({ result, tab, setTab, onBack }: { result: any; tab: string; setTab: (t: string) => void; onBack: () => void }) {
//   const brand = result?.brandIdentity ?? {};
//   const logoRaw = result?.logo ?? {};
//   const logoStr = typeof logoRaw === "string" ? logoRaw : (logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "");
//   // sanitize the SVG
//   const logo = sanitizeSVGClient(logoStr);
//   const social = result?.socialMedia ?? {};
//   const landing = result?.landingPage ?? {};
//   const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
//   const competitors = result?.competitors ?? {};

//   // دعم صيغة الأسماء الجديدة (objects) والقديمة (strings)
//   const namesRaw: any[] = brand?.names ?? [];
//   const nameObjects: { name: string; reason?: string; meaning?: string }[] = namesRaw.map((n: any) =>
//     typeof n === "string" ? { name: n } : n
//   );

//   const displayName =
//     result?.displayName ??
//     brand?.recommendedName ??
//     brand?.name ??
//     nameObjects[0]?.name ??
//     "Brand";

//   const primary = brand?.primaryColor ?? brand?.colors?.[0]?.hex ?? "#C9973A";
//   const secondary = brand?.secondaryColor ?? brand?.colors?.[1]?.hex ?? "#0E0E1A";

//   return (
//     <div className="page fade-up">
//       <div className="wrap" style={{ maxWidth: 800 }}>
//         <div className="topbar">
//           <button className="icon-btn" onClick={onBack}>←</button>
//           <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//             <div className="mark-sm">ع</div>
//             <span style={{ fontSize: ".9rem", fontWeight: 700 }}>ArabBrand Studio</span>
//           </div>
//           <div style={{ width: 36 }} />
//         </div>

//         {/* Hero Card */}
//         <div style={{ background: `linear-gradient(135deg, ${secondary} 0%, #17172B 100%)`, border: "1px solid #C9973A22", borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${primary}18, transparent 70%)`, pointerEvents: "none" }} />

//           {/* اقتراحات الأسماء */}
//           {nameObjects.length > 0 && (
//             <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.125rem" }}>
//               {nameObjects.map((n, i) => (
//                 <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                   <span style={{ padding: ".25rem .75rem", borderRadius: 20, fontSize: ".72rem", border: n.name === brand.recommendedName ? `1px solid ${primary}` : "1px solid #C9973A33", background: n.name === brand.recommendedName ? primary : "transparent", color: n.name === brand.recommendedName ? secondary : "#8A8498", fontWeight: n.name === brand.recommendedName ? 700 : 400 }}>
//                     {n.name}
//                     {n.name === brand.recommendedName && " ✦"}
//                   </span>
//                   {n.meaning && (
//                     <span style={{ fontSize: ".58rem", color: "#3A3650", marginTop: 2 }}>{n.meaning}</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#F0EDE6", marginBottom: ".375rem", letterSpacing: "-1px" }}>{displayName}</h1>
//           <p style={{ fontSize: "1rem", color: primary, fontWeight: 500, marginBottom: ".25rem" }}>{brand?.tagline?.ar ?? brand?.tagline ?? ""}</p>
//           <p style={{ fontSize: ".78rem", color: "#8A8498", fontStyle: "italic" }}>{brand?.tagline?.en ?? ""}</p>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1.5rem", scrollbarWidth: "none" }}>
//           {TABS.map((t) => (
//             <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`, background: tab === t.id ? primary : "transparent", color: tab === t.id ? secondary : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === "identity" && <IdentityTab brand={brand} primary={primary} nameObjects={nameObjects} />}
//         {tab === "logo" && <LogoTab logo={logo} displayName={displayName} brand={brand} />}
//         {tab === "social" && <SocialTab social={social} displayName={displayName} />}
//         {tab === "landing" && <LandingTab landing={landing} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "brochure" && <BrochureTab brand={brand} brochureContent={brochureContent} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "competitors" && <CompetitorsTab competitors={competitors} primary={primary} />}

//         <button onClick={onBack} style={{ width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s" }}
//           onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}>
//           ← العودة للبراندات
//         </button>
//       </div>
//     </div>
//   );
// }

// // sanitize SVG على جانب العميل
// function sanitizeSVGClient(raw: string): string {
//   if (!raw || !raw.includes("<svg")) return "";
//   let svg = raw.trim();
//   if (!svg.includes("xmlns")) svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
//   if (!svg.includes("viewBox")) svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
//   return svg;
// }

// /* ── IDENTITY TAB ── */
// function IdentityTab({ brand, primary, nameObjects }: { brand: any; primary: string; nameObjects: any[] }) {
//   const scores = [
//     { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
//     { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
//     { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
//     { l: "الملاءمة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
//   ];

//   return (
//     <div className="fade-up">
//       {/* Name suggestions with reasons */}
//       {nameObjects.length > 0 && nameObjects.some((n) => n.reason) && (
//         <div className="card">
//           <div className="clabel">مقترحات الأسماء المدروسة</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {nameObjects.map((n, i) => (
//               <div key={i} style={{ background: n.name === brand.recommendedName ? `${primary}0D` : "#0A0A14", border: `1px solid ${n.name === brand.recommendedName ? primary + "44" : "#1E1E2E"}`, borderRadius: 12, padding: "1rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".375rem" }}>
//                   <span style={{ fontSize: "1rem", fontWeight: 700, color: n.name === brand.recommendedName ? primary : "#F0EDE6" }}>{n.name}</span>
//                   {n.name === brand.recommendedName && (
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: primary, color: "#08080F", fontWeight: 700 }}>موصى به</span>
//                   )}
//                   {n.meaning && <span style={{ fontSize: ".72rem", color: "#8A8498" }}>— {n.meaning}</span>}
//                 </div>
//                 {n.reason && <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.6, margin: 0 }}>{n.reason}</p>}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Colors */}
//       <div className="card">
//         <div className="clabel">لوحة ألوان الهوية الموصى بها</div>
//         {brand?.colors?.length > 0 ? (
//           <>
//             <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", height: 60, marginBottom: "1rem" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: c.hex, padding: 4 }}>
//                   <span style={{ fontSize: "9px", color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)", fontWeight: 700 }}>{c.name}</span>
//                   <span style={{ fontSize: "8px", color: i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)", fontFamily: "monospace" }}>{c.hex}</span>
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div key={i} style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem" }}>
//                   <div style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: "1px solid rgba(255,255,255,.1)" }} />
//                   <span style={{ color: "#C4BDB5" }}>{c.name}</span>
//                   <span style={{ fontFamily: "monospace", color: "#8A8498" }}>{c.hex}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد لوحة الألوان</p>}
//       </div>

//       {/* Scores */}
//       <div className="card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
//           <div className="clabel" style={{ marginBottom: 0 }}>مؤشر قوة البراند</div>
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: "2.75rem", fontWeight: 900, color: primary, lineHeight: 1, fontFamily: "Sora,sans-serif" }}>{brand?.score?.overall ?? 86}</div>
//             <div style={{ fontSize: ".6rem", color: "#8A8498" }}>/100</div>
//           </div>
//         </div>
//         {scores.map((s, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".65rem" }}>
//             <span style={{ fontSize: ".77rem", color: "#8A8498", width: 180, textAlign: "right", flexShrink: 0 }}>{s.l}</span>
//             <div style={{ flex: 1, height: 6, background: "#1E1E2E", borderRadius: 3, overflow: "hidden" }}>
//               <div style={{ height: "100%", background: `linear-gradient(90deg, ${primary}, ${primary}88)`, borderRadius: 3, width: `${s.v}%` }} />
//             </div>
//             <span style={{ fontSize: ".75rem", fontWeight: 700, color: primary, width: 24, textAlign: "left" }}>{s.v}</span>
//           </div>
//         ))}
//       </div>

//       {/* Strategy */}
//       <div className="card">
//         <div className="clabel">استراتيجية التموضع والجمهور</div>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//           {[["التموضع التسويقي", brand?.strategy?.positioning], ["الجمهور المستهدف", brand?.strategy?.audience]].map(([label, val]) => (
//             <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
//               <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>{label}</div>
//               <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{val ?? "—"}</div>
//             </div>
//           ))}
//         </div>
//         <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
//           <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>القيمة الفريدة المقترحة</div>
//           <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.value ?? "—"}</div>
//         </div>
//       </div>

//       {/* Story */}
//       <div className="card">
//         <div className="clabel">قصة العلامة التجارية</div>
//         <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>{brand?.story?.ar ?? brand?.story ?? "—"}</p>
//         {brand?.story?.en && <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>{brand.story.en}</p>}
//       </div>

//       {/* Typography */}
//       {brand?.typography && (
//         <div className="card">
//           <div className="clabel">هوية الخطوط المقترحة</div>
//           <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #1E1E2E" }}>
//             <div style={{ fontFamily: "Sora,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: primary, marginBottom: ".25rem" }}>{brand.typography.display}</div>
//             <div style={{ fontSize: "1.1rem", color: "rgba(240,237,230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>{brand.typography.arabic}</div>
//             <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand.typography.style}</div>
//           </div>
//         </div>
//       )}

//       {/* Voice & Messages */}
//       {(brand?.voice || brand?.messages) && (
//         <div className="card">
//           <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
//           {brand?.voice?.tone && <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span></p>}
//           {brand?.voice?.traits?.length > 0 && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.25rem" }}>
//               {brand.voice.traits.map((t: string, i: number) => (
//                 <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem", fontWeight: 600 }}>{t}</span>
//               ))}
//             </div>
//           )}
//           {brand?.messages?.length > 0 && (
//             <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: "1rem" }}>
//               <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#8A8498", marginBottom: ".5rem" }}>الرسائل التسويقية:</p>
//               {brand.messages.map((m: string, i: number) => (
//                 <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".4rem 0" }}>
//                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: ".45rem", flexShrink: 0 }} />
//                   <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{m}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── LOGO TAB ── */
// function LogoTab({ logo, displayName, brand }: { logo: string; displayName: string; brand: any }) {
//   const [copied, setCopied] = useState(false);
//   const lightBg = brand?.colors?.[3]?.hex || "#F8F5F0";

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([logo], { type: "image/svg+xml" }));
//     a.download = `${displayName}-logo.svg`;
//     a.click();
//   };

//   const handleCopy = () => {
//     navigator.clipboard?.writeText(logo);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!logo) return (
//     <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//       <p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار، جاري استخدام الشعار الاحتياطي</p>
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       <div className="card">
//         <div className="clabel">الشعار على خلفية فاتحة</div>
//         <div style={{ background: lightBg, borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
//           <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
//         </div>
//         <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
//           <button className="outline-btn" onClick={handleDownload}>⬇ تحميل SVG</button>
//           <button className="outline-btn" onClick={handleCopy}>{copied ? "✓ تم النسخ" : "📋 نسخ كود SVG"}</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">الشعار على خلفية داكنة</div>
//         <div style={{ background: "#08080F", border: "1px solid #1E1E2E", borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
//           <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">كود SVG المصدري</div>
//         <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.6, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//           {logo}
//         </pre>
//       </div>
//     </div>
//   );
// }

// /* ── SOCIAL TAB ── */
// function SocialTab({ social, displayName }: { social: any; displayName: string }) {
//   const [ptab, setPtab] = useState("ig");

//   const igPosts = social?.instagram ?? social?.posts ?? [];
//   const ttVideos = social?.tiktok ?? social?.videos ?? [];
//   const twTweets = social?.twitter ?? social?.tweets ?? [];

//   return (
//     <div className="fade-up">
//       <div className="card">
//         <div className="clabel">منشورات جاهزة للنشر</div>
//         <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem" }}>
//           {[["ig", "📸 Instagram"], ["tt", "🎬 TikTok"], ["tw", "🐦 Twitter/X"]].map(([k, l]) => (
//             <button key={k} onClick={() => setPtab(k)} style={{ padding: ".4rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: ptab === k ? "#1E1E2E" : "transparent", color: ptab === k ? "#F0EDE6" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer", transition: "all .2s" }}>
//               {l}
//             </button>
//           ))}
//         </div>

//         {ptab === "ig" && (igPosts.length === 0 ? (
//           <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "2rem" }}>لا يوجد محتوى Instagram</p>
//         ) : igPosts.map((p: any, i: number) => (
//           <div key={i} style={{ background: "linear-gradient(180deg,#13131E,#0A0A14)", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem", marginBottom: ".75rem" }}>
//             <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".875rem" }}>
//               <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".68rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                 {displayName.slice(0, 2).toUpperCase()}
//               </div>
//               <div>
//                 <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
//                 <div style={{ fontSize: ".65rem", color: "#3A3650" }}>حساب رسمي</div>
//               </div>
//             </div>
//             <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".625rem", whiteSpace: "pre-wrap" }}>{p.caption ?? p.text ?? p.content ?? ""}</p>
//             <p style={{ fontSize: ".78rem", color: "#60A5FA", lineHeight: 1.8, marginBottom: ".5rem" }}>{p.hashtags ?? ""}</p>
//             {(p.theme ?? p.type) && (
//               <span style={{ display: "inline-block", padding: ".18rem .55rem", borderRadius: 5, fontSize: ".65rem", background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)" }}>{p.theme ?? p.type}</span>
//             )}
//           </div>
//         )))}

//         {ptab === "tt" && (ttVideos.length === 0 ? (
//           <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "2rem" }}>لا يوجد محتوى TikTok</p>
//         ) : ttVideos.map((v: any, i: number) => (
//           <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem", marginBottom: ".75rem", borderRight: "3px solid #69C9D0" }}>
//             <p style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: 2, color: "#69C9D0", marginBottom: ".5rem" }}>فيديو تيك توك {i + 1}</p>
//             <p style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>🎬 {v.hook ?? v.title ?? ""}</p>
//             <p style={{ fontSize: ".82rem", color: "#8A8498", marginBottom: ".5rem" }}>💡 {v.idea ?? v.concept ?? ""}</p>
//             {(v.script ?? v.content) && (
//               <p style={{ fontSize: ".78rem", color: "#8A8498", background: "#08080F", borderRadius: 8, padding: ".625rem", lineHeight: 1.65 }}>
//                 📝 <span style={{ color: "#C4BDB5" }}>{v.script ?? v.content}</span>
//               </p>
//             )}
//           </div>
//         )))}

//         {ptab === "tw" && (twTweets.length === 0 ? (
//           <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "2rem" }}>لا يوجد محتوى Twitter</p>
//         ) : twTweets.map((t: any, i: number) => (
//           <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.125rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0" }}>
//             <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.text ?? t.tweet ?? t.content ?? ""}</p>
//           </div>
//         )))}
//       </div>

//       {social?.strategy && (
//         <div className="card">
//           <div className="clabel">خطة النشر المقترحة</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem", marginBottom: ".75rem" }}>
//             {[["أفضل أوقات النشر", social.strategy.bestTimes], ["معدل النشر", social.strategy.frequency]].map(([label, val]) => (
//               <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
//                 <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>{label}</div>
//                 <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{val ?? "—"}</div>
//               </div>
//             ))}
//           </div>
//           {social.strategy.pillars?.length > 0 && (
//             <div>
//               <p style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".5rem" }}>أعمدة المحتوى:</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//                 {social.strategy.pillars.map((p: string, i: number) => (
//                   <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)", fontSize: ".75rem" }}>{p}</span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── LANDING TAB ── */
// function LandingTab({ landing, displayName, primary, secondary }: { landing: any; displayName: string; primary: string; secondary: string }) {
//   const [view, setView] = useState("preview");

//   const stats = landing?.stats ?? [
//     { value: "100+", label: "عميل راضٍ" },
//     { value: "98%", label: "معدل الرضا" },
//     { value: "24/7", label: "دعم مستمر" },
//   ];

//   const htmlCode = `<!DOCTYPE html>
// <html lang="ar" dir="rtl">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width,initial-scale=1">
// <title>${displayName}</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Tajawal',sans-serif;direction:rtl;background:${secondary};color:#F0EDE6}
// nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:${secondary}ee;backdrop-filter:blur(12px);z-index:10}
// .logo{font-size:1.25rem;font-weight:900;color:${primary}}
// .nav-cta{padding:.5rem 1.25rem;border-radius:8px;background:${primary};color:${secondary};font-weight:700;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:.9rem}
// .hero{padding:5rem 2rem 4rem;text-align:center;max-width:700px;margin:0 auto}
// .hero h1{font-size:2.75rem;font-weight:900;margin-bottom:1.25rem;line-height:1.25;color:#ffffff}
// .hero p{font-size:1.05rem;color:rgba(240,237,230,.7);margin-bottom:2.5rem;line-height:1.8}
// .hero-btn{display:inline-block;padding:1rem 2.75rem;border-radius:14px;background:${primary};color:${secondary};font-weight:700;font-size:1.05rem;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;text-decoration:none;transition:opacity .2s}
// .hero-btn:hover{opacity:.9}
// .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:2rem;max-width:700px;margin:0 auto;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
// .stat{text-align:center}.stat-val{font-size:2rem;font-weight:900;color:${primary};line-height:1}.stat-lbl{font-size:.82rem;color:rgba(240,237,230,.5);margin-top:.25rem}
// .feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;padding:3rem 2rem;max-width:900px;margin:0 auto}
// .feat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.5rem;transition:border-color .2s}
// .feat:hover{border-color:${primary}44}
// .feat-icon{font-size:2.25rem;margin-bottom:.875rem}
// .feat h3{font-size:1rem;font-weight:700;color:${primary};margin-bottom:.5rem}
// .feat p{font-size:.875rem;color:rgba(240,237,230,.6);line-height:1.7}
// .testimonial{padding:4rem 2rem;text-align:center;max-width:600px;margin:0 auto}
// .quote-mark{font-size:4rem;color:${primary};opacity:.3;line-height:.5;margin-bottom:1rem}
// .quote-text{font-size:1.1rem;font-style:italic;color:rgba(240,237,230,.85);line-height:1.8;margin-bottom:1.5rem}
// .quote-author{font-size:.85rem;color:${primary};font-weight:700}
// .quote-role{font-size:.75rem;color:rgba(240,237,230,.4);margin-top:.25rem}
// .cta-sec{padding:5rem 2rem;text-align:center;background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border-top:1px solid rgba(255,255,255,.07)}
// .cta-sec h2{font-size:2.25rem;font-weight:900;margin-bottom:.875rem;color:#fff}
// .cta-sec p{color:rgba(240,237,230,.6);margin-bottom:2rem;font-size:1rem}
// footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.07);text-align:center;font-size:.78rem;color:rgba(240,237,230,.25)}
// </style>
// </head>
// <body>
// <nav>
//   <div class="logo">${displayName}</div>
//   <button class="nav-cta">${landing?.hero?.cta || "تواصل معنا"}</button>
// </nav>

// <div class="hero">
//   <h1>${landing?.hero?.headline || landing?.headline || "نحن هنا لخدمتك"}</h1>
//   <p>${landing?.hero?.subheadline || landing?.subheadline || ""}</p>
//   <button class="hero-btn">${landing?.hero?.cta || "ابدأ الآن"}</button>
// </div>

// <div class="stats">
// ${stats.map((s: any) => `  <div class="stat"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("\n")}
// </div>

// <div class="feats">
// ${(landing?.features || landing?.sections || []).map((f: any) => `  <div class="feat"><div class="feat-icon">${f.emoji || "✦"}</div><h3>${f.title || ""}</h3><p>${f.desc || f.description || ""}</p></div>`).join("\n")}
// </div>

// ${landing?.testimonial?.text ? `<div class="testimonial">
//   <div class="quote-mark">"</div>
//   <p class="quote-text">${landing.testimonial.text}</p>
//   <div class="quote-author">${landing.testimonial.name || ""}</div>
//   <div class="quote-role">${landing.testimonial.role || ""}</div>
// </div>` : ""}

// <div class="cta-sec">
//   <h2>${landing?.cta?.headline || "انضم إلينا اليوم"}</h2>
//   <p>${landing?.cta?.subheadline || ""}</p>
//   <button class="hero-btn">${landing?.cta?.button || "ابدأ الآن"}</button>
// </div>

// <footer>© ${new Date().getFullYear()} ${displayName} — جميع الحقوق محفوظة</footer>
// </body>
// </html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlCode], { type: "text/html" }));
//     a.download = `${displayName}-landing.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem", alignItems: "center" }}>
//         {[["preview", "👁 معاينة"], ["code", "{ } الكود"]].map(([k, l]) => (
//           <button key={k} onClick={() => setView(k)} style={{ padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: view === k ? "#1E1E2E" : "transparent", color: view === k ? "#F0EDE6" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer" }}>
//             {l}
//           </button>
//         ))}
//         <button className="gold-btn" style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={handleDownload}>⬇ تحميل HTML</button>
//       </div>

//       {view === "preview" ? (
//         <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//           <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", gap: 5 }}>
//               {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
//             </div>
//             <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>{displayName.toLowerCase().replace(/\s+/g, "-")}.html</span>
//             <div style={{ width: 40 }} />
//           </div>
//           <iframe title="Landing Page Preview" srcDoc={htmlCode} style={{ width: "100%", height: "600px", border: "none" }} />
//         </div>
//       ) : (
//         <div className="card">
//           <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", maxHeight: "450px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//             {htmlCode}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── BROCHURE TAB ── */
// function BrochureTab({ brand, brochureContent, displayName, primary, secondary }: { brand: any; brochureContent: any; displayName: string; primary: string; secondary: string }) {
//   const taglineAr = brand?.tagline?.ar ?? brand?.tagline ?? "";
//   const taglineEn = brand?.tagline?.en ?? "";

//   // استخدم محتوى البروشور المخصص إن وجد، وإلا fallback للـ brand data
//   const intro = brochureContent?.intro ?? brand?.story?.ar ?? brand?.story ?? "";
//   const services = brochureContent?.services ?? [];
//   const whyUs = brochureContent?.whyUs ?? brand?.messages ?? [];
//   const sections = brochureContent?.sections ?? [];
//   const contact = brochureContent?.contact ?? {};
//   const brocheureHeadline = brochureContent?.headline ?? displayName;

//   const htmlBrochure = `<!DOCTYPE html>
// <html lang="ar" dir="rtl">
// <head>
// <meta charset="UTF-8">
// <title>${displayName} — بروشور الشركة</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Sora:wght@400;700&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Tajawal',sans-serif;direction:rtl;background:#f4f4f8;color:#1A1A28;padding:2rem;max-width:820px;margin:0 auto}

// .cover{background:${secondary};border-radius:18px 18px 0 0;padding:4rem 3rem;text-align:center;position:relative;overflow:hidden;color:#F0EDE6}
// .cover-pattern{position:absolute;inset:0;background-image:radial-gradient(${primary}22 1.5px,transparent 1.5px);background-size:22px 22px;pointer-events:none}
// .cover-rel{position:relative}
// .cover-name{font-family:'Sora',sans-serif;font-size:3.5rem;font-weight:900;color:${primary};line-height:1}
// .cover-tagline{font-size:1.15rem;color:rgba(240,237,230,.75);margin-top:.75rem;font-weight:300}
// .cover-tagline-en{font-size:.85rem;color:rgba(240,237,230,.35);font-style:italic;margin-top:.35rem}

// .intro-band{background:${primary};padding:1.25rem 3rem;display:flex;align-items:center;justify-content:center}
// .intro-text{color:${secondary};font-size:.95rem;line-height:1.75;text-align:center;font-weight:500}

// .body{background:#fff;padding:2.5rem 3rem;border-left:1px solid #e8e8f0;border-right:1px solid #e8e8f0}

// .section-title{font-size:.65rem;font-weight:900;letter-spacing:2px;color:${primary};text-transform:uppercase;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid ${primary}22}

// .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
// .service-card{background:#f8f8fc;border-radius:12px;padding:1.25rem;border:1px solid #e8e8f0;text-align:center}
// .service-icon{font-size:1.75rem;margin-bottom:.5rem}
// .service-name{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.25rem}
// .service-brief{font-size:.75rem;color:#6B6478;line-height:1.5}

// .why-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:2rem}
// .why-item{display:flex;align-items:flex-start;gap:.625rem;padding:.875rem;background:#f8f8fc;border-radius:10px;border-right:3px solid ${primary}}
// .why-dot{width:8px;height:8px;border-radius:50%;background:${primary};margin-top:.375rem;flex-shrink:0}
// .why-text{font-size:.82rem;color:#3A3650;line-height:1.6}

// .sections-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem}
// .section-block{padding:1.25rem;border-radius:12px;background:#f8f8fc;border:1px solid #e8e8f0;border-top:3px solid ${primary}}
// .section-block h4{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.5rem}
// .section-block p{font-size:.78rem;color:#6B6478;line-height:1.65}

// .colors-strip{display:flex;height:10px;border-radius:0}
// .color-sw{flex:1}

// .footer-band{background:${secondary};padding:1.5rem 3rem;border-radius:0 0 18px 18px;display:flex;justify-content:space-between;align-items:center}
// .footer-brand{font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:${primary}}
// .footer-contact{font-size:.82rem;color:rgba(240,237,230,.5);text-align:center}
// .footer-dots{display:flex;gap:5px}
// .footer-dot{width:10px;height:10px;border-radius:50%}
// </style>
// </head>
// <body>

// <div class="cover">
//   <div class="cover-pattern"></div>
//   <div class="cover-rel">
//     <div class="cover-name">${brocheureHeadline}</div>
//     <div class="cover-tagline">${taglineAr}</div>
//     <div class="cover-tagline-en">${taglineEn}</div>
//   </div>
// </div>

// <div class="intro-band">
//   <div class="intro-text">${intro}</div>
// </div>

// <div class="body">
//   ${services.length > 0 ? `
//   <div class="section-title">خدماتنا</div>
//   <div class="services-grid">
//     ${services.map((s: any) => `<div class="service-card"><div class="service-icon">${s.icon || "✦"}</div><div class="service-name">${s.name || ""}</div><div class="service-brief">${s.brief || ""}</div></div>`).join("")}
//   </div>` : ""}

//   ${sections.length > 0 ? `
//   <div class="section-title">معلومات عن المشروع</div>
//   <div class="sections-grid">
//     ${sections.map((s: any) => `<div class="section-block"><h4>${s.title || ""}</h4><p>${s.content || ""}</p></div>`).join("")}
//   </div>` : `
//   <div class="section-title">عن البراند</div>
//   <div class="sections-grid">
//     ${[["التموضع التسويقي", brand?.strategy?.positioning ?? ""], ["الجمهور المستهدف", brand?.strategy?.audience ?? ""], ["القيمة الفريدة", brand?.strategy?.value ?? ""], ["نبرة الصوت", brand?.voice?.tone ?? ""]].map(([t, c]) => `<div class="section-block"><h4>${t}</h4><p>${c}</p></div>`).join("")}
//   </div>`}

//   ${whyUs.length > 0 ? `
//   <div class="section-title">لماذا تختارنا؟</div>
//   <div class="why-grid">
//     ${whyUs.map((w: string) => `<div class="why-item"><div class="why-dot"></div><div class="why-text">${w}</div></div>`).join("")}
//   </div>` : ""}

//   ${contact?.tagline ? `
//   <div style="text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:12px;border:1px solid #e8e8f0">
//     <div style="font-size:1rem;font-weight:700;color:#1A1A28;margin-bottom:.75rem">${contact.tagline}</div>
//     <div style="display:inline-block;padding:.75rem 2rem;background:${primary};color:${secondary};border-radius:10px;font-weight:700;font-size:.9rem">${contact.cta || "تواصل معنا"}</div>
//   </div>` : ""}
// </div>

// <div class="colors-strip">
//   ${(brand?.colors || []).map((c: any) => `<div class="color-sw" style="background:${c.hex}"></div>`).join("")}
// </div>

// <div class="footer-band">
//   <div class="footer-brand">${displayName}</div>
//   <div class="footer-contact">Brand Kit © ${new Date().getFullYear()}</div>
//   <div class="footer-dots">
//     ${(brand?.colors || []).map((c: any) => `<div class="footer-dot" style="background:${c.hex}"></div>`).join("")}
//   </div>
// </div>

// </body>
// </html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlBrochure], { type: "text/html" }));
//     a.download = `${displayName}-brochure.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
//         <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تنزيل بروشور HTML</button>
//       </div>
//       <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//         <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", gap: 5 }}>
//             {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
//           </div>
//           <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>brochure-preview.html</span>
//           <div style={{ width: 40 }} />
//         </div>
//         <iframe title="Brochure Preview" srcDoc={htmlBrochure} style={{ width: "100%", height: "600px", border: "none", background: "#f4f4f8" }} />
//       </div>
//     </div>
//   );
// }

// /* ── COMPETITORS TAB ── */
// function CompetitorsTab({ competitors, primary }: { competitors: any; primary: string }) {
//   if (!competitors || Object.keys(competitors).length === 0) {
//     return (
//       <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//         <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
//         <p style={{ color: "#3A3650", fontSize: ".85rem" }}>لم يتم توليد تحليل المنافسين</p>
//       </div>
//     );
//   }

//   const levelColor = (level: string) => {
//     if (level?.includes("شرس") || level?.includes("عالي")) return "#F87171";
//     if (level?.includes("متوسط")) return "#FBBF24";
//     return "#4ADE80";
//   };

//   const sizeColor = (size: string) => {
//     if (size?.includes("ضخم")) return "#A78BFA";
//     if (size?.includes("كبير")) return "#60A5FA";
//     if (size?.includes("متوسط")) return "#FBBF24";
//     return "#4ADE80";
//   };

//   return (
//     <div className="fade-up">
//       {/* Market Overview */}
//       <div className="card">
//         <div className="clabel">نظرة عامة على السوق</div>
//         <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8, marginBottom: "1.25rem" }}>{competitors.marketOverview ?? "—"}</p>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
//             <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>حجم السوق</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: 700, color: sizeColor(competitors.marketSize) }}>{competitors.marketSize ?? "—"}</div>
//           </div>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
//             <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>مستوى المنافسة</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: 700, color: levelColor(competitors.competitionLevel) }}>{competitors.competitionLevel ?? "—"}</div>
//           </div>
//         </div>
//       </div>

//       {/* Competitors List */}
//       {competitors.competitors?.length > 0 && (
//         <div className="card">
//           <div className="clabel">المنافسون في السوق</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {competitors.competitors.map((c: any, i: number) => (
//               <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1.125rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".625rem" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//                     <span style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{c.name}</span>
//                     {c.website && (
//                       <span style={{ fontSize: ".65rem", color: "#60A5FA", fontFamily: "monospace" }}>{c.website}</span>
//                     )}
//                   </div>
//                   <div style={{ display: "flex", gap: ".375rem" }}>
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: c.type?.includes("مباشر") ? "#F8717115" : "#4ADE8015", color: c.type?.includes("مباشر") ? "#F87171" : "#4ADE80", border: `1px solid ${c.type?.includes("مباشر") ? "#F8717133" : "#4ADE8033"}` }}>{c.type ?? "منافس"}</span>
//                     {c.marketShare && (
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#C9973A15", color: "#C9973A", border: "1px solid #C9973A33" }}>{c.marketShare}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
//                   <div>
//                     <div style={{ fontSize: ".6rem", color: "#4ADE80", marginBottom: ".25rem", fontWeight: 700 }}>✓ نقاط القوة</div>
//                     <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.strengths ?? "—"}</p>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: ".6rem", color: "#F87171", marginBottom: ".25rem", fontWeight: 700 }}>✗ نقاط الضعف</div>
//                     <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.weaknesses ?? "—"}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Gaps & Opportunities */}
//       {competitors.gaps?.length > 0 && (
//         <div className="card">
//           <div className="clabel">فرص في السوق غير مستغلة</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
//             {competitors.gaps.map((g: string, i: number) => (
//               <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: "#4ADE8008", border: "1px solid #4ADE8022", borderRadius: 9 }}>
//                 <span style={{ color: "#4ADE80", flexShrink: 0, fontSize: ".9rem" }}>💡</span>
//                 <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{g}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Differentiators */}
//       {competitors.differentiators?.length > 0 && (
//         <div className="card">
//           <div className="clabel">ما يجعل براندك مختلفاً</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
//             {competitors.differentiators.map((d: string, i: number) => (
//               <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: `${primary}08`, border: `1px solid ${primary}22`, borderRadius: 9 }}>
//                 <span style={{ color: primary, flexShrink: 0 }}>✦</span>
//                 <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{d}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Search Keywords */}
//       {competitors.searchKeywords?.length > 0 && (
//         <div className="card">
//           <div className="clabel">كلمات البحث المقترحة لـ SEO</div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//             {competitors.searchKeywords.map((k: string, i: number) => (
//               <span key={i} style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".78rem", background: "#0A0A14", border: "1px solid #1E1E2E", color: "#C4BDB5", fontFamily: "monospace" }}>🔍 {k}</span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Strategic Recommendation */}
//       {competitors.recommendation && (
//         <div className="card" style={{ borderColor: `${primary}33` }}>
//           <div className="clabel" style={{ color: primary }}>التوصية الاستراتيجية للدخول للسوق</div>
//           <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.8 }}>{competitors.recommendation}</p>
//         </div>
//       )}
//     </div>
//   );
// }



































// import { useNavigate, Link } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";

// const STYLES = [
//   { id: "modern", ar: "عصري", en: "Modern" },
//   { id: "luxury", ar: "فاخر", en: "Luxury" },
//   { id: "youth", ar: "شبابي", en: "Youthful" },
//   { id: "minimal", ar: "بسيط", en: "Minimal" },
//   { id: "arabic", ar: "تراثي", en: "Heritage" },
//   { id: "tech", ar: "تقني", en: "Tech" },
// ];

// const COLORS = [
//   { id: "gold", ar: "ذهبي", hex: "#C9973A" },
//   { id: "navy", ar: "كحلي", hex: "#1B3A6B" },
//   { id: "green", ar: "أخضر", hex: "#16A34A" },
//   { id: "red", ar: "أحمر", hex: "#DC2626" },
//   { id: "purple", ar: "بنفسجي", hex: "#7C3AED" },
//   { id: "teal", ar: "تيل", hex: "#0D9488" },
//   { id: "black", ar: "أسود", hex: "#1A1A1A" },
//   { id: "coral", ar: "مرجاني", hex: "#EA580C" },
// ];

// const PHASES = [
//   { key: "brand", label: "بناء الهوية والاستراتيجية", pct: 30 },
//   { key: "logo", label: "تصميم اللوجو SVG", pct: 55 },
//   { key: "social", label: "توليد محتوى السوشيال", pct: 78 },
//   { key: "landing", label: "بناء الـ Landing Page", pct: 95 },
// ];

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<"list" | "wizard" | "generating" | "result">("list");

//   // Wizard States
//   const [apiKey, setApiKey] = useState("");
//   const [idea, setIdea] = useState("");
//   const [bname, setBname] = useState("");
//   const [style, setStyle] = useState("");
//   const [cols, setCols] = useState<string[]>([]);
//   const [err, setErr] = useState("");

//   // Generation / Loading States
//   const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
//   const [phase, setPhase] = useState(0);
//   const [pct, setPct] = useState(0);

//   // Result States
//   const [result, setResult] = useState<any>(null);
//   const [tab, setTab] = useState("identity");

//   const navigate = useNavigate();
//   const pollTimerRef = useRef<any>(null);
//   const fakeProgressTimerRef = useRef<any>(null);

//   // ─── Safe result setter ───
//   // الـ API بيرجع: { result: { brandIdentity, logo, socialMedia, landingPage, brochure, scores } }
//   const safeSetResult = (data: any) => {
//     console.log("RESULT API RESPONSE:", JSON.stringify(data, null, 2));

//     if (!data) {
//       console.error("RESULT ERROR: response فاضي");
//       return false;
//     }

//     // استخرج الـ result object من wrapper الـ API
//     const extracted =
//       data?.result ??   // { result: { brandIdentity, logo, ... } }  ← الشكل المتوقع
//       data?.data ??     // { data: { brandIdentity, logo, ... } }
//       data;             // fallback: الداتا مباشرة

//     console.log("RESULT EXTRACTED:", JSON.stringify(extracted, null, 2));

//     setResult(extracted);
//     return true;
//   };

//   // Verify Auth & Load Projects
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const userRes = await fetch("/api/auth/me");
//         if (!userRes.ok) {
//           navigate("/login");
//           return;
//         }
//         const userData = await userRes.json();
//         setUser(userData.user);

//         const projRes = await fetch("/api/projects");
//         if (projRes.ok) {
//           const projData = await projRes.json();
//           setProjects(projData.projects || []);
//         }
//       } catch (err) {
//         console.error("Dashboard initialization error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();

//     return () => {
//       // FIX #5: تنظيف آمن لكل الـ intervals عند unmount
//       if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//       if (fakeProgressTimerRef.current) clearInterval(fakeProgressTimerRef.current);
//     };
//   }, [navigate]);

//   const stopAllTimers = () => {
//     if (pollTimerRef.current) {
//       clearInterval(pollTimerRef.current);
//       pollTimerRef.current = null;
//     }
//     if (fakeProgressTimerRef.current) {
//       clearInterval(fakeProgressTimerRef.current);
//       fakeProgressTimerRef.current = null;
//     }
//   };

//   const toggleColor = (id: string) => {
//     setCols((p) =>
//       p.includes(id) ? p.filter((c) => c !== id) : [...p, id].slice(0, 3)
//     );
//   };

//   const handleGenerate = async () => {
//     if (!idea.trim()) return setErr("الرجاء إدخال وصف فكرة مشروعك");
//     if (!style) return setErr("الرجاء اختيار الأسلوب البصري");
//     setErr("");

//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-gemini-api-key": apiKey.trim(),
//         },
//         body: JSON.stringify({
//           idea,
//           customBrandName: bname,
//           selectedStyle: style,
//           selectedColors: cols,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         setErr(data.message || "حدث خطأ أثناء إطلاق طلب التوليد");
//         return;
//       }

//       setCurrentProjectId(data.projectId);
//       setView("generating");
//       setPhase(0);
//       setPct(5);

//       let currentPct = 5;
//       fakeProgressTimerRef.current = setInterval(() => {
//         currentPct += Math.floor(Math.random() * 3) + 1;
//         // FIX #2: وقفنا عند 90 مش 95 عشان نفضل مساحة لـ "completed"
//         if (currentPct > 90) currentPct = 90;
//         setPct(currentPct);

//         if (currentPct < 30) setPhase(0);
//         else if (currentPct < 55) setPhase(1);
//         else if (currentPct < 78) setPhase(2);
//         else setPhase(3);
//       }, 500);

//       startPolling(data.projectId);
//     } catch (e) {
//       setErr("فشل الاتصال بالخادم، يرجى المحاولة لاحقاً");
//     }
//   };

//   // FIX #5 + #2: Polling آمن مع handling صحيح للـ timing
//   const startPolling = (projectId: string) => {
//     // وقف أي polling سابق أولًا
//     if (pollTimerRef.current) clearInterval(pollTimerRef.current);

//     pollTimerRef.current = setInterval(async () => {
//       try {
//         const res = await fetch(`/api/projects/${projectId}`);
//         if (!res.ok) return;

//         const data = await res.json();
//         const { status } = data.project;

//         console.log(`Polling project ${projectId}: status = ${status}`);

//         if (status === "completed") {
//           // FIX #5: وقف كل الـ timers فورًا
//           stopAllTimers();
//           setPct(100);
//           setPhase(3);

//           // FIX #2: انتظر ثانية واحدة بس قبل طلب النتيجة
//           setTimeout(async () => {
//             try {
//               const resultRes = await fetch(`/api/projects/${projectId}/result`);
              
//               if (!resultRes.ok) {
//                 console.error("Result API failed:", resultRes.status);
//                 setErr("فشل تحميل نتائج البراند المولد - الخادم أرجع خطأ");
//                 setView("wizard");
//                 return;
//               }

//               const resultData = await resultRes.json();
//               console.log("RESULT API RESPONSE:", JSON.stringify(resultData, null, 2));

//               // FIX #1 + #4 + #7: التأكد من الداتا قبل عرض النتيجة
//               const success = safeSetResult(resultData);
              
//               if (success) {
//                 setView("result");
//                 setTab("identity");
//                 fetchProjectsList();
//               } else {
//                 setErr("البيانات المستلمة من الخادم غير مكتملة، يرجى المحاولة مرة أخرى");
//                 setView("wizard");
//               }
//             } catch (fetchErr) {
//               console.error("Error fetching result:", fetchErr);
//               setErr("فشل تحميل نتائج البراند، خطأ في الاتصال");
//               setView("wizard");
//             }
//           }, 1000);

//         } else if (status === "failed") {
//           stopAllTimers();
//           setErr("فشل الذكاء الاصطناعي في إتمام التوليد، يرجى إعادة المحاولة ووصف فكرتك بدقة أكبر.");
//           setView("wizard");
//         }
//       } catch (err) {
//         console.error("Polling error:", err);
//         // مش بنوقف الـ polling هنا عشان ممكن يكون network glitch مؤقت
//       }
//     }, 2000);
//   };

//   const fetchProjectsList = async () => {
//     try {
//       const res = await fetch("/api/projects");
//       if (res.ok) {
//         const data = await res.json();
//         setProjects(data.projects || []);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleViewResult = async (projId: string) => {
//     setLoading(true);
//     try {
//       const resultRes = await fetch(`/api/projects/${projId}/result`);
      
//       if (!resultRes.ok) {
//         alert("فشل تحميل هذا المشروع، ربما لم يكتمل توليده بعد");
//         return;
//       }

//       const resultData = await resultRes.json();
//       console.log("VIEW RESULT DEBUG:", resultData);

//       // FIX #1 + #4: نفس الـ safe extraction
//       const success = safeSetResult(resultData);
//       if (success) {
//         setView("result");
//         setTab("identity");
//       } else {
//         alert("بيانات المشروع غير مكتملة أو تالفة");
//       }
//     } catch (e) {
//       alert("خطأ في الاتصال بالخادم");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       navigate("/login");
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "#08080F",
//         }}
//       >
//         <div
//           style={{
//             width: 40,
//             height: 40,
//             border: "3px solid #C9973A33",
//             borderTop: "3px solid #C9973A",
//             borderRadius: "50%",
//             animation: "spin 1s linear infinite",
//           }}
//         />
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         fontFamily: "'Tajawal', sans-serif",
//         direction: "rtl",
//         minHeight: "100vh",
//         background: "#08080F",
//         color: "#F0EDE6",
//         paddingTop: 64,
//       }}
//     >
//       {/* Navbar */}
//       <header
//         style={{
//           position: "fixed",
//           top: 0,
//           right: 0,
//           left: 0,
//           zIndex: 90,
//           height: 64,
//           background: "rgba(8,8,15,.92)",
//           borderBottom: "1px solid #1E1E2E",
//           backdropFilter: "blur(16px)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           padding: "0 1.5rem",
//         }}
//       >
//         <Link
//           to="/"
//           style={{
//             textDecoration: "none",
//             display: "flex",
//             alignItems: "center",
//             gap: ".5rem",
//           }}
//         >
//           <div className="mark-sm">ع</div>
//           <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>
//             ArabBrand <span style={{ color: "#C9973A" }}>Studio</span>
//           </span>
//         </Link>
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <span style={{ fontSize: ".8rem", color: "#8A8498" }}>
//             مرحباً، {user?.fullName} ({user?.credits} رصيد)
//           </span>
//           <button
//             onClick={handleLogout}
//             style={{
//               background: "transparent",
//               border: "1px solid #1E1E2E",
//               color: "#8A8498",
//               padding: ".35rem .75rem",
//               borderRadius: 8,
//               fontSize: ".75rem",
//               cursor: "pointer",
//               transition: "all .2s",
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#F8717144")}
//             onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}
//           >
//             تسجيل الخروج
//           </button>
//         </div>
//       </header>

//       {view === "list" && (
//         <div className="page fade-up">
//           <div className="wrap" style={{ maxWidth: 800 }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 marginBottom: "2rem",
//               }}
//             >
//               <div>
//                 <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 800 }}>
//                   برانداتك الهوية
//                 </h1>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}>
//                   إدارة واستعراض العلامات البصرية التي قمت بتوليدها
//                 </p>
//               </div>
//               <button
//                 className="gold-btn"
//                 style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }}
//                 onClick={() => { setView("wizard"); setErr(""); }}
//               >
//                 ✦ براند جديد
//               </button>
//             </div>

//             {projects.length === 0 ? (
//               <div
//                 style={{
//                   background: "#0E0E1A",
//                   border: "1px solid #1E1E2E",
//                   borderRadius: 20,
//                   padding: "4rem 2rem",
//                   textAlign: "center",
//                 }}
//               >
//                 <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
//                 <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>
//                   لا توجد براندات مولدة بعد
//                 </h3>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: "1.5rem" }}>
//                   ابدأ الآن بتوليد علامتك التجارية البصرية الأولى بالذكاء الاصطناعي
//                 </p>
//                 <button className="gold-btn" style={{ padding: ".75rem 1.75rem" }} onClick={() => setView("wizard")}>
//                   ابدأ بتوليد براندك
//                 </button>
//               </div>
//             ) : (
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
//                   gap: "1rem",
//                 }}
//               >
//                 {projects.map((proj) => (
//                   <div
//                     key={proj._id}
//                     style={{
//                       background: "#0E0E1A",
//                       border: "1px solid #1E1E2E",
//                       borderRadius: 16,
//                       padding: "1.25rem",
//                       display: "flex",
//                       flexDirection: "column",
//                       justifyContent: "space-between",
//                       transition: "all .2s",
//                       cursor: "default",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9973A44")}
//                     onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}
//                   >
//                     <div>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: ".75rem",
//                         }}
//                       >
//                         <span
//                           style={{
//                             padding: ".2rem .5rem",
//                             borderRadius: 6,
//                             fontSize: ".65rem",
//                             fontWeight: 700,
//                             background:
//                               proj.status === "completed"
//                                 ? "#4ADE8015"
//                                 : proj.status === "failed"
//                                 ? "#F8717115"
//                                 : "#C9973A15",
//                             color:
//                               proj.status === "completed"
//                                 ? "#4ADE80"
//                                 : proj.status === "failed"
//                                 ? "#F87171"
//                                 : "#C9973A",
//                           }}
//                         >
//                           {proj.status === "completed"
//                             ? "مكتمل"
//                             : proj.status === "failed"
//                             ? "فشل"
//                             : "جاري التوليد"}
//                         </span>
//                         <span style={{ fontSize: ".65rem", color: "#3A3650" }}>
//                           {new Date(proj.createdAt).toLocaleDateString("ar-EG")}
//                         </span>
//                       </div>
//                       <h3
//                         style={{
//                           fontSize: "1.1rem",
//                           fontWeight: 700,
//                           marginBottom: ".5rem",
//                           color: "#F0EDE6",
//                         }}
//                       >
//                         {proj.projectTitle}
//                       </h3>
//                       <p
//                         style={{
//                           fontSize: ".75rem",
//                           color: "#8A8498",
//                           lineHeight: 1.6,
//                           display: "-webkit-box",
//                           WebkitLineClamp: 2,
//                           WebkitBoxOrient: "vertical",
//                           overflow: "hidden",
//                           height: 38,
//                         }}
//                       >
//                         {proj.idea}
//                       </p>
//                     </div>

//                     <div
//                       style={{
//                         borderTop: "1px solid #1E1E2E",
//                         paddingTop: ".75rem",
//                         marginTop: "1rem",
//                       }}
//                     >
//                       {proj.status === "completed" ? (
//                         <button
//                           onClick={() => handleViewResult(proj._id)}
//                           style={{
//                             width: "100%",
//                             padding: ".5rem",
//                             borderRadius: 8,
//                             background: "transparent",
//                             border: "1.5px solid #1E1E2E",
//                             color: "#C9973A",
//                             fontWeight: 700,
//                             fontSize: ".8rem",
//                             cursor: "pointer",
//                             transition: "all .2s",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background = "#C9973A";
//                             e.currentTarget.style.color = "#08080F";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = "transparent";
//                             e.currentTarget.style.color = "#C9973A";
//                           }}
//                         >
//                           استعراض الهوية 🎨
//                         </button>
//                       ) : proj.status === "generating" ? (
//                         <button
//                           onClick={() => {
//                             setView("generating");
//                             setPct(40);
//                             setPhase(1);
//                             startPolling(proj._id);
//                           }}
//                           style={{
//                             width: "100%",
//                             padding: ".5rem",
//                             borderRadius: 8,
//                             background: "transparent",
//                             border: "1.5px solid #1E1E2E",
//                             color: "#8A8498",
//                             fontSize: ".8rem",
//                             cursor: "pointer",
//                           }}
//                         >
//                           متابعة التوليد ⏳
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => {
//                             setView("wizard");
//                             setIdea(proj.idea);
//                             setBname(proj.customBrandName || "");
//                             setStyle(proj.selectedStyle);
//                           }}
//                           style={{
//                             width: "100%",
//                             padding: ".5rem",
//                             borderRadius: 8,
//                             background: "transparent",
//                             border: "1.5px solid #F8717133",
//                             color: "#F87171",
//                             fontSize: ".8rem",
//                             cursor: "pointer",
//                           }}
//                         >
//                           إعادة المحاولة 🔄
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {view === "wizard" && (
//         <div className="page fade-up">
//           <div className="wrap">
//             <div className="topbar">
//               <button className="icon-btn" onClick={() => setView("list")}>←</button>
//               <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
//                 توليد براند جديد بالذكاء الاصطناعي
//               </h2>
//               <div style={{ width: 36 }} />
//             </div>

//             {/* <div className="card" style={{ borderColor: "#4285F433" }}>
//               <div className="clabel" style={{ color: "#4285F4" }}>
//                 🔑 مفتاح Gemini API Key الشخصي (اختياري)
//                 <a
//                   href="https://aistudio.google.com/app/apikey"
//                   target="_blank"
//                   rel="noreferrer"
//                   style={{
//                     color: "#C9973A",
//                     textDecoration: "none",
//                     marginRight: ".5rem",
//                     fontSize: ".72rem",
//                   }} */}
//                 {/* > */}
//                   {/* احصل عليه مجاناً ← */}
//                 {/* </a> */}
//               {/* </div> */}
//               {/* <input
//                 className="field"
//                 type="password"
//                 placeholder="اتركه فارغاً للاستخدام الافتراضي..."
//                 value={apiKey}
//                 onChange={(e) => setApiKey(e.target.value)}
//                 style={{ fontFamily: "monospace", direction: "ltr", textAlign: "left" }}
//               />
//               <p style={{ fontSize: ".65rem", color: "#3A3650", marginTop: ".35rem" }}>
//                 🔒 يتم تشفير وإرسال المفتاح إلى Gemini فقط لتغطية التكلفة
//               </p>
//             </div> */}

//             <div className="card">
//               <div className="clabel">فكرة مشروعك بالتفصيل *</div>
//               <textarea
//                 className="field"
//                 rows={4}
//                 placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة..."
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//               />
//             </div>

//             <div className="card">
//               <div className="clabel">
//                 اسم البراند{" "}
//                 <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختياري)</span>
//               </div>
//               <input
//                 className="field"
//                 placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة"
//                 value={bname}
//                 onChange={(e) => setBname(e.target.value)}
//               />
//             </div>

//             <div className="card">
//               <div className="clabel">الأسلوب البصري والشخصية *</div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(3, 1fr)",
//                   gap: ".5rem",
//                 }}
//               >
//                 {STYLES.map((s) => (
//                   <button
//                     key={s.id}
//                     onClick={() => setStyle(s.id)}
//                     className={`style-btn ${style === s.id ? "on" : ""}`}
//                   >
//                     <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{s.ar}</div>
//                     <div style={{ fontSize: ".65rem", opacity: 0.6, marginTop: 2 }}>{s.en}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="card">
//               <div className="clabel">
//                 الألوان المفضلة{" "}
//                 <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختر حتى 3 ألوان)</span>
//               </div>
//               <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
//                 {COLORS.map((c) => (
//                   <div
//                     key={c.id}
//                     style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
//                   >
//                     <button
//                       onClick={() => toggleColor(c.id)}
//                       style={{
//                         width: 34,
//                         height: 34,
//                         borderRadius: "50%",
//                         background: c.hex,
//                         cursor: "pointer",
//                         border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent",
//                         boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none",
//                         transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#fff",
//                         fontSize: ".85rem",
//                         transition: "all .15s",
//                       }}
//                     >
//                       {cols.includes(c.id) ? "✓" : ""}
//                     </button>
//                     <span style={{ fontSize: ".62rem", color: "#6B6478" }}>{c.ar}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {err && (
//               <div
//                 style={{
//                   background: "#F8717115",
//                   border: "1px solid #F8717133",
//                   borderRadius: 10,
//                   color: "#F87171",
//                   fontSize: ".82rem",
//                   padding: ".75rem 1rem",
//                   marginBottom: "1rem",
//                   textAlign: "center",
//                 }}
//               >
//                 {err}
//               </div>
//             )}

//             <button
//               className="gold-btn"
//               style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }}
//               onClick={handleGenerate}
//             >
//               ✦ ولّد Brand Kit كامل 
//             </button>
//           </div>
//         </div>
//       )}

//       {view === "generating" && <GenScreen phase={phase} pct={pct} />}

//       {/* FIX #4: عرض result فقط لو الداتا موجودة فعلًا */}
//       {view === "result" && result && (
//         <ResultScreen
//           result={result}
//           tab={tab}
//           setTab={setTab}
//           onBack={() => {
//             setView("list");
//             fetchProjectsList();
//           }}
//         />
//       )}

//       {/* FIX #4: لو view=result بس result فاضي → fallback */}
//       {view === "result" && !result && (
//         <div
//           style={{
//             minHeight: "100vh",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "1rem",
//           }}
//         >
//           <p style={{ color: "#F87171", fontSize: "1rem" }}>
//             ⚠️ فشل تحميل البيانات
//           </p>
//           <button
//             className="gold-btn"
//             onClick={() => setView("list")}
//           >
//             العودة للقائمة
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── GENERATING LOADER SCREEN ── */
// function GenScreen({ phase, pct }: { phase: number; pct: number }) {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "1.5rem",
//         padding: "2rem",
//         background: "#08080F",
//       }}
//     >
//       <div style={{ position: "relative", width: 110, height: 110 }}>
//         <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
//           <circle cx="55" cy="55" r="48" fill="none" stroke="#1E1E2E" strokeWidth="4" />
//           <circle
//             cx="55"
//             cy="55"
//             r="48"
//             fill="none"
//             stroke="#C9973A"
//             strokeWidth="4"
//             strokeLinecap="round"
//             strokeDasharray={`${2 * Math.PI * 48}`}
//             strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
//             style={{
//               transition: "stroke-dashoffset 0.5s ease",
//               transform: "rotate(-90deg)",
//               transformOrigin: "50% 50%",
//             }}
//           />
//         </svg>
//         <div
//           style={{
//             position: "absolute",
//             inset: 0,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontFamily: "Sora,sans-serif",
//             fontSize: "1.3rem",
//             fontWeight: 700,
//             color: "#C9973A",
//           }}
//         >
//           {pct}%
//         </div>
//       </div>

//       <div style={{ textAlign: "center" }}>
//         <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#C9973A", marginBottom: ".375rem" }}>
//           {PHASES[phase]?.label}
//         </p>
//         <p style={{ fontSize: ".8rem", color: "#6B6478" }}>
//           يقوم الذكاء الاصطناعي ببناء هويتك التجارية الآن...
//         </p>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: ".5rem",
//           width: "100%",
//           maxWidth: 320,
//         }}
//       >
//         {PHASES.map((p, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: ".75rem",
//               padding: ".5rem .875rem",
//               borderRadius: 9,
//               fontSize: ".8rem",
//               background:
//                 i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent",
//               color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
//               transition: "all .3s",
//             }}
//           >
//             <div
//               style={{
//                 width: 7,
//                 height: 7,
//                 borderRadius: "50%",
//                 flexShrink: 0,
//                 background: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
//                 animation: i === phase ? "blink 1s ease-in-out infinite" : "none",
//               }}
//             />
//             <span>
//               {i < phase ? "✓ " : ""}
//               {p.label}
//             </span>
//           </div>
//         ))}
//       </div>
//       <style>{`@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
//     </div>
//   );
// }

// /* ── RESULT DASHBOARD SCREEN ── */
// const TABS = [
//   { id: "identity", label: "🎨 الهوية" },
//   { id: "logo", label: "🏷️ الشعار" },
//   { id: "social", label: "📱 السوشيال" },
//   { id: "landing", label: "🌐 صفحة الهبوط" },
//   { id: "brochure", label: "📄 البروشور" },
// ];

// function ResultScreen({
//   result,
//   tab,
//   setTab,
//   onBack,
// }: {
//   result: any;
//   tab: string;
//   setTab: (t: string) => void;
//   onBack: () => void;
// }) {
//   // الـ field names مطابقة للـ MongoDB schema تماماً
//   const brand    = result?.brandIdentity ?? {};
//   const logoRaw  = result?.logo ?? {};
//   const logo     = typeof logoRaw === "string" ? logoRaw : (logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "");
//   const social   = result?.socialMedia ?? {};
//   const landing  = result?.landingPage ?? {};
//   const brochure = result?.brochure ?? {};
//   // displayName من الـ brandIdentity object
//   const displayName =
//     result?.displayName ??
//     brand?.recommendedName ??
//     brand?.name ??
//     brand?.brandName ??
//     "Brand";

//   // الألوان من brandIdentity.colors
//   const primary =
//     brand?.primaryColor ??
//     brand?.colors?.[0]?.hex ??
//     result?.primaryColor ??
//     "#C9973A";

//   const secondary =
//     brand?.secondaryColor ??
//     brand?.colors?.[1]?.hex ??
//     result?.secondaryColor ??
//     "#0E0E1A";

//   console.log("ResultScreen:", {
//     resultKeys: Object.keys(result || {}),
//     brandKeys: Object.keys(brand || {}),
//     displayName, primary,
//     hasLogo: !!logo,
//     logoType: typeof logo,
//   });

//   return (
//     <div className="page fade-up">
//       <div className="wrap" style={{ maxWidth: 800 }}>
//         <div className="topbar">
//           <button className="icon-btn" onClick={onBack}>←</button>
//           <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//             <div className="mark-sm">ع</div>
//             <span style={{ fontSize: ".9rem", fontWeight: 700 }}>ArabBrand Studio</span>
//           </div>
//           <div style={{ width: 36 }} />
//         </div>

//         {/* Hero Card */}
//         <div
//           style={{
//             background: `linear-gradient(135deg, ${secondary || "#0E0E1A"} 0%, #17172B 100%)`,
//             border: "1px solid #C9973A22",
//             borderRadius: 20,
//             padding: "2rem",
//             textAlign: "center",
//             marginBottom: "1.5rem",
//             position: "relative",
//             overflow: "hidden",
//           }}
//         >
//           <div
//             style={{
//               position: "absolute",
//               top: -40,
//               right: -40,
//               width: 180,
//               height: 180,
//               background: `radial-gradient(circle, ${primary || "#C9973A"}18, transparent 70%)`,
//               pointerEvents: "none",
//             }}
//           />

//           {(brand?.names?.length > 0) && (
//             <div
//               style={{
//                 display: "flex",
//                 gap: ".375rem",
//                 justifyContent: "center",
//                 flexWrap: "wrap",
//                 marginBottom: "1.125rem",
//               }}
//             >
//               {brand.names.map((n: string, i: number) => (
//                 <span
//                   key={i}
//                   style={{
//                     padding: ".25rem .75rem",
//                     borderRadius: 20,
//                     fontSize: ".72rem",
//                     border: n === brand.recommendedName
//                       ? `1px solid ${primary || "#C9973A"}`
//                       : "1px solid #C9973A33",
//                     background: n === brand.recommendedName
//                       ? primary || "#C9973A"
//                       : "transparent",
//                     color: n === brand.recommendedName
//                       ? secondary || "#08080F"
//                       : "#8A8498",
//                     fontWeight: n === brand.recommendedName ? 700 : 400,
//                   }}
//                 >
//                   {n}
//                 </span>
//               ))}
//             </div>
//           )}

//           <h1
//             style={{
//               fontFamily: "Sora,sans-serif",
//               fontSize: "2.5rem",
//               fontWeight: 800,
//               color: "#F0EDE6",
//               marginBottom: ".375rem",
//               letterSpacing: "-1px",
//             }}
//           >
//             {displayName}
//           </h1>
//           <p style={{ fontSize: "1rem", color: primary || "#C9973A", fontWeight: 500, marginBottom: ".25rem" }}>
//             {brand?.tagline?.ar ?? brand?.tagline ?? ""}
//           </p>
//           <p style={{ fontSize: ".78rem", color: "#8A8498", fontStyle: "italic" }}>
//             {brand?.tagline?.en ?? ""}
//           </p>
//         </div>

//         {/* Tab Buttons */}
//         <div
//           style={{
//             display: "flex",
//             gap: ".375rem",
//             overflowX: "auto",
//             paddingBottom: ".5rem",
//             marginBottom: "1.5rem",
//             scrollbarWidth: "none",
//           }}
//         >
//           {TABS.map((t) => (
//             <button
//               key={t.id}
//               onClick={() => setTab(t.id)}
//               style={{
//                 padding: ".5rem 1.1rem",
//                 borderRadius: 20,
//                 border: `1.5px solid ${tab === t.id ? primary || "#C9973A" : "#1E1E2E"}`,
//                 background: tab === t.id ? primary || "#C9973A" : "transparent",
//                 color: tab === t.id ? secondary || "#08080F" : "#8A8498",
//                 fontFamily: "Tajawal,sans-serif",
//                 fontSize: ".82rem",
//                 fontWeight: tab === t.id ? 700 : 500,
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//                 transition: "all .2s",
//               }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === "identity" && <IdentityTab brand={brand} primary={primary || "#C9973A"} />}
//         {tab === "logo" && (
//           <LogoTab
//             logo={logo}
//             displayName={displayName}
//             brand={brand}
//           />
//         )}
//         {tab === "social" && <SocialTab social={social} displayName={displayName} />}
//         {tab === "landing" && (
//           <LandingTab
//             landing={landing}
//             displayName={displayName}
//             primary={primary || "#C9973A"}
//             secondary={secondary || "#0E0E1A"}
//           />
//         )}
//         {tab === "brochure" && (
//           <BrochureTab
//             brand={brand}
//             displayName={displayName}
//             primary={primary || "#C9973A"}
//             secondary={secondary || "#0E0E1A"}
//           />
//         )}

//         <button
//           onClick={onBack}
//           style={{
//             width: "100%",
//             padding: ".875rem",
//             borderRadius: 14,
//             background: "transparent",
//             border: "1.5px solid #1E1E2E",
//             color: "#8A8498",
//             fontFamily: "Tajawal,sans-serif",
//             fontSize: ".95rem",
//             cursor: "pointer",
//             marginTop: "2rem",
//             transition: "all .2s",
//           }}
//           onMouseEnter={(e) => {
//             e.currentTarget.style.borderColor = "#C9973A33";
//             e.currentTarget.style.color = "#C9973A";
//           }}
//           onMouseLeave={(e) => {
//             e.currentTarget.style.borderColor = "#1E1E2E";
//             e.currentTarget.style.color = "#8A8498";
//           }}
//         >
//           ← العودة للبراندات
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ── RESULT: IDENTITY TAB ── */
// function IdentityTab({ brand, primary }: { brand: any; primary: string }) {
//   const scores = [
//     { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
//     { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
//     { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
//     { l: "الملاءمة والمطابقة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
//   ];

//   return (
//     <div className="fade-up">
//       {/* Colors */}
//       <div className="card">
//         <div className="clabel">لوحة ألوان الهوية الموصى بها</div>
//         {brand?.colors?.length > 0 ? (
//           <>
//             <div
//               style={{
//                 display: "flex",
//                 borderRadius: 12,
//                 overflow: "hidden",
//                 height: 60,
//                 marginBottom: "1rem",
//               }}
//             >
//               {brand.colors.map((c: any, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     flex: 1,
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     background: c.hex,
//                     padding: 4,
//                   }}
//                 >
//                   <span style={{ fontSize: "9px", color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)", fontWeight: 700 }}>
//                     {c.name}
//                   </span>
//                   <span style={{ fontSize: "8px", color: i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)", fontFamily: "monospace" }}>
//                     {c.hex}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div key={i} style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem" }}>
//                   <div style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: "1px solid rgba(255,255,255,.1)" }} />
//                   <span style={{ color: "#C4BDB5" }}>{c.name}</span>
//                   <span style={{ fontFamily: "monospace", color: "#8A8498" }}>{c.hex}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد لوحة الألوان</p>
//         )}
//       </div>

//       {/* Scores */}
//       <div className="card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
//           <div className="clabel" style={{ marginBottom: 0 }}>مؤشر قوة البراند والتأثير</div>
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: "2.75rem", fontWeight: 900, color: primary, lineHeight: 1, fontFamily: "Sora,sans-serif" }}>
//               {brand?.score?.overall ?? 86}
//             </div>
//             <div style={{ fontSize: ".6rem", color: "#8A8498" }}>/100</div>
//           </div>
//         </div>
//         {scores.map((s, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".65rem" }}>
//             <span style={{ fontSize: ".77rem", color: "#8A8498", width: 180, textAlign: "right", flexShrink: 0 }}>
//               {s.l}
//             </span>
//             <div style={{ flex: 1, height: 6, background: "#1E1E2E", borderRadius: 3, overflow: "hidden" }}>
//               <div
//                 style={{
//                   height: "100%",
//                   background: `linear-gradient(90deg, ${primary}, ${primary}88)`,
//                   borderRadius: 3,
//                   width: `${s.v}%`,
//                 }}
//               />
//             </div>
//             <span style={{ fontSize: ".75rem", fontWeight: 700, color: primary, width: 24, textAlign: "left" }}>
//               {s.v}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Strategy */}
//       <div className="card">
//         <div className="clabel">استراتيجية التموضع والجمهور</div>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
//             <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>
//               التموضع التسويقي
//             </div>
//             <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>
//               {brand?.strategy?.positioning ?? "—"}
//             </div>
//           </div>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
//             <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>
//               الجمهور المستهدف
//             </div>
//             <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>
//               {brand?.strategy?.audience ?? "—"}
//             </div>
//           </div>
//         </div>
//         <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
//           <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>
//             القيمة الفريدة المقترحة
//           </div>
//           <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>
//             {brand?.strategy?.value ?? "—"}
//           </div>
//         </div>
//       </div>

//       {/* Story */}
//       <div className="card">
//         <div className="clabel">قصة العلامة التجارية</div>
//         <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>
//           {brand?.story?.ar ?? brand?.story ?? "—"}
//         </p>
//         {brand?.story?.en && (
//           <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>
//             {brand.story.en}
//           </p>
//         )}
//       </div>

//       {/* Typography */}
//       {brand?.typography && (
//         <div className="card">
//           <div className="clabel">هوية الخطوط المقترحة</div>
//           <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #1E1E2E" }}>
//             <div style={{ fontFamily: "Sora,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: primary, marginBottom: ".25rem" }}>
//               {brand.typography.display}
//             </div>
//             <div style={{ fontSize: "1.1rem", color: "rgba(240,237,230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>
//               {brand.typography.arabic}
//             </div>
//             <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand.typography.style}</div>
//           </div>
//         </div>
//       )}

//       {/* Voice & Messages */}
//       {(brand?.voice || brand?.messages) && (
//         <div className="card">
//           <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
//           {brand?.voice?.tone && (
//             <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>
//               النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span>
//             </p>
//           )}
//           {brand?.voice?.traits?.length > 0 && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.25rem" }}>
//               {brand.voice.traits.map((t: string, i: number) => (
//                 <span
//                   key={i}
//                   style={{
//                     padding: ".25rem .65rem",
//                     borderRadius: 6,
//                     background: `${primary}15`,
//                     color: primary,
//                     border: `1px solid ${primary}33`,
//                     fontSize: ".72rem",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>
//           )}
//           {brand?.messages?.length > 0 && (
//             <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: "1rem" }}>
//               <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#8A8498", marginBottom: ".5rem" }}>
//                 الرسائل التسويقية الأساسية:
//               </p>
//               {brand.messages.map((m: string, i: number) => (
//                 <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".4rem 0" }}>
//                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: ".45rem", flexShrink: 0 }} />
//                   <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{m}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




























// /* ── RESULT: LOGO TAB ── */
// function LogoTab({ logo, displayName, brand }: { logo: string; displayName: string; brand: any }) {
//   const [copied, setCopied] = useState(false);
//   const lightBg = brand?.colors?.[3]?.hex || "#F8F5F0";

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([logo], { type: "image/svg+xml" }));
//     a.download = `${displayName}-logo.svg`;
//     a.click();
//   };

//   const handleCopy = () => {
//     navigator.clipboard?.writeText(logo);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!logo) {
//     return (
//       <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//         <p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار</p>
//       </div>
//     );
//   }

//   return (
//     <div className="fade-up">
//       <div className="card">
//         <div className="clabel">الشعار على خلفية فاتحة</div>
//         <div
//           style={{
//             background: lightBg,
//             borderRadius: 16,
//             padding: "2.5rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minHeight: 240,
//           }}
//         >
//           <div
//             dangerouslySetInnerHTML={{ __html: logo }}
//             style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }}
//           />
//         </div>
//         <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
//           <button className="outline-btn" onClick={handleDownload}>⬇ تحميل SVG</button>
//           <button className="outline-btn" onClick={handleCopy}>
//             {copied ? "✓ تم النسخ" : "📋 نسخ كود SVG"}
//           </button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">الشعار على خلفية داكنة</div>
//         <div
//           style={{
//             background: "#08080F",
//             border: "1px solid #1E1E2E",
//             borderRadius: 16,
//             padding: "2.5rem",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             minHeight: 240,
//           }}
//         >
//           <div
//             dangerouslySetInnerHTML={{ __html: logo }}
//             style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }}
//           />
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">كود SVG المصدري</div>
//         <pre
//           style={{
//             background: "#0A0A14",
//             borderRadius: 10,
//             padding: "1rem",
//             fontFamily: "monospace",
//             fontSize: ".7rem",
//             color: "#4ADE80",
//             overflowX: "auto",
//             lineHeight: 1.6,
//             border: "1px solid #1E1E2E",
//             whiteSpace: "pre-wrap",
//             wordBreak: "break-all",
//           }}
//         >
//           {logo}
//         </pre>
//       </div>
//     </div>
//   );
// }
































// /* ── RESULT: SOCIAL TAB ── */
// function SocialTab({ social, displayName }: { social: any; displayName: string }) {
//   const [ptab, setPtab] = useState("ig");

//   const igPosts = social?.instagram ?? social?.posts ?? [];
//   const ttVideos = social?.tiktok ?? social?.videos ?? [];
//   const twTweets = social?.twitter ?? social?.tweets ?? [];

//   return (
//     <div className="fade-up">
//       <div className="card">
//         <div className="clabel">منشورات وحملات جاهزة للنشر</div>
//         <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem" }}>
//           {[["ig", "Instagram"], ["tt", "TikTok"], ["tw", "Twitter/X"]].map(([k, l]) => (
//             <button
//               key={k}
//               onClick={() => setPtab(k)}
//               style={{
//                 padding: ".4rem .9rem",
//                 borderRadius: 20,
//                 border: "1.5px solid #1E1E2E",
//                 background: ptab === k ? "#1E1E2E" : "transparent",
//                 color: ptab === k ? "#F0EDE6" : "#8A8498",
//                 fontFamily: "Tajawal,sans-serif",
//                 fontSize: ".78rem",
//                 cursor: "pointer",
//                 transition: "all .2s",
//               }}
//             >
//               {l}
//             </button>
//           ))}
//         </div>

//         {ptab === "ig" && igPosts.length === 0 && (
//           <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "2rem" }}>
//             لا يوجد محتوى Instagram
//           </p>
//         )}
//         {ptab === "ig" && igPosts.map((p: any, i: number) => (
//           <div
//             key={i}
//             style={{
//               background: "linear-gradient(180deg,#13131E,#0A0A14)",
//               border: "1px solid #1E1E2E",
//               borderRadius: 14,
//               padding: "1.25rem",
//               marginBottom: ".75rem",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: ".625rem", marginBottom: ".875rem" }}>
//               <div
//                 style={{
//                   width: 34, height: 34, borderRadius: "50%",
//                   background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: ".68rem", fontWeight: 700, color: "#fff", flexShrink: 0,
//                 }}
//               >
//                 {displayName.slice(0, 2).toUpperCase()}
//               </div>
//               <div>
//                 <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
//                 <div style={{ fontSize: ".65rem", color: "#3A3650" }}>حساب رسمي</div>
//               </div>
//             </div>
//             <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".625rem", whiteSpace: "pre-wrap" }}>
//               {p.caption ?? p.text ?? p.content ?? ""}
//             </p>
//             <p style={{ fontSize: ".78rem", color: "#60A5FA", lineHeight: 1.8, marginBottom: ".5rem" }}>
//               {p.hashtags ?? ""}
//             </p>
//             {(p.theme ?? p.type) && (
//               <span
//                 style={{
//                   display: "inline-block", padding: ".18rem .55rem", borderRadius: 5,
//                   fontSize: ".65rem", background: "rgba(201,151,58,.1)", color: "#C9973A",
//                   border: "1px solid rgba(201,151,58,.2)",
//                 }}
//               >
//                 {p.theme ?? p.type}
//               </span>
//             )}
//           </div>
//         ))}

//         {ptab === "tt" && ttVideos.map((v: any, i: number) => (
//           <div
//             key={i}
//             style={{
//               background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14,
//               padding: "1.25rem", marginBottom: ".75rem", borderRight: "3px solid #69C9D0",
//             }}
//           >
//             <p style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: 2, color: "#69C9D0", marginBottom: ".5rem" }}>
//               فيديو تيك توك المقترح {i + 1}
//             </p>
//             <p style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>
//               🎬 {v.hook ?? v.title ?? ""}
//             </p>
//             <p style={{ fontSize: ".82rem", color: "#8A8498", marginBottom: ".5rem" }}>
//               💡 {v.idea ?? v.concept ?? ""}
//             </p>
//             {(v.script ?? v.content) && (
//               <p style={{ fontSize: ".78rem", color: "#8A8498", background: "#08080F", borderRadius: 8, padding: ".625rem", lineHeight: 1.65 }}>
//                 📝 <span style={{ color: "#C4BDB5" }}>{v.script ?? v.content}</span>
//               </p>
//             )}
//           </div>
//         ))}

//         {ptab === "tw" && twTweets.map((t: any, i: number) => (
//           <div
//             key={i}
//             style={{
//               background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14,
//               padding: "1.125rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0",
//             }}
//           >
//             <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
//               {t.text ?? t.tweet ?? t.content ?? ""}
//             </p>
//           </div>
//         ))}
//       </div>

//       {social?.strategy && (
//         <div className="card">
//           <div className="clabel">خطة النشر المقترحة</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem", marginBottom: ".75rem" }}>
//             <div style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
//               <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>أفضل أوقات النشر</div>
//               <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{social.strategy.bestTimes ?? "—"}</div>
//             </div>
//             <div style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
//               <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>معدل النشر</div>
//               <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{social.strategy.frequency ?? "—"}</div>
//             </div>
//           </div>
//           {social.strategy.pillars?.length > 0 && (
//             <div>
//               <p style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".5rem" }}>أعمدة المحتوى:</p>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//                 {social.strategy.pillars.map((p: string, i: number) => (
//                   <span
//                     key={i}
//                     style={{
//                       padding: ".25rem .65rem", borderRadius: 6,
//                       background: "rgba(201,151,58,.1)", color: "#C9973A",
//                       border: "1px solid rgba(201,151,58,.2)", fontSize: ".75rem",
//                     }}
//                   >
//                     {p}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── RESULT: LANDING TAB ── */
// function LandingTab({
//   landing, displayName, primary, secondary,
// }: {
//   landing: any; displayName: string; primary: string; secondary: string;
// }) {
//   const [view, setView] = useState("preview");

//   const htmlCode = `<!DOCTYPE html>
// <html lang="ar" dir="rtl"><head>
// <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
// <title>${displayName}</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Tajawal',sans-serif;direction:rtl;background:${secondary || "#08080F"};color:#F0EDE6}
// nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:${secondary || "#08080F"}cc;backdrop-filter:blur(12px)}
// .logo{font-size:1.25rem;font-weight:900;color:${primary || "#C9973A"}}.cta{padding:.5rem 1.25rem;border-radius:8px;background:${primary || "#C9973A"};color:${secondary || "#08080F"};font-weight:700;border:none;cursor:pointer;font-family:'Tajawal',sans-serif}
// .hero{padding:5rem 2rem;text-align:center;max-width:680px;margin:0 auto}.hero h1{font-size:2.75rem;font-weight:900;margin-bottom:1rem;line-height:1.25;color:#ffffff}
// .hero p{font-size:1.05rem;color:rgba(240,237,230,.65);margin-bottom:2rem;line-height:1.7}.btn{display:inline-block;padding:1rem 2.5rem;border-radius:12px;background:${primary || "#C9973A"};color:${secondary || "#08080F"};font-weight:700;font-size:1rem;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;text-decoration:none}
// .feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;padding:3rem 2rem;max-width:860px;margin:0 auto}
// .feat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:1.5rem}.icon{font-size:2rem;margin-bottom:.75rem}.feat h3{font-size:1rem;font-weight:700;color:${primary || "#C9973A"};margin-bottom:.5rem}.feat p{font-size:.875rem;color:rgba(240,237,230,.6);line-height:1.65}
// .quote-sec{padding:3rem 2rem;text-align:center;border-top:1px solid rgba(255,255,255,.08)}.quote{font-size:1.1rem;font-style:italic;max-width:520px;margin:0 auto 1rem;color:rgba(240,237,230,.8);line-height:1.75}.author{font-size:.8rem;color:rgba(240,237,230,.4)}
// .cta-sec{padding:4rem 2rem;text-align:center;background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.08)}.cta-sec h2{font-size:2rem;font-weight:900;margin-bottom:.75rem;color:#ffffff}.cta-sec p{color:rgba(240,237,230,.6);margin-bottom:1.75rem}
// footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.08);text-align:center;font-size:.8rem;color:rgba(240,237,230,.3)}
// </style></head><body>
// <nav><div class="logo">${displayName}</div><button class="cta">${landing?.hero?.cta || "اتصل بنا"}</button></nav>
// <div class="hero"><h1>${landing?.hero?.headline || landing?.headline || ""}</h1><p>${landing?.hero?.subheadline || landing?.subheadline || ""}</p><button class="btn">${landing?.hero?.cta || landing?.cta?.button || "ابدأ الاستكشاف"}</button></div>
// <div class="feats">${(landing?.features || landing?.sections || []).map((f: any) => `<div class="feat"><div class="icon">${f.emoji || "✦"}</div><h3>${f.title}</h3><p>${f.desc || f.description || ""}</p></div>`).join("")}</div>
// <div class="quote-sec"><p class="quote">"${landing?.testimonial?.text || landing?.quote || ""}"</p><div class="author">${landing?.testimonial?.name || ""} — ${landing?.testimonial?.role || ""}</div></div>
// <div class="cta-sec"><h2>${landing?.cta?.headline || ""}</h2><p>${landing?.cta?.subheadline || ""}</p><button class="btn">${landing?.cta?.button || "اشترك الآن"}</button></div>
// <footer>© ${new Date().getFullYear()} ${displayName}</footer>
// </body></html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlCode], { type: "text/html" }));
//     a.download = `${displayName}-landing.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem", alignItems: "center" }}>
//         {[["preview", "👁 معاينة الصفحة"], ["code", "{ } الكود المصدري"]].map(([k, l]) => (
//           <button
//             key={k}
//             onClick={() => setView(k)}
//             style={{
//               padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E",
//               background: view === k ? "#1E1E2E" : "transparent",
//               color: view === k ? "#F0EDE6" : "#8A8498",
//               fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer",
//             }}
//           >
//             {l}
//           </button>
//         ))}
//         <button
//           className="gold-btn"
//           style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }}
//           onClick={handleDownload}
//         >
//           ⬇ تحميل HTML
//         </button>
//       </div>

//       {view === "preview" ? (
//         <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//           <div
//             style={{
//               background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem",
//               display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", gap: 5 }}>
//               {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
//                 <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
//               ))}
//             </div>
//             <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>
//               {displayName.toLowerCase().replace(/\s+/g, "-")}.html
//             </span>
//             <div style={{ width: 40 }} />
//           </div>
//           <iframe
//             title="Landing Page Preview"
//             srcDoc={htmlCode}
//             style={{ width: "100%", height: "550px", border: "none", background: secondary || "#08080F" }}
//           />
//         </div>
//       ) : (
//         <div className="card">
//           <pre
//             style={{
//               background: "#0A0A14", borderRadius: 10, padding: "1rem",
//               fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80",
//               overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E",
//               maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all",
//             }}
//           >
//             {htmlCode}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── RESULT: BROCHURE TAB ── */
// function BrochureTab({
//   brand, displayName, primary, secondary,
// }: {
//   brand: any; displayName: string; primary: string; secondary: string;
// }) {
//   const taglineAr = brand?.tagline?.ar ?? brand?.tagline ?? "";
//   const taglineEn = brand?.tagline?.en ?? "";

//   const htmlBrochure = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${displayName} — بروشور الشركة</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Sora:wght@400;700&display=swap" rel="stylesheet">
// <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Tajawal',sans-serif;direction:rtl;background:#ffffff;color:#1A1A28;padding:2rem;max-width:800px;margin:0 auto}
// .head{background:${secondary || "#08080F"};padding:3rem 2.5rem;text-align:center;position:relative;overflow:hidden;border-radius:14px 14px 0 0;color:#F0EDE6}
// .pat{position:absolute;inset:0;background-image:radial-gradient(circle,${primary || "#C9973A"}22 1px,transparent 1px);background-size:24px 24px}
// .rel{position:relative}.bname{font-family:'Sora',sans-serif;font-size:3.5rem;font-weight:900;color:${primary || "#C9973A"};margin-bottom:.5rem}
// .btag{font-size:1.2rem;color:rgba(240,237,230,.75);font-weight:300}
// .body{background:#F8F8FC;padding:2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;border-left:1px solid #e5e5ed;border-right:1px solid #e5e5ed}
// .sec{padding:1.25rem;border-right:4px solid ${primary || "#C9973A"};background:#ffffff;border-radius:0 12px 12px 0;box-shadow:0 4px 6px rgba(0,0,0,0.02)}
// .sl{font-size:.72rem;font-weight:900;letter-spacing:1px;color:${primary || "#C9973A"};margin-bottom:.5rem;text-transform:uppercase}
// .sb{font-size:.85rem;color:#4A4A5A;line-height:1.7}
// .cstrip{display:flex;height:12px}.csw{flex:1}
// .foot{background:${secondary || "#08080F"};padding:1.25rem 2.5rem;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:rgba(240,237,230,.35);border-radius:0 0 14px 14px}
// .dots{display:flex;gap:6px}.dot{width:12px;height:12px;border-radius:50%}
// </style></head><body>
// <div class="head"><div class="pat"></div><div class="rel"><div class="bname">${displayName}</div><div class="btag">${taglineAr}</div><div style="font-size:.8rem;color:rgba(240,237,230,.3);font-style:italic;margin-top:.25rem">${taglineEn}</div></div></div>
// <div class="body">
//   <div class="sec"><div class="sl">قصة العلامة التجارية</div><div class="sb">${brand?.story?.ar ?? brand?.story ?? ""}</div></div>
//   <div class="sec"><div class="sl">الجمهور المستهدف</div><div class="sb">${brand?.strategy?.audience ?? ""}</div></div>
//   <div class="sec"><div class="sl">القيمة المقترحة الفريدة</div><div class="sb">${brand?.strategy?.value ?? ""}</div></div>
//   <div class="sec"><div class="sl">صوت ورسالة البراند</div><div class="sb">${brand?.messages?.[0] ?? ""}</div></div>
// </div>
// <div class="cstrip">${(brand?.colors || []).map((c: any) => `<div class="csw" style="background:${c.hex}"></div>`).join("")}</div>
// <div class="foot"><span>${displayName}</span><div class="dots">${(brand?.colors || []).map((c: any) => `<div class="dot" style="background:${c.hex}"></div>`).join("")}</div><span>Brand Kit Brochure</span></div>
// </body></html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlBrochure], { type: "text/html" }));
//     a.download = `${displayName}-brochure.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
//         <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>
//           ⬇ تنزيل بروشور HTML
//         </button>
//       </div>
//       <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//         <div
//           style={{
//             background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem",
//             display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0",
//             justifyContent: "space-between",
//           }}
//         >
//           <div style={{ display: "flex", gap: 5 }}>
//             {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
//               <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
//             ))}
//           </div>
//           <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>
//             brochure-preview.html
//           </span>
//           <div style={{ width: 40 }} />
//         </div>
//         <iframe
//           title="Brochure Preview"
//           srcDoc={htmlBrochure}
//           style={{ width: "100%", height: "550px", border: "none", background: "#ffffff" }}
//         />
//       </div>
//     </div>
//   );
// }





















































































































































// import { useNavigate, Link } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";

// const STYLES = [
//   { id: "modern", ar: "عصري", en: "Modern" },
//   { id: "luxury", ar: "فاخر", en: "Luxury" },
//   { id: "youth", ar: "شبابي", en: "Youthful" },
//   { id: "minimal", ar: "بسيط", en: "Minimal" },
//   { id: "arabic", ar: "تراثي", en: "Heritage" },
//   { id: "tech", ar: "تقني", en: "Tech" },
// ];

// const COLORS = [
//   { id: "gold", ar: "ذهبي", hex: "#C9973A" },
//   { id: "navy", ar: "كحلي", hex: "#1B3A6B" },
//   { id: "green", ar: "أخضر", hex: "#16A34A" },
//   { id: "red", ar: "أحمر", hex: "#DC2626" },
//   { id: "purple", ar: "بنفسجي", hex: "#7C3AED" },
//   { id: "teal", ar: "تيل", hex: "#0D9488" },
//   { id: "black", ar: "أسود", hex: "#1A1A1A" },
//   { id: "coral", ar: "مرجاني", hex: "#EA580C" },
// ];

// const PHASES = [
//   { key: "brand", label: "بناء الهوية والاستراتيجية", pct: 25 },
//   { key: "logo", label: "تصميم الشعار SVG", pct: 45 },
//   { key: "social", label: "توليد محتوى السوشيال", pct: 65 },
//   { key: "landing", label: "بناء الـ Landing Page", pct: 80 },
//   { key: "competitors", label: "تحليل المنافسين والسوق", pct: 95 },
// ];

// export default function Dashboard() {
//   const [user, setUser] = useState<any>(null);
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState<"list" | "wizard" | "generating" | "result">("list");

//   const [idea, setIdea] = useState("");
//   const [bname, setBname] = useState("");
//   const [style, setStyle] = useState("");
//   const [cols, setCols] = useState<string[]>([]);
//   const [err, setErr] = useState("");

//   const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
//   const [phase, setPhase] = useState(0);
//   const [pct, setPct] = useState(0);

//   const [result, setResult] = useState<any>(null);
//   const [tab, setTab] = useState("identity");

//   const navigate = useNavigate();
//   const pollTimerRef = useRef<any>(null);
//   const fakeProgressTimerRef = useRef<any>(null);

//   const safeSetResult = (data: any) => {
//     console.log("RESULT API RESPONSE:", JSON.stringify(data, null, 2));
//     if (!data) return false;
//     const extracted = data?.result ?? data?.data ?? data;
//     console.log("RESULT EXTRACTED keys:", Object.keys(extracted || {}));
//     setResult(extracted);
//     return true;
//   };

//   useEffect(() => {
//     const init = async () => {
//       try {
//         const userRes = await fetch("/api/auth/me");
//         if (!userRes.ok) { navigate("/login"); return; }
//         const userData = await userRes.json();
//         setUser(userData.user);
//         const projRes = await fetch("/api/projects");
//         if (projRes.ok) {
//           const projData = await projRes.json();
//           setProjects(projData.projects || []);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//     return () => { stopAllTimers(); };
//   }, [navigate]);

//   const stopAllTimers = () => {
//     if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
//     if (fakeProgressTimerRef.current) { clearInterval(fakeProgressTimerRef.current); fakeProgressTimerRef.current = null; }
//   };

//   const toggleColor = (id: string) =>
//     setCols((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id].slice(0, 3));

//   const handleGenerate = async () => {
//     if (!idea.trim()) return setErr("الرجاء إدخال وصف فكرة مشروعك");
//     if (!style) return setErr("الرجاء اختيار الأسلوب البصري");
//     setErr("");

//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           idea,
//           customBrandName: bname,
//           selectedStyle: style,
//           selectedColors: cols,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) { setErr(data.message || "حدث خطأ أثناء إطلاق طلب التوليد"); return; }

//       setCurrentProjectId(data.projectId);
//       setView("generating");
//       setPhase(0);
//       setPct(5);

//       let currentPct = 5;
//       fakeProgressTimerRef.current = setInterval(() => {
//         currentPct += Math.floor(Math.random() * 3) + 1;
//         if (currentPct > 90) currentPct = 90;
//         setPct(currentPct);
//         if (currentPct < 25) setPhase(0);
//         else if (currentPct < 45) setPhase(1);
//         else if (currentPct < 65) setPhase(2);
//         else if (currentPct < 80) setPhase(3);
//         else setPhase(4);
//       }, 500);

//       startPolling(data.projectId);
//     } catch (e) {
//       setErr("فشل الاتصال بالخادم، يرجى المحاولة لاحقاً");
//     }
//   };

//   const startPolling = (projectId: string) => {
//     if (pollTimerRef.current) clearInterval(pollTimerRef.current);
//     pollTimerRef.current = setInterval(async () => {
//       try {
//         const res = await fetch(`/api/projects/${projectId}`);
//         if (!res.ok) return;
//         const data = await res.json();
//         const { status } = data.project;

//         if (status === "completed") {
//           stopAllTimers();
//           setPct(100);
//           setPhase(4);
//           setTimeout(async () => {
//             try {
//               const resultRes = await fetch(`/api/projects/${projectId}/result`);
//               if (!resultRes.ok) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); return; }
//               const resultData = await resultRes.json();
//               const success = safeSetResult(resultData);
//               if (success) { setView("result"); setTab("identity"); fetchProjectsList(); }
//               else { setErr("البيانات المستلمة غير مكتملة"); setView("wizard"); }
//             } catch (e) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); }
//           }, 1000);
//         } else if (status === "failed") {
//           stopAllTimers();
//           setErr("فشل الذكاء الاصطناعي، يرجى إعادة المحاولة بوصف أكثر تفصيلاً.");
//           setView("wizard");
//         }
//       } catch (e) { console.error("Polling error:", e); }
//     }, 2000);
//   };

//   const fetchProjectsList = async () => {
//     try {
//       const res = await fetch("/api/projects");
//       if (res.ok) { const data = await res.json(); setProjects(data.projects || []); }
//     } catch (e) { console.error(e); }
//   };

//   const handleViewResult = async (projId: string) => {
//     setLoading(true);
//     try {
//       const resultRes = await fetch(`/api/projects/${projId}/result`);
//       if (!resultRes.ok) { alert("فشل تحميل هذا المشروع"); return; }
//       const resultData = await resultRes.json();
//       const success = safeSetResult(resultData);
//       if (success) { setView("result"); setTab("identity"); }
//       else alert("بيانات المشروع غير مكتملة");
//     } catch (e) { alert("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   const handleLogout = async () => {
//     try { await fetch("/api/auth/logout", { method: "POST" }); navigate("/login"); }
//     catch (e) { console.error(e); }
//   };

//   if (loading) return (
//     <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080F" }}>
//       <div style={{ width: 40, height: 40, border: "3px solid #C9973A33", borderTop: "3px solid #C9973A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
//     </div>
//   );

//   return (
//     <div style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", minHeight: "100vh", background: "#08080F", color: "#F0EDE6", paddingTop: 64 }}>
//       {/* Navbar */}
//       <header style={{ position: "fixed", top: 0, right: 0, left: 0, zIndex: 90, height: 64, background: "rgba(8,8,15,.92)", borderBottom: "1px solid #1E1E2E", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem" }}>
//         <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: ".5rem" }}>
//           <div className="mark-sm">ع</div>
//           <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>ArabBrand <span style={{ color: "#C9973A" }}>Studio</span></span>
//         </Link>
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <span style={{ fontSize: ".8rem", color: "#8A8498" }}>مرحباً، {user?.fullName} ({user?.credits} رصيد)</span>
//           <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #1E1E2E", color: "#8A8498", padding: ".35rem .75rem", borderRadius: 8, fontSize: ".75rem", cursor: "pointer" }}
//             onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#F8717144")}
//             onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}>
//             تسجيل الخروج
//           </button>
//         </div>
//       </header>

//       {/* LIST VIEW */}
//       {view === "list" && (
//         <div className="page fade-up">
//           <div className="wrap" style={{ maxWidth: 800 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
//               <div>
//                 <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 800 }}>براندات الهوية</h1>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}>إدارة واستعراض العلامات البصرية المولدة</p>
//               </div>
//               <button className="gold-btn" style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }} onClick={() => { setView("wizard"); setErr(""); }}>
//                 ✦ براند جديد
//               </button>
//             </div>

//             {projects.length === 0 ? (
//               <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
//                 <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
//                 <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>لا توجد براندات مولدة بعد</h3>
//                 <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: "1.5rem" }}>ابدأ الآن بتوليد علامتك التجارية الأولى بالذكاء الاصطناعي</p>
//                 <button className="gold-btn" style={{ padding: ".75rem 1.75rem" }} onClick={() => setView("wizard")}>ابدأ بتوليد براندك</button>
//               </div>
//             ) : (
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
//                 {projects.map((proj) => (
//                   <div key={proj._id} style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 16, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all .2s" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9973A44")}
//                     onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}>
//                     <div>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem" }}>
//                         <span style={{ padding: ".2rem .5rem", borderRadius: 6, fontSize: ".65rem", fontWeight: 700, background: proj.status === "completed" ? "#4ADE8015" : proj.status === "failed" ? "#F8717115" : "#C9973A15", color: proj.status === "completed" ? "#4ADE80" : proj.status === "failed" ? "#F87171" : "#C9973A" }}>
//                           {proj.status === "completed" ? "مكتمل" : proj.status === "failed" ? "فشل" : "جاري التوليد"}
//                         </span>
//                         <span style={{ fontSize: ".65rem", color: "#3A3650" }}>{new Date(proj.createdAt).toLocaleDateString("ar-EG")}</span>
//                       </div>
//                       <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "#F0EDE6" }}>{proj.projectTitle}</h3>
//                       <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 38 }}>{proj.idea}</p>
//                     </div>
//                     <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: ".75rem", marginTop: "1rem" }}>
//                       {proj.status === "completed" ? (
//                         <button onClick={() => handleViewResult(proj._id)} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#C9973A", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", transition: "all .2s" }}
//                           onMouseEnter={(e) => { e.currentTarget.style.background = "#C9973A"; e.currentTarget.style.color = "#08080F"; }}
//                           onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9973A"; }}>
//                           استعراض الهوية 🎨
//                         </button>
//                       ) : proj.status === "generating" ? (
//                         <button onClick={() => { setView("generating"); setPct(40); setPhase(1); startPolling(proj._id); }} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontSize: ".8rem", cursor: "pointer" }}>
//                           متابعة التوليد ⏳
//                         </button>
//                       ) : (
//                         <button onClick={() => { setView("wizard"); setIdea(proj.idea); setBname(proj.customBrandName || ""); setStyle(proj.selectedStyle); }} style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #F8717133", color: "#F87171", fontSize: ".8rem", cursor: "pointer" }}>
//                           إعادة المحاولة 🔄
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* WIZARD VIEW */}
//       {view === "wizard" && (
//         <div className="page fade-up">
//           <div className="wrap">
//             <div className="topbar">
//               <button className="icon-btn" onClick={() => setView("list")}>←</button>
//               <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>توليد براند جديد بالذكاء الاصطناعي</h2>
//               <div style={{ width: 36 }} />
//             </div>

//             <div className="card">
//               <div className="clabel">فكرة مشروعك بالتفصيل *</div>
//               <textarea className="field" rows={4} placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة للشباب في الرياض..." value={idea} onChange={(e) => setIdea(e.target.value)} />
//               <p style={{ fontSize: ".7rem", color: "#3A3650", marginTop: ".35rem" }}>💡 كلما كان الوصف أكثر تفصيلاً، كانت نتائج البراند أكثر دقة وتميزاً</p>
//             </div>

//             <div className="card">
//               <div className="clabel">اسم البراند <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختياري)</span></div>
//               <input className="field" placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة مع شرح كل اسم" value={bname} onChange={(e) => setBname(e.target.value)} />
//               {!bname && (
//                 <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".5rem .75rem", marginTop: ".5rem", fontSize: ".72rem", color: "#C9973A" }}>
//                   ✦ سيقترح الذكاء الاصطناعي 3 أسماء مدروسة مع معنى كل اسم وسبب اختياره
//                 </div>
//               )}
//             </div>

//             <div className="card">
//               <div className="clabel">الأسلوب البصري والشخصية *</div>
//               <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem" }}>
//                 {STYLES.map((s) => (
//                   <button key={s.id} onClick={() => setStyle(s.id)} className={`style-btn ${style === s.id ? "on" : ""}`}>
//                     <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{s.ar}</div>
//                     <div style={{ fontSize: ".65rem", opacity: 0.6, marginTop: 2 }}>{s.en}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="card">
//               <div className="clabel">الألوان المفضلة <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختر حتى 3 ألوان)</span></div>
//               <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
//                 {COLORS.map((c) => (
//                   <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
//                     <button onClick={() => toggleColor(c.id)} style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer", border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent", boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none", transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem", transition: "all .15s" }}>
//                       {cols.includes(c.id) ? "✓" : ""}
//                     </button>
//                     <span style={{ fontSize: ".62rem", color: "#6B6478" }}>{c.ar}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {err && (
//               <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
//                 {err}
//               </div>
//             )}

//             <button className="gold-btn" style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }} onClick={handleGenerate}>
//               ✦ ولّد Brand Kit كامل مع تحليل المنافسين
//             </button>
//           </div>
//         </div>
//       )}

//       {view === "generating" && <GenScreen phase={phase} pct={pct} />}

//       {view === "result" && result && (
//         <ResultScreen result={result} tab={tab} setTab={setTab} onBack={() => { setView("list"); fetchProjectsList(); }} />
//       )}

//       {view === "result" && !result && (
//         <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
//           <p style={{ color: "#F87171", fontSize: "1rem" }}>⚠️ فشل تحميل البيانات</p>
//           <button className="gold-btn" onClick={() => setView("list")}>العودة للقائمة</button>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── GENERATING SCREEN ── */
// function GenScreen({ phase, pct }: { phase: number; pct: number }) {
//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", background: "#08080F" }}>
//       <div style={{ position: "relative", width: 110, height: 110 }}>
//         <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
//           <circle cx="55" cy="55" r="48" fill="none" stroke="#1E1E2E" strokeWidth="4" />
//           <circle cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4" strokeLinecap="round"
//             strokeDasharray={`${2 * Math.PI * 48}`}
//             strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
//             style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
//         </svg>
//         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#C9973A" }}>{pct}%</div>
//       </div>

//       <div style={{ textAlign: "center" }}>
//         <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#C9973A", marginBottom: ".375rem" }}>{PHASES[phase]?.label}</p>
//         <p style={{ fontSize: ".8rem", color: "#6B6478" }}>الذكاء الاصطناعي يبني هويتك التجارية الآن...</p>
//       </div>

//       <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", width: "100%", maxWidth: 340 }}>
//         {PHASES.map((p, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .875rem", borderRadius: 9, fontSize: ".8rem", background: i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent", color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", transition: "all .3s" }}>
//             <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", animation: i === phase ? "blink 1s ease-in-out infinite" : "none" }} />
//             <span>{i < phase ? "✓ " : ""}{p.label}</span>
//           </div>
//         ))}
//       </div>
//       <style>{`@keyframes blink{0%,100%{opacity:.3}50%{opacity:1}}`}</style>
//     </div>
//   );
// }

// /* ── RESULT SCREEN ── */
// const TABS = [
//   { id: "identity", label: "🎨 الهوية" },
//   { id: "logo", label: "🏷️ الشعار" },
//   { id: "social", label: "📱 السوشيال" },
//   { id: "landing", label: "🌐 صفحة الهبوط" },
//   { id: "brochure", label: "📄 البروشور" },
//   { id: "competitors", label: "🔍 المنافسون" },
// ];

// function ResultScreen({ result, tab, setTab, onBack }: { result: any; tab: string; setTab: (t: string) => void; onBack: () => void }) {
//   const [socialData, setSocialData] = useState<any>(null);

//   const brand = result?.brandIdentity ?? {};
//   const logoRaw = result?.logo ?? {};
//   const logoStr = typeof logoRaw === "string" ? logoRaw : (logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "");
//   const logo = sanitizeSVGClient(logoStr);
//   const social = socialData ?? result?.socialMedia ?? {};
//   const landing = result?.landingPage ?? {};
//   const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
//   const competitors = result?.competitors ?? {};
//   const projectId = result?.projectId ?? result?._id ?? "";

//   // دعم صيغة الأسماء الجديدة (objects) والقديمة (strings)
//   const namesRaw: any[] = brand?.names ?? [];
//   const nameObjects: { name: string; reason?: string; meaning?: string }[] = namesRaw.map((n: any) =>
//     typeof n === "string" ? { name: n } : n
//   );

//   const displayName =
//     result?.displayName ??
//     brand?.recommendedName ??
//     brand?.name ??
//     nameObjects[0]?.name ??
//     "Brand";

//   const primary = brand?.primaryColor ?? brand?.colors?.[0]?.hex ?? "#C9973A";
//   const secondary = brand?.secondaryColor ?? brand?.colors?.[1]?.hex ?? "#0E0E1A";

//   return (
//     <div className="page fade-up">
//       <div className="wrap" style={{ maxWidth: 800 }}>
//         <div className="topbar">
//           <button className="icon-btn" onClick={onBack}>←</button>
//           <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//             <div className="mark-sm">ع</div>
//             <span style={{ fontSize: ".9rem", fontWeight: 700 }}>ArabBrand Studio</span>
//           </div>
//           <div style={{ width: 36 }} />
//         </div>

//         {/* Hero Card */}
//         <div style={{ background: `linear-gradient(135deg, ${secondary} 0%, #17172B 100%)`, border: "1px solid #C9973A22", borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${primary}18, transparent 70%)`, pointerEvents: "none" }} />

//           {/* اقتراحات الأسماء */}
//           {nameObjects.length > 0 && (
//             <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.125rem" }}>
//               {nameObjects.map((n, i) => (
//                 <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                   <span style={{ padding: ".25rem .75rem", borderRadius: 20, fontSize: ".72rem", border: n.name === brand.recommendedName ? `1px solid ${primary}` : "1px solid #C9973A33", background: n.name === brand.recommendedName ? primary : "transparent", color: n.name === brand.recommendedName ? secondary : "#8A8498", fontWeight: n.name === brand.recommendedName ? 700 : 400 }}>
//                     {n.name}
//                     {n.name === brand.recommendedName && " ✦"}
//                   </span>
//                   {n.meaning && (
//                     <span style={{ fontSize: ".58rem", color: "#3A3650", marginTop: 2 }}>{n.meaning}</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#F0EDE6", marginBottom: ".375rem", letterSpacing: "-1px" }}>{displayName}</h1>
//           <p style={{ fontSize: "1rem", color: primary, fontWeight: 500, marginBottom: ".25rem" }}>{brand?.tagline?.ar ?? brand?.tagline ?? ""}</p>
//           <p style={{ fontSize: ".78rem", color: "#8A8498", fontStyle: "italic" }}>{brand?.tagline?.en ?? ""}</p>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1.5rem", scrollbarWidth: "none" }}>
//           {TABS.map((t) => (
//             <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`, background: tab === t.id ? primary : "transparent", color: tab === t.id ? secondary : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === "identity" && <IdentityTab brand={brand} primary={primary} nameObjects={nameObjects} />}
//         {tab === "logo" && <LogoTab logo={logo} displayName={displayName} brand={brand} />}
//         {tab === "social" && <SocialTab social={social} displayName={displayName} projectId={projectId} onSocialUpdate={(s) => setSocialData(s)} />}
//         {tab === "landing" && <LandingTab landing={landing} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "brochure" && <BrochureTab brand={brand} brochureContent={brochureContent} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "competitors" && <CompetitorsTab competitors={competitors} primary={primary} />}

//         <button onClick={onBack} style={{ width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s" }}
//           onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}>
//           ← العودة للبراندات
//         </button>
//       </div>
//     </div>
//   );
// }

// // sanitize SVG على جانب العميل
// function sanitizeSVGClient(raw: string): string {
//   if (!raw || !raw.includes("<svg")) return "";
//   let svg = raw.trim();
//   if (!svg.includes("xmlns")) svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
//   if (!svg.includes("viewBox")) svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
//   return svg;
// }

// /* ── IDENTITY TAB ── */
// function IdentityTab({ brand, primary, nameObjects }: { brand: any; primary: string; nameObjects: any[] }) {
//   const scores = [
//     { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
//     { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
//     { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
//     { l: "الملاءمة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
//   ];

//   return (
//     <div className="fade-up">
//       {/* Name suggestions with reasons */}
//       {nameObjects.length > 0 && nameObjects.some((n) => n.reason) && (
//         <div className="card">
//           <div className="clabel">مقترحات الأسماء المدروسة</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {nameObjects.map((n, i) => (
//               <div key={i} style={{ background: n.name === brand.recommendedName ? `${primary}0D` : "#0A0A14", border: `1px solid ${n.name === brand.recommendedName ? primary + "44" : "#1E1E2E"}`, borderRadius: 12, padding: "1rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".375rem" }}>
//                   <span style={{ fontSize: "1rem", fontWeight: 700, color: n.name === brand.recommendedName ? primary : "#F0EDE6" }}>{n.name}</span>
//                   {n.name === brand.recommendedName && (
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: primary, color: "#08080F", fontWeight: 700 }}>موصى به</span>
//                   )}
//                   {n.meaning && <span style={{ fontSize: ".72rem", color: "#8A8498" }}>— {n.meaning}</span>}
//                 </div>
//                 {n.reason && <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.6, margin: 0 }}>{n.reason}</p>}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Colors */}
//       <div className="card">
//         <div className="clabel">لوحة ألوان الهوية الموصى بها</div>
//         {brand?.colors?.length > 0 ? (
//           <>
//             <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", height: 60, marginBottom: "1rem" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: c.hex, padding: 4 }}>
//                   <span style={{ fontSize: "9px", color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)", fontWeight: 700 }}>{c.name}</span>
//                   <span style={{ fontSize: "8px", color: i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)", fontFamily: "monospace" }}>{c.hex}</span>
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div key={i} style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem" }}>
//                   <div style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: "1px solid rgba(255,255,255,.1)" }} />
//                   <span style={{ color: "#C4BDB5" }}>{c.name}</span>
//                   <span style={{ fontFamily: "monospace", color: "#8A8498" }}>{c.hex}</span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد لوحة الألوان</p>}
//       </div>

//       {/* Scores */}
//       <div className="card">
//         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
//           <div className="clabel" style={{ marginBottom: 0 }}>مؤشر قوة البراند</div>
//           <div style={{ textAlign: "center" }}>
//             <div style={{ fontSize: "2.75rem", fontWeight: 900, color: primary, lineHeight: 1, fontFamily: "Sora,sans-serif" }}>{brand?.score?.overall ?? 86}</div>
//             <div style={{ fontSize: ".6rem", color: "#8A8498" }}>/100</div>
//           </div>
//         </div>
//         {scores.map((s, i) => (
//           <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: ".65rem" }}>
//             <span style={{ fontSize: ".77rem", color: "#8A8498", width: 180, textAlign: "right", flexShrink: 0 }}>{s.l}</span>
//             <div style={{ flex: 1, height: 6, background: "#1E1E2E", borderRadius: 3, overflow: "hidden" }}>
//               <div style={{ height: "100%", background: `linear-gradient(90deg, ${primary}, ${primary}88)`, borderRadius: 3, width: `${s.v}%` }} />
//             </div>
//             <span style={{ fontSize: ".75rem", fontWeight: 700, color: primary, width: 24, textAlign: "left" }}>{s.v}</span>
//           </div>
//         ))}
//       </div>

//       {/* Strategy */}
//       <div className="card">
//         <div className="clabel">استراتيجية التموضع والجمهور</div>
//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//           {[["التموضع التسويقي", brand?.strategy?.positioning], ["الجمهور المستهدف", brand?.strategy?.audience]].map(([label, val]) => (
//             <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
//               <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>{label}</div>
//               <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{val ?? "—"}</div>
//             </div>
//           ))}
//         </div>
//         <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
//           <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>القيمة الفريدة المقترحة</div>
//           <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.value ?? "—"}</div>
//         </div>
//       </div>

//       {/* Story */}
//       <div className="card">
//         <div className="clabel">قصة العلامة التجارية</div>
//         <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>{brand?.story?.ar ?? brand?.story ?? "—"}</p>
//         {brand?.story?.en && <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>{brand.story.en}</p>}
//       </div>

//       {/* Typography */}
//       {brand?.typography && (
//         <div className="card">
//           <div className="clabel">هوية الخطوط المقترحة</div>
//           <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #1E1E2E" }}>
//             <div style={{ fontFamily: "Sora,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: primary, marginBottom: ".25rem" }}>{brand.typography.display}</div>
//             <div style={{ fontSize: "1.1rem", color: "rgba(240,237,230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>{brand.typography.arabic}</div>
//             <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand.typography.style}</div>
//           </div>
//         </div>
//       )}

//       {/* Voice & Messages */}
//       {(brand?.voice || brand?.messages) && (
//         <div className="card">
//           <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
//           {brand?.voice?.tone && <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span></p>}
//           {brand?.voice?.traits?.length > 0 && (
//             <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.25rem" }}>
//               {brand.voice.traits.map((t: string, i: number) => (
//                 <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem", fontWeight: 600 }}>{t}</span>
//               ))}
//             </div>
//           )}
//           {brand?.messages?.length > 0 && (
//             <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: "1rem" }}>
//               <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#8A8498", marginBottom: ".5rem" }}>الرسائل التسويقية:</p>
//               {brand.messages.map((m: string, i: number) => (
//                 <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".4rem 0" }}>
//                   <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: ".45rem", flexShrink: 0 }} />
//                   <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{m}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── LOGO TAB ── */
// function LogoTab({ logo, displayName, brand }: { logo: string; displayName: string; brand: any }) {
//   const [copied, setCopied] = useState(false);
//   const lightBg = brand?.colors?.[3]?.hex || "#F8F5F0";

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([logo], { type: "image/svg+xml" }));
//     a.download = `${displayName}-logo.svg`;
//     a.click();
//   };

//   const handleCopy = () => {
//     navigator.clipboard?.writeText(logo);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   if (!logo) return (
//     <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//       <p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار، جاري استخدام الشعار الاحتياطي</p>
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       <div className="card">
//         <div className="clabel">الشعار على خلفية فاتحة</div>
//         <div style={{ background: lightBg, borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
//           <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
//         </div>
//         <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
//           <button className="outline-btn" onClick={handleDownload}>⬇ تحميل SVG</button>
//           <button className="outline-btn" onClick={handleCopy}>{copied ? "✓ تم النسخ" : "📋 نسخ كود SVG"}</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">الشعار على خلفية داكنة</div>
//         <div style={{ background: "#08080F", border: "1px solid #1E1E2E", borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
//           <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">كود SVG المصدري</div>
//         <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.6, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//           {logo}
//         </pre>
//       </div>
//     </div>
//   );
// }

// /* ── SOCIAL TAB ── */
// function SocialTab({ social, displayName, projectId, userCredits, onSocialUpdate }: {
//   social: any;
//   displayName: string;
//   projectId?: string;
//   userCredits?: number;
//   onSocialUpdate?: (s: any) => void;
// }) {
//   const [ptab, setPtab] = useState<"map" | "posts" | "videos" | "ready" | "plan">("map");
//   const [generating, setGenerating] = useState(false);
//   const [genMsg, setGenMsg] = useState("");
//   const [filterCat, setFilterCat] = useState("الكل");

//   const igPosts   = social?.instagram ?? [];
//   const twTweets  = social?.twitter   ?? [];
//   const contentMap  = social?.contentMap  ?? [];
//   const postIdeas   = social?.postIdeas   ?? [];
//   const videoIdeas  = social?.videoIdeas  ?? [];
//   const weeklyPlan  = social?.strategy?.weeklyPlan ?? [];

//   const categories = ["الكل", ...Array.from(new Set(postIdeas.map((p: any) => p.category).filter(Boolean))) as string[]];
//   const filteredPosts = filterCat === "الكل" ? postIdeas : postIdeas.filter((p: any) => p.category === filterCat);

//   const catColor: Record<string, string> = {
//     "Lifestyle": "#C9973A",
//     "عرض المنتج/الخدمة": "#60A5FA",
//     "قصص البراند": "#4ADE80",
//     "عروض وتفاعل": "#F87171",
//   };

//   const typeIcon: Record<string, string> = {
//     "صورة": "🖼",
//     "فيديو": "🎬",
//     "كاروسيل": "📑",
//     "Reel": "🎞",
//   };

//   const handleGenerateMore = async () => {
//     if (!projectId) return;
//     setGenerating(true);
//     setGenMsg("جاري توليد محتوى إضافي...");
//     try {
//       const res = await fetch(`/api/projects/${projectId}/social/generate`, { method: "POST" });
//       const data = await res.json();
//       if (!res.ok) {
//         setGenMsg(data.message || "فشل التوليد");
//       } else {
//         setGenMsg(`✓ تم التوليد! رصيدك المتبقي: ${data.creditsLeft}`);
//         onSocialUpdate?.(data.social);
//         setTimeout(() => setGenMsg(""), 3000);
//       }
//     } catch {
//       setGenMsg("خطأ في الاتصال");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const SUBTABS = [
//     { id: "map",    label: "🗺 خريطة المحتوى" },
//     { id: "posts",  label: "💡 أفكار بوستات" },
//     { id: "videos", label: "🎬 أفكار فيديوهات" },
//     { id: "ready",  label: "📋 منشورات جاهزة" },
//     { id: "plan",   label: "📅 خطة أسبوعية" },
//   ];

//   return (
//     <div className="fade-up">
//       {/* Sub-tabs */}
//       <div style={{ display: "flex", gap: ".3rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1rem", scrollbarWidth: "none" }}>
//         {SUBTABS.map(({ id, label }) => (
//           <button key={id} onClick={() => setPtab(id as any)}
//             style={{ padding: ".4rem .85rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: ptab === id ? "#C9973A" : "transparent", color: ptab === id ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: ptab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
//             {label}
//           </button>
//         ))}

//         {/* زر توليد إضافي بالكريديت */}
//         <button onClick={handleGenerateMore} disabled={generating}
//           style={{ marginRight: "auto", padding: ".4rem 1rem", borderRadius: 20, border: "1.5px solid #C9973A44", background: generating ? "#1E1E2E" : "transparent", color: generating ? "#8A8498" : "#C9973A", fontFamily: "Tajawal,sans-serif", fontSize: ".75rem", fontWeight: 600, cursor: generating ? "default" : "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: ".35rem" }}>
//           {generating ? "⏳" : "✦"} توليد إضافي <span style={{ padding: ".1rem .4rem", borderRadius: 4, background: "#C9973A22", fontSize: ".65rem" }}>1 كريديت</span>
//         </button>
//       </div>

//       {genMsg && (
//         <div style={{ background: genMsg.startsWith("✓") ? "#4ADE8011" : "#F8717111", border: `1px solid ${genMsg.startsWith("✓") ? "#4ADE8033" : "#F8717133"}`, borderRadius: 8, padding: ".6rem 1rem", marginBottom: ".75rem", fontSize: ".8rem", color: genMsg.startsWith("✓") ? "#4ADE80" : "#F87171", textAlign: "center" }}>
//           {genMsg}
//         </div>
//       )}

//       {/* ── MAP TAB ── */}
//       {ptab === "map" && (
//         <div>
//           <div className="card">
//             <div className="clabel">خريطة المحتوى — توزيع البوستات</div>

//             {contentMap.length === 0 ? (
//               <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لم يتم توليد خريطة المحتوى</p>
//             ) : (
//               <>
//                 {/* Pie visual */}
//                 <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
//                   <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
//                     <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
//                       {(() => {
//                         let offset = 0;
//                         return contentMap.map((seg: any, i: number) => {
//                           const val = seg.pct;
//                           const circ = 2 * Math.PI * 15.9;
//                           const dash = (val / 100) * circ;
//                           const gap = circ - dash;
//                           const el = (
//                             <circle key={i} cx="18" cy="18" r="15.9" fill="none"
//                               stroke={seg.color || "#C9973A"} strokeWidth="3.2"
//                               strokeDasharray={`${dash} ${gap}`}
//                               strokeDashoffset={-offset * circ / 100}
//                             />
//                           );
//                           offset += val;
//                           return el;
//                         });
//                       })()}
//                     </svg>
//                     <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
//                       <span style={{ fontSize: ".62rem", color: "#8A8498", lineHeight: 1 }}>محتوى</span>
//                       <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#F0EDE6" }}>متنوع</span>
//                     </div>
//                   </div>

//                   <div style={{ flex: 1, minWidth: 160 }}>
//                     {contentMap.map((seg: any, i: number) => (
//                       <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
//                         <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
//                         <span style={{ fontSize: ".8rem", color: "#C4BDB5", flex: 1 }}>{seg.category}</span>
//                         <span style={{ fontSize: ".8rem", fontWeight: 700, color: seg.color }}>{seg.pct}%</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Category details */}
//                 <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//                   {contentMap.map((seg: any, i: number) => (
//                     <div key={i} style={{ background: "#0A0A14", borderRadius: 12, padding: "1rem", borderRight: `3px solid ${seg.color}` }}>
//                       <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
//                         <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
//                         <span style={{ fontSize: ".85rem", fontWeight: 700, color: seg.color }}>{seg.category}</span>
//                         <span style={{ fontSize: ".72rem", color: "#3A3650", marginRight: "auto" }}>{seg.pct}% من المحتوى</span>
//                       </div>
//                       {seg.desc && <p style={{ fontSize: ".78rem", color: "#8A8498", marginBottom: ".5rem", lineHeight: 1.6 }}>{seg.desc}</p>}
//                       {seg.examples?.length > 0 && (
//                         <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
//                           {seg.examples.map((ex: string, j: number) => (
//                             <div key={j} style={{ display: "flex", gap: ".4rem", alignItems: "flex-start" }}>
//                               <span style={{ color: seg.color, fontSize: ".7rem", marginTop: 2 }}>›</span>
//                               <span style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.55 }}>{ex}</span>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── POST IDEAS TAB ── */}
//       {ptab === "posts" && (
//         <div>
//           {/* Category filter */}
//           {categories.length > 1 && (
//             <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
//               {categories.map((cat) => (
//                 <button key={cat} onClick={() => setFilterCat(cat)}
//                   style={{ padding: ".3rem .7rem", borderRadius: 16, border: `1px solid ${filterCat === cat ? (catColor[cat] || "#C9973A") : "#1E1E2E"}`, background: filterCat === cat ? (catColor[cat] || "#C9973A") + "22" : "transparent", color: filterCat === cat ? (catColor[cat] || "#C9973A") : "#8A8498", fontSize: ".72rem", cursor: "pointer" }}>
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           )}

//           {filteredPosts.length === 0 ? (
//             <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
//               <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار البوستات</p>
//             </div>
//           ) : (
//             <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//               {filteredPosts.map((p: any, i: number) => {
//                 const cc = catColor[p.category] || "#C9973A";
//                 return (
//                   <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.125rem", borderRight: `3px solid ${cc}` }}>
//                     {/* Header */}
//                     <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
//                       <span style={{ fontSize: "1rem" }}>{typeIcon[p.type] || "📌"}</span>
//                       <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{p.title}</span>
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: cc + "22", color: cc, border: `1px solid ${cc}44` }}>{p.type}</span>
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: "#1E1E2E", color: "#8A8498" }}>{p.platform}</span>
//                     </div>

//                     {/* Visual description */}
//                     {p.visual && (
//                       <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem", borderRight: `2px solid ${cc}66` }}>
//                         <div style={{ fontSize: ".6rem", color: cc, fontWeight: 700, marginBottom: ".25rem" }}>🎨 المشهد البصري</div>
//                         <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6, margin: 0 }}>{p.visual}</p>
//                       </div>
//                     )}

//                     {/* Caption */}
//                     {p.caption && (
//                       <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption}</p>
//                     )}

//                     {/* Hashtags */}
//                     {p.hashtags && (
//                       <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7 }}>{p.hashtags}</p>
//                     )}

//                     {/* Category badge */}
//                     {p.category && (
//                       <div style={{ marginTop: ".5rem" }}>
//                         <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: cc + "15", color: cc, border: `1px solid ${cc}33` }}>{p.category}</span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── VIDEO IDEAS TAB ── */}
//       {ptab === "videos" && (
//         <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//           {videoIdeas.length === 0 ? (
//             <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
//               <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار الفيديوهات</p>
//             </div>
//           ) : videoIdeas.map((v: any, i: number) => (
//             <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem" }}>
//               {/* Header */}
//               <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".875rem" }}>
//                 <span style={{ fontSize: "1.1rem" }}>🎬</span>
//                 <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{v.concept || `فكرة فيديو ${i + 1}`}</span>
//                 <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#69C9D033", color: "#69C9D0" }}>{v.platform}</span>
//                 <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#1E1E2E", color: "#8A8498" }}>{v.duration}</span>
//               </div>

//               {/* Hook */}
//               {v.hook && (
//                 <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem" }}>
//                   <div style={{ fontSize: ".6rem", color: "#C9973A", fontWeight: 700, marginBottom: ".2rem" }}>⚡ الجملة الافتتاحية (أول 3 ثواني)</div>
//                   <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#F0EDE6", margin: 0 }}>"{v.hook}"</p>
//                 </div>
//               )}

//               {/* Scenes */}
//               {v.scenes?.length > 0 && (
//                 <div style={{ marginBottom: ".625rem" }}>
//                   <div style={{ fontSize: ".6rem", color: "#8A8498", fontWeight: 700, marginBottom: ".375rem" }}>🎞 المشاهد</div>
//                   {v.scenes.map((s: string, j: number) => (
//                     <div key={j} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", padding: ".3rem 0", borderBottom: j < v.scenes.length - 1 ? "1px solid #1E1E2E" : "none" }}>
//                       <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#1E1E2E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", color: "#8A8498", flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
//                       <span style={{ fontSize: ".8rem", color: "#C4BDB5", lineHeight: 1.55 }}>{s}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Music + CTA */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
//                 {v.music && (
//                   <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}>
//                     <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>🎵 نوع الموسيقى</div>
//                     <div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{v.music}</div>
//                   </div>
//                 )}
//                 {v.cta && (
//                   <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}>
//                     <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>📢 نداء الإجراء</div>
//                     <div style={{ fontSize: ".78rem", color: "#4ADE80" }}>{v.cta}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* ── READY POSTS TAB ── */}
//       {ptab === "ready" && (
//         <div>
//           <div className="card">
//             <div className="clabel">منشورات جاهزة للنسخ والنشر</div>

//             {/* Instagram */}
//             {igPosts.length > 0 && (
//               <div style={{ marginBottom: "1.25rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>IG</div>
//                   <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Instagram</span>
//                 </div>
//                 {igPosts.map((p: any, i: number) => (
//                   <div key={i} style={{ background: "linear-gradient(180deg,#13131E,#0A0A14)", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem" }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
//                       <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                         {displayName.slice(0, 2).toUpperCase()}
//                       </div>
//                       <div>
//                         <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
//                         <div style={{ fontSize: ".6rem", color: "#3A3650" }}>حساب رسمي</div>
//                       </div>
//                     </div>
//                     <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption ?? p.text ?? ""}</p>
//                     <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags ?? ""}</p>
//                     {p.theme && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)" }}>{p.theme}</span>}
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Twitter */}
//             {twTweets.length > 0 && (
//               <div>
//                 <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
//                   <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1D9BF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>X</div>
//                   <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Twitter / X</span>
//                 </div>
//                 {twTweets.map((t: any, i: number) => (
//                   <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0" }}>
//                     <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{t.text ?? t.tweet ?? ""}</p>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {igPosts.length === 0 && twTweets.length === 0 && (
//               <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لا يوجد منشورات جاهزة</p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ── WEEKLY PLAN TAB ── */}
//       {ptab === "plan" && (
//         <div>
//           <div className="card">
//             <div className="clabel">خطة النشر الأسبوعية</div>

//             {weeklyPlan.length > 0 ? (
//               <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1.25rem" }}>
//                 {weeklyPlan.map((day: any, i: number) => (
//                   <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", alignItems: "center", gap: ".75rem", padding: ".75rem", background: "#0A0A14", borderRadius: 10, border: "1px solid #1E1E2E" }}>
//                     <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#C9973A" }}>{day.day}</span>
//                     <span style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{day.content || "—"}</span>
//                     <span style={{ fontSize: ".7rem", color: "#8A8498", background: "#1E1E2E", padding: ".15rem .45rem", borderRadius: 5, whiteSpace: "nowrap" }}>{day.platform || ""}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p style={{ color: "#3A3650", fontSize: ".82rem", marginBottom: "1rem" }}>لم يتم توليد الخطة الأسبوعية</p>
//             )}
//           </div>

//           {social?.strategy && (
//             <div className="card">
//               <div className="clabel">إحصائيات الاستراتيجية</div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem", marginBottom: ".75rem" }}>
//                 {[["أفضل أوقات النشر", social.strategy.bestTimes], ["معدل النشر", social.strategy.frequency], ["نبرة المحتوى", social.strategy.tone]].filter(([, v]) => v).map(([label, val]) => (
//                   <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
//                     <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>{label}</div>
//                     <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{val}</div>
//                   </div>
//                 ))}
//               </div>
//               {social.strategy.pillars?.length > 0 && (
//                 <div>
//                   <p style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".5rem" }}>أعمدة المحتوى:</p>
//                   <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//                     {social.strategy.pillars.map((p: string, i: number) => (
//                       <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)", fontSize: ".75rem" }}>{p}</span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }



// /* ── LANDING TAB ── */
// function LandingTab({ landing, displayName, primary, secondary }: { landing: any; displayName: string; primary: string; secondary: string }) {
//   const [view, setView] = useState("preview");

//   const stats = landing?.stats ?? [
//     { value: "100+", label: "عميل راضٍ" },
//     { value: "98%", label: "معدل الرضا" },
//     { value: "24/7", label: "دعم مستمر" },
//   ];

//   const htmlCode = `<!DOCTYPE html>
// <html lang="ar" dir="rtl">
// <head>
// <meta charset="UTF-8">
// <meta name="viewport" content="width=device-width,initial-scale=1">
// <title>${displayName}</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Tajawal',sans-serif;direction:rtl;background:${secondary};color:#F0EDE6}
// nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:${secondary}ee;backdrop-filter:blur(12px);z-index:10}
// .logo{font-size:1.25rem;font-weight:900;color:${primary}}
// .nav-cta{padding:.5rem 1.25rem;border-radius:8px;background:${primary};color:${secondary};font-weight:700;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:.9rem}
// .hero{padding:5rem 2rem 4rem;text-align:center;max-width:700px;margin:0 auto}
// .hero h1{font-size:2.75rem;font-weight:900;margin-bottom:1.25rem;line-height:1.25;color:#ffffff}
// .hero p{font-size:1.05rem;color:rgba(240,237,230,.7);margin-bottom:2.5rem;line-height:1.8}
// .hero-btn{display:inline-block;padding:1rem 2.75rem;border-radius:14px;background:${primary};color:${secondary};font-weight:700;font-size:1.05rem;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;text-decoration:none;transition:opacity .2s}
// .hero-btn:hover{opacity:.9}
// .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:2rem;max-width:700px;margin:0 auto;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
// .stat{text-align:center}.stat-val{font-size:2rem;font-weight:900;color:${primary};line-height:1}.stat-lbl{font-size:.82rem;color:rgba(240,237,230,.5);margin-top:.25rem}
// .feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;padding:3rem 2rem;max-width:900px;margin:0 auto}
// .feat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.5rem;transition:border-color .2s}
// .feat:hover{border-color:${primary}44}
// .feat-icon{font-size:2.25rem;margin-bottom:.875rem}
// .feat h3{font-size:1rem;font-weight:700;color:${primary};margin-bottom:.5rem}
// .feat p{font-size:.875rem;color:rgba(240,237,230,.6);line-height:1.7}
// .testimonial{padding:4rem 2rem;text-align:center;max-width:600px;margin:0 auto}
// .quote-mark{font-size:4rem;color:${primary};opacity:.3;line-height:.5;margin-bottom:1rem}
// .quote-text{font-size:1.1rem;font-style:italic;color:rgba(240,237,230,.85);line-height:1.8;margin-bottom:1.5rem}
// .quote-author{font-size:.85rem;color:${primary};font-weight:700}
// .quote-role{font-size:.75rem;color:rgba(240,237,230,.4);margin-top:.25rem}
// .cta-sec{padding:5rem 2rem;text-align:center;background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border-top:1px solid rgba(255,255,255,.07)}
// .cta-sec h2{font-size:2.25rem;font-weight:900;margin-bottom:.875rem;color:#fff}
// .cta-sec p{color:rgba(240,237,230,.6);margin-bottom:2rem;font-size:1rem}
// footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.07);text-align:center;font-size:.78rem;color:rgba(240,237,230,.25)}
// </style>
// </head>
// <body>
// <nav>
//   <div class="logo">${displayName}</div>
//   <button class="nav-cta">${landing?.hero?.cta || "تواصل معنا"}</button>
// </nav>

// <div class="hero">
//   <h1>${landing?.hero?.headline || landing?.headline || "نحن هنا لخدمتك"}</h1>
//   <p>${landing?.hero?.subheadline || landing?.subheadline || ""}</p>
//   <button class="hero-btn">${landing?.hero?.cta || "ابدأ الآن"}</button>
// </div>

// <div class="stats">
// ${stats.map((s: any) => `  <div class="stat"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("\n")}
// </div>

// <div class="feats">
// ${(landing?.features || landing?.sections || []).map((f: any) => `  <div class="feat"><div class="feat-icon">${f.emoji || "✦"}</div><h3>${f.title || ""}</h3><p>${f.desc || f.description || ""}</p></div>`).join("\n")}
// </div>

// ${landing?.testimonial?.text ? `<div class="testimonial">
//   <div class="quote-mark">"</div>
//   <p class="quote-text">${landing.testimonial.text}</p>
//   <div class="quote-author">${landing.testimonial.name || ""}</div>
//   <div class="quote-role">${landing.testimonial.role || ""}</div>
// </div>` : ""}

// <div class="cta-sec">
//   <h2>${landing?.cta?.headline || "انضم إلينا اليوم"}</h2>
//   <p>${landing?.cta?.subheadline || ""}</p>
//   <button class="hero-btn">${landing?.cta?.button || "ابدأ الآن"}</button>
// </div>

// <footer>© ${new Date().getFullYear()} ${displayName} — جميع الحقوق محفوظة</footer>
// </body>
// </html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlCode], { type: "text/html" }));
//     a.download = `${displayName}-landing.html`;
//     a.click();
//   };

  

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem", alignItems: "center" }}>
//         {[["preview", "👁 معاينة"], ["code", "{ } الكود"]].map(([k, l]) => (
//           <button key={k} onClick={() => setView(k)} style={{ padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: view === k ? "#1E1E2E" : "transparent", color: view === k ? "#F0EDE6" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer" }}>
//             {l}
//           </button>
//         ))}
//         <button className="gold-btn" style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={handleDownload}>⬇ تحميل HTML</button>
//       </div>

//       {view === "preview" ? (
//         <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//           <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
//             <div style={{ display: "flex", gap: 5 }}>
//               {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
//             </div>
//             <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>{displayName.toLowerCase().replace(/\s+/g, "-")}.html</span>
//             <div style={{ width: 40 }} />
//           </div>
//           <iframe title="Landing Page Preview" srcDoc={htmlCode} style={{ width: "100%", height: "600px", border: "none" }} />
//         </div>
//       ) : (
//         <div className="card">
//           <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", maxHeight: "450px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//             {htmlCode}
//           </pre>
//         </div>
//       )}
//     </div>
//   );


  
// }


// /* ── BROCHURE TAB ── */
// function BrochureTab({ brand, brochureContent, displayName, primary, secondary }: { brand: any; brochureContent: any; displayName: string; primary: string; secondary: string }) {
//   const taglineAr = brand?.tagline?.ar ?? brand?.tagline ?? "";
//   const taglineEn = brand?.tagline?.en ?? "";

//   // استخدم محتوى البروشور المخصص إن وجد، وإلا fallback للـ brand data
//   const intro = brochureContent?.intro ?? brand?.story?.ar ?? brand?.story ?? "";
//   const services = brochureContent?.services ?? [];
//   const whyUs = brochureContent?.whyUs ?? brand?.messages ?? [];
//   const sections = brochureContent?.sections ?? [];
//   const contact = brochureContent?.contact ?? {};
//   const brocheureHeadline = brochureContent?.headline ?? displayName;

//   const htmlBrochure = `<!DOCTYPE html>
// <html lang="ar" dir="rtl">
// <head>
// <meta charset="UTF-8">
// <title>${displayName} — بروشور الشركة</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Sora:wght@400;700&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Tajawal',sans-serif;direction:rtl;background:#f4f4f8;color:#1A1A28;padding:2rem;max-width:820px;margin:0 auto}

// .cover{background:${secondary};border-radius:18px 18px 0 0;padding:4rem 3rem;text-align:center;position:relative;overflow:hidden;color:#F0EDE6}
// .cover-pattern{position:absolute;inset:0;background-image:radial-gradient(${primary}22 1.5px,transparent 1.5px);background-size:22px 22px;pointer-events:none}
// .cover-rel{position:relative}
// .cover-name{font-family:'Sora',sans-serif;font-size:3.5rem;font-weight:900;color:${primary};line-height:1}
// .cover-tagline{font-size:1.15rem;color:rgba(240,237,230,.75);margin-top:.75rem;font-weight:300}
// .cover-tagline-en{font-size:.85rem;color:rgba(240,237,230,.35);font-style:italic;margin-top:.35rem}

// .intro-band{background:${primary};padding:1.25rem 3rem;display:flex;align-items:center;justify-content:center}
// .intro-text{color:${secondary};font-size:.95rem;line-height:1.75;text-align:center;font-weight:500}

// .body{background:#fff;padding:2.5rem 3rem;border-left:1px solid #e8e8f0;border-right:1px solid #e8e8f0}

// .section-title{font-size:.65rem;font-weight:900;letter-spacing:2px;color:${primary};text-transform:uppercase;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid ${primary}22}

// .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
// .service-card{background:#f8f8fc;border-radius:12px;padding:1.25rem;border:1px solid #e8e8f0;text-align:center}
// .service-icon{font-size:1.75rem;margin-bottom:.5rem}
// .service-name{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.25rem}
// .service-brief{font-size:.75rem;color:#6B6478;line-height:1.5}

// .why-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:2rem}
// .why-item{display:flex;align-items:flex-start;gap:.625rem;padding:.875rem;background:#f8f8fc;border-radius:10px;border-right:3px solid ${primary}}
// .why-dot{width:8px;height:8px;border-radius:50%;background:${primary};margin-top:.375rem;flex-shrink:0}
// .why-text{font-size:.82rem;color:#3A3650;line-height:1.6}

// .sections-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem}
// .section-block{padding:1.25rem;border-radius:12px;background:#f8f8fc;border:1px solid #e8e8f0;border-top:3px solid ${primary}}
// .section-block h4{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.5rem}
// .section-block p{font-size:.78rem;color:#6B6478;line-height:1.65}

// .colors-strip{display:flex;height:10px;border-radius:0}
// .color-sw{flex:1}

// .footer-band{background:${secondary};padding:1.5rem 3rem;border-radius:0 0 18px 18px;display:flex;justify-content:space-between;align-items:center}
// .footer-brand{font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:${primary}}
// .footer-contact{font-size:.82rem;color:rgba(240,237,230,.5);text-align:center}
// .footer-dots{display:flex;gap:5px}
// .footer-dot{width:10px;height:10px;border-radius:50%}
// </style>
// </head>
// <body>

// <div class="cover">
//   <div class="cover-pattern"></div>
//   <div class="cover-rel">
//     <div class="cover-name">${brocheureHeadline}</div>
//     <div class="cover-tagline">${taglineAr}</div>
//     <div class="cover-tagline-en">${taglineEn}</div>
//   </div>
// </div>

// <div class="intro-band">
//   <div class="intro-text">${intro}</div>
// </div>

// <div class="body">
//   ${services.length > 0 ? `
//   <div class="section-title">خدماتنا</div>
//   <div class="services-grid">
//     ${services.map((s: any) => `<div class="service-card"><div class="service-icon">${s.icon || "✦"}</div><div class="service-name">${s.name || ""}</div><div class="service-brief">${s.brief || ""}</div></div>`).join("")}
//   </div>` : ""}

//   ${sections.length > 0 ? `
//   <div class="section-title">معلومات عن المشروع</div>
//   <div class="sections-grid">
//     ${sections.map((s: any) => `<div class="section-block"><h4>${s.title || ""}</h4><p>${s.content || ""}</p></div>`).join("")}
//   </div>` : `
//   <div class="section-title">عن البراند</div>
//   <div class="sections-grid">
//     ${[["التموضع التسويقي", brand?.strategy?.positioning ?? ""], ["الجمهور المستهدف", brand?.strategy?.audience ?? ""], ["القيمة الفريدة", brand?.strategy?.value ?? ""], ["نبرة الصوت", brand?.voice?.tone ?? ""]].map(([t, c]) => `<div class="section-block"><h4>${t}</h4><p>${c}</p></div>`).join("")}
//   </div>`}

//   ${whyUs.length > 0 ? `
//   <div class="section-title">لماذا تختارنا؟</div>
//   <div class="why-grid">
//     ${whyUs.map((w: string) => `<div class="why-item"><div class="why-dot"></div><div class="why-text">${w}</div></div>`).join("")}
//   </div>` : ""}

//   ${contact?.tagline ? `
//   <div style="text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:12px;border:1px solid #e8e8f0">
//     <div style="font-size:1rem;font-weight:700;color:#1A1A28;margin-bottom:.75rem">${contact.tagline}</div>
//     <div style="display:inline-block;padding:.75rem 2rem;background:${primary};color:${secondary};border-radius:10px;font-weight:700;font-size:.9rem">${contact.cta || "تواصل معنا"}</div>
//   </div>` : ""}
// </div>

// <div class="colors-strip">
//   ${(brand?.colors || []).map((c: any) => `<div class="color-sw" style="background:${c.hex}"></div>`).join("")}
// </div>

// <div class="footer-band">
//   <div class="footer-brand">${displayName}</div>
//   <div class="footer-contact">Brand Kit © ${new Date().getFullYear()}</div>
//   <div class="footer-dots">
//     ${(brand?.colors || []).map((c: any) => `<div class="footer-dot" style="background:${c.hex}"></div>`).join("")}
//   </div>
// </div>

// </body>
// </html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([htmlBrochure], { type: "text/html" }));
//     a.download = `${displayName}-brochure.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
//         <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تنزيل بروشور HTML</button>
//       </div>
//       <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//         <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
//           <div style={{ display: "flex", gap: 5 }}>
//             {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
//           </div>
//           <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>brochure-preview.html</span>
//           <div style={{ width: 40 }} />
//         </div>
//         <iframe title="Brochure Preview" srcDoc={htmlBrochure} style={{ width: "100%", height: "600px", border: "none", background: "#f4f4f8" }} />
//       </div>
//     </div>
//   );
// }

// /* ── COMPETITORS TAB ── */
// function CompetitorsTab({ competitors, primary }: { competitors: any; primary: string }) {
//   if (!competitors || Object.keys(competitors).length === 0) {
//     return (
//       <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//         <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
//         <p style={{ color: "#3A3650", fontSize: ".85rem" }}>لم يتم توليد تحليل المنافسين</p>
//       </div>
//     );
//   }

//   const levelColor = (level: string) => {
//     if (level?.includes("شرس") || level?.includes("عالي")) return "#F87171";
//     if (level?.includes("متوسط")) return "#FBBF24";
//     return "#4ADE80";
//   };

//   const sizeColor = (size: string) => {
//     if (size?.includes("ضخم")) return "#A78BFA";
//     if (size?.includes("كبير")) return "#60A5FA";
//     if (size?.includes("متوسط")) return "#FBBF24";
//     return "#4ADE80";
//   };

//   return (
//     <div className="fade-up">
//       {/* Market Overview */}
//       <div className="card">
//         <div className="clabel">نظرة عامة على السوق</div>
//         <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8, marginBottom: "1.25rem" }}>{competitors.marketOverview ?? "—"}</p>

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
//             <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>حجم السوق</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: 700, color: sizeColor(competitors.marketSize) }}>{competitors.marketSize ?? "—"}</div>
//           </div>
//           <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
//             <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>مستوى المنافسة</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: 700, color: levelColor(competitors.competitionLevel) }}>{competitors.competitionLevel ?? "—"}</div>
//           </div>
//         </div>
//       </div>

//       {/* Competitors List */}
//       {competitors.competitors?.length > 0 && (
//         <div className="card">
//           <div className="clabel">المنافسون في السوق</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {competitors.competitors.map((c: any, i: number) => (
//               <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1.125rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".625rem" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//                     <span style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{c.name}</span>
//                     {c.website && (
//                       <span style={{ fontSize: ".65rem", color: "#60A5FA", fontFamily: "monospace" }}>{c.website}</span>
//                     )}
//                   </div>
//                   <div style={{ display: "flex", gap: ".375rem" }}>
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: c.type?.includes("مباشر") ? "#F8717115" : "#4ADE8015", color: c.type?.includes("مباشر") ? "#F87171" : "#4ADE80", border: `1px solid ${c.type?.includes("مباشر") ? "#F8717133" : "#4ADE8033"}` }}>{c.type ?? "منافس"}</span>
//                     {c.marketShare && (
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#C9973A15", color: "#C9973A", border: "1px solid #C9973A33" }}>{c.marketShare}</span>
//                     )}
//                   </div>
//                 </div>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
//                   <div>
//                     <div style={{ fontSize: ".6rem", color: "#4ADE80", marginBottom: ".25rem", fontWeight: 700 }}>✓ نقاط القوة</div>
//                     <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.strengths ?? "—"}</p>
//                   </div>
//                   <div>
//                     <div style={{ fontSize: ".6rem", color: "#F87171", marginBottom: ".25rem", fontWeight: 700 }}>✗ نقاط الضعف</div>
//                     <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.weaknesses ?? "—"}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Gaps & Opportunities */}
//       {competitors.gaps?.length > 0 && (
//         <div className="card">
//           <div className="clabel">فرص في السوق غير مستغلة</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
//             {competitors.gaps.map((g: string, i: number) => (
//               <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: "#4ADE8008", border: "1px solid #4ADE8022", borderRadius: 9 }}>
//                 <span style={{ color: "#4ADE80", flexShrink: 0, fontSize: ".9rem" }}>💡</span>
//                 <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{g}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Differentiators */}
//       {competitors.differentiators?.length > 0 && (
//         <div className="card">
//           <div className="clabel">ما يجعل براندك مختلفاً</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
//             {competitors.differentiators.map((d: string, i: number) => (
//               <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: `${primary}08`, border: `1px solid ${primary}22`, borderRadius: 9 }}>
//                 <span style={{ color: primary, flexShrink: 0 }}>✦</span>
//                 <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{d}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Search Keywords */}
//       {competitors.searchKeywords?.length > 0 && (
//         <div className="card">
//           <div className="clabel">كلمات البحث المقترحة لـ SEO</div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//             {competitors.searchKeywords.map((k: string, i: number) => (
//               <span key={i} style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".78rem", background: "#0A0A14", border: "1px solid #1E1E2E", color: "#C4BDB5", fontFamily: "monospace" }}>🔍 {k}</span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Strategic Recommendation */}
//       {competitors.recommendation && (
//         <div className="card" style={{ borderColor: `${primary}33` }}>
//           <div className="clabel" style={{ color: primary }}>التوصية الاستراتيجية للدخول للسوق</div>
//           <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.8 }}>{competitors.recommendation}</p>
//         </div>
//       )}
//     </div>
//   );
// }








































import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const STYLES = [
  { id: "modern", ar: "عصري", en: "Modern" },
  { id: "luxury", ar: "فاخر", en: "Luxury" },
  { id: "youth", ar: "شبابي", en: "Youthful" },
  { id: "minimal", ar: "بسيط", en: "Minimal" },
  { id: "arabic", ar: "تراثي", en: "Heritage" },
  { id: "tech", ar: "تقني", en: "Tech" },
];

const COLORS = [
  { id: "gold", ar: "ذهبي", hex: "#C9973A" },
  { id: "navy", ar: "كحلي", hex: "#1B3A6B" },
  { id: "green", ar: "أخضر", hex: "#16A34A" },
  { id: "red", ar: "أحمر", hex: "#DC2626" },
  { id: "purple", ar: "بنفسجي", hex: "#7C3AED" },
  { id: "teal", ar: "تيل", hex: "#0D9488" },
  { id: "black", ar: "أسود", hex: "#1A1A1A" },
  { id: "coral", ar: "مرجاني", hex: "#EA580C" },
];

const PHASES = [
  { key: "brand", label: "بناء الهوية والاستراتيجية", pct: 25 },
  { key: "logo", label: "تصميم الشعار SVG", pct: 45 },
  { key: "social", label: "توليد محتوى السوشيال", pct: 65 },
  { key: "landing", label: "بناء الـ Landing Page", pct: 80 },
  { key: "competitors", label: "تحليل المنافسين والسوق", pct: 95 },
];

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "wizard" | "generating" | "result">("list");

  const [idea, setIdea] = useState("");
  const [bname, setBname] = useState("");
  const [style, setStyle] = useState("");
  const [cols, setCols] = useState<string[]>([]);
  const [err, setErr] = useState("");

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [phase, setPhase] = useState(0);
  const [pct, setPct] = useState(0);

  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState("identity");

  // ── Delete state ──
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const navigate = useNavigate();
  const pollTimerRef = useRef<any>(null);
  const fakeProgressTimerRef = useRef<any>(null);

  const safeSetResult = (data: any) => {
    console.log("RESULT API RESPONSE:", JSON.stringify(data, null, 2));
    if (!data) return false;
    const extracted = data?.result ?? data?.data ?? data;
    console.log("RESULT EXTRACTED keys:", Object.keys(extracted || {}));
    setResult(extracted);
    return true;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const userRes = await fetch("/api/auth/me");
        if (!userRes.ok) { navigate("/login"); return; }
        const userData = await userRes.json();
        setUser(userData.user);
        const projRes = await fetch("/api/projects");
        if (projRes.ok) {
          const projData = await projRes.json();
          setProjects(projData.projects || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
    return () => { stopAllTimers(); };
  }, [navigate]);

  const stopAllTimers = () => {
    if (pollTimerRef.current) { clearInterval(pollTimerRef.current); pollTimerRef.current = null; }
    if (fakeProgressTimerRef.current) { clearInterval(fakeProgressTimerRef.current); fakeProgressTimerRef.current = null; }
  };

  const toggleColor = (id: string) =>
    setCols((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id].slice(0, 3));

  const handleGenerate = async () => {
    if (!idea.trim()) return setErr("الرجاء إدخال وصف فكرة مشروعك");
    if (!style) return setErr("الرجاء اختيار الأسلوب البصري");
    setErr("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          customBrandName: bname,
          selectedStyle: style,
          selectedColors: cols,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || "حدث خطأ أثناء إطلاق طلب التوليد"); return; }

      setCurrentProjectId(data.projectId);
      setView("generating");
      setPhase(0);
      setPct(5);

      let currentPct = 5;
      fakeProgressTimerRef.current = setInterval(() => {
        currentPct += Math.floor(Math.random() * 3) + 1;
        if (currentPct > 90) currentPct = 90;
        setPct(currentPct);
        if (currentPct < 25) setPhase(0);
        else if (currentPct < 45) setPhase(1);
        else if (currentPct < 65) setPhase(2);
        else if (currentPct < 80) setPhase(3);
        else setPhase(4);
      }, 500);

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
          stopAllTimers();
          setPct(100);
          setPhase(4);
          setTimeout(async () => {
            try {
              const resultRes = await fetch(`/api/projects/${projectId}/result`);
              if (!resultRes.ok) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); return; }
              const resultData = await resultRes.json();
              const success = safeSetResult(resultData);
              if (success) { setView("result"); setTab("identity"); fetchProjectsList(); }
              else { setErr("البيانات المستلمة غير مكتملة"); setView("wizard"); }
            } catch (e) { setErr("فشل تحميل نتائج البراند"); setView("wizard"); }
          }, 1000);
        } else if (status === "failed") {
          stopAllTimers();
          setErr("فشل الذكاء الاصطناعي، يرجى إعادة المحاولة بوصف أكثر تفصيلاً.");
          setView("wizard");
        }
      } catch (e) { console.error("Polling error:", e); }
    }, 2000);
  };

  const fetchProjectsList = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) { const data = await res.json(); setProjects(data.projects || []); }
    } catch (e) { console.error(e); }
  };

  const handleViewResult = async (projId: string) => {
    setLoading(true);
    try {
      const resultRes = await fetch(`/api/projects/${projId}/result`);
      if (!resultRes.ok) { alert("فشل تحميل هذا المشروع"); return; }
      const resultData = await resultRes.json();
      const success = safeSetResult(resultData);
      if (success) { setView("result"); setTab("identity"); }
      else alert("بيانات المشروع غير مكتملة");
    } catch (e) { alert("خطأ في الاتصال"); } finally { setLoading(false); }
  };

  // ── Delete handler ──
  const handleDeleteProject = async (projId: string) => {
    if (deleteConfirmId !== projId) {
      // أول ضغطة: اطلب تأكيد
      setDeleteConfirmId(projId);
      // إلغاء التأكيد بعد 3 ثواني تلقائياً
      setTimeout(() => setDeleteConfirmId((cur) => cur === projId ? null : cur), 3000);
      return;
    }

    // ثاني ضغطة: نفّذ الحذف
    setDeleteConfirmId(null);
    setDeletingId(projId);
    try {
      const res = await fetch(`/api/projects/${projId}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== projId));
      } else {
        const data = await res.json();
        alert(data.message || "فشل حذف المشروع");
      }
    } catch (e) {
      alert("خطأ في الاتصال");
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); navigate("/login"); }
    catch (e) { console.error(e); }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080F" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #C9973A33", borderTop: "3px solid #C9973A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", minHeight: "100vh", background: "#08080F", color: "#F0EDE6", paddingTop: 64 }}>
      {/* ── Navbar ── */}
      <header style={{
        position: "fixed", top: 0, right: 0, left: 0, zIndex: 90,
        height: 64,
        background: "rgba(8,8,15,.92)",
        borderBottom: "1px solid #1E1E2E",
        backdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dashHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0C96B" />
                <stop offset="100%" stopColor="#C9973A" />
              </linearGradient>
            </defs>
            <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="url(#dashHexGrad)" />
            <text
              x="18" y="23"
              textAnchor="middle"
              fontFamily="Tajawal, sans-serif"
              fontSize="13" fontWeight="900"
              fill="#08080F"
            >
              ع
            </text>
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.3px",
              background: "linear-gradient(90deg, #F0C96B, #C9973A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}>
              ArabBrand
            </span>
            <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "10px", fontWeight: 500, color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}>
              STUDIO
            </span>
          </div>
        </Link>

        {/* User info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: ".8rem", color: "#8A8498" }}>
            مرحباً، {user?.fullName}{" "}
            <span style={{ color: "#C9973A", fontWeight: 700 }}>({user?.credits} رصيد)</span>
          </span>
          <button
            onClick={handleLogout}
            style={{ background: "transparent", border: "1px solid #1E1E2E", color: "#8A8498", padding: ".35rem .75rem", borderRadius: 8, fontSize: ".75rem", cursor: "pointer", transition: "all .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F8717144"; e.currentTarget.style.color = "#F87171"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}
          >
            تسجيل الخروج
          </button>
        </div>
      </header>

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <div className="page fade-up">
          <div className="wrap" style={{ maxWidth: 800 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ fontSize: "2rem", margin: 0, fontWeight: 800 }}>براندات الهوية</h1>
                <p style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}>إدارة واستعراض العلامات البصرية المولدة</p>
              </div>
              <button className="gold-btn" style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }} onClick={() => { setView("wizard"); setErr(""); }}>
                ✦ براند جديد
              </button>
            </div>

            {projects.length === 0 ? (
              <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 20, padding: "4rem 2rem", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎨</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: ".5rem" }}>لا توجد براندات مولدة بعد</h3>
                <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: "1.5rem" }}>ابدأ الآن بتوليد علامتك التجارية الأولى بالذكاء الاصطناعي</p>
                <button className="gold-btn" style={{ padding: ".75rem 1.75rem" }} onClick={() => setView("wizard")}>ابدأ بتوليد براندك</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
                {projects.map((proj) => (
                  <div
                    key={proj._id}
                    style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 16, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all .2s", position: "relative" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9973A44")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}
                  >
                    {/* ── Delete Button (top-left corner) ── */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj._id); }}
                      disabled={deletingId === proj._id}
                      title={deleteConfirmId === proj._id ? "اضغط مجدداً للتأكيد" : "حذف المشروع"}
                      style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        width: deleteConfirmId === proj._id ? "auto" : 28,
                        height: 28,
                        padding: deleteConfirmId === proj._id ? "0 .5rem" : "0",
                        borderRadius: deleteConfirmId === proj._id ? 6 : "50%",
                        border: `1px solid ${deleteConfirmId === proj._id ? "#F8717155" : "#1E1E2E"}`,
                        background: deleteConfirmId === proj._id ? "#F8717115" : "transparent",
                        color: deleteConfirmId === proj._id ? "#F87171" : "#3A3650",
                        fontSize: deleteConfirmId === proj._id ? ".62rem" : ".75rem",
                        cursor: deletingId === proj._id ? "default" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: ".25rem",
                        transition: "all .2s",
                        zIndex: 2,
                        whiteSpace: "nowrap",
                        fontFamily: "Tajawal, sans-serif",
                        fontWeight: 600,
                        opacity: deletingId === proj._id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (deleteConfirmId !== proj._id) {
                          e.currentTarget.style.borderColor = "#F8717155";
                          e.currentTarget.style.color = "#F87171";
                          e.currentTarget.style.background = "#F8717110";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (deleteConfirmId !== proj._id) {
                          e.currentTarget.style.borderColor = "#1E1E2E";
                          e.currentTarget.style.color = "#3A3650";
                          e.currentTarget.style.background = "transparent";
                        }
                      }}
                    >
                      {deletingId === proj._id ? (
                        <div style={{ width: 10, height: 10, border: "1.5px solid #F8717133", borderTop: "1.5px solid #F87171", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      ) : deleteConfirmId === proj._id ? (
                        <>⚠️ تأكيد الحذف؟</>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      )}
                    </button>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem", paddingRight: "1rem" }}>
                        <span style={{
                          padding: ".2rem .5rem", borderRadius: 6, fontSize: ".65rem", fontWeight: 700,
                          background: proj.status === "completed" ? "#4ADE8015" : proj.status === "failed" ? "#F8717115" : "#C9973A15",
                          color: proj.status === "completed" ? "#4ADE80" : proj.status === "failed" ? "#F87171" : "#C9973A",
                        }}>
                          {proj.status === "completed" ? "مكتمل" : proj.status === "failed" ? "فشل" : "جاري التوليد"}
                        </span>
                        <span style={{ fontSize: ".65rem", color: "#3A3650" }}>
                          {new Date(proj.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "#F0EDE6" }}>{proj.projectTitle}</h3>
                      <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 38 }}>
                        {proj.idea}
                      </p>
                    </div>

                    <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: ".75rem", marginTop: "1rem" }}>
                      {proj.status === "completed" ? (
                        <button
                          onClick={() => handleViewResult(proj._id)}
                          style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#C9973A", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", transition: "all .2s" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "#C9973A"; e.currentTarget.style.color = "#08080F"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9973A"; }}
                        >
                          استعراض الهوية 🎨
                        </button>
                      ) : proj.status === "generating" ? (
                        <button
                          onClick={() => { setView("generating"); setPct(40); setPhase(1); startPolling(proj._id); }}
                          style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontSize: ".8rem", cursor: "pointer" }}
                        >
                          متابعة التوليد ⏳
                        </button>
                      ) : (
                        <button
                          onClick={() => { setView("wizard"); setIdea(proj.idea); setBname(proj.customBrandName || ""); setStyle(proj.selectedStyle); }}
                          style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #F8717133", color: "#F87171", fontSize: ".8rem", cursor: "pointer" }}
                        >
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

      {/* ── WIZARD VIEW ── */}
      {view === "wizard" && (
        <div className="page fade-up">
          <div className="wrap">
            <div className="topbar">
              <button className="icon-btn" onClick={() => setView("list")}>←</button>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>توليد براند جديد بالذكاء الاصطناعي</h2>
              <div style={{ width: 36 }} />
            </div>

            <div className="card">
              <div className="clabel">فكرة مشروعك بالتفصيل *</div>
              <textarea className="field" rows={4} placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة للشباب في الرياض..." value={idea} onChange={(e) => setIdea(e.target.value)} />
              <p style={{ fontSize: ".7rem", color: "#3A3650", marginTop: ".35rem" }}>💡 كلما كان الوصف أكثر تفصيلاً، كانت نتائج البراند أكثر دقة وتميزاً</p>
            </div>

            <div className="card">
              <div className="clabel">اسم البراند <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختياري)</span></div>
              <input className="field" placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة مع شرح كل اسم" value={bname} onChange={(e) => setBname(e.target.value)} />
              {!bname && (
                <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".5rem .75rem", marginTop: ".5rem", fontSize: ".72rem", color: "#C9973A" }}>
                  ✦ سيقترح الذكاء الاصطناعي 3 أسماء مدروسة مع معنى كل اسم وسبب اختياره
                </div>
              )}
            </div>

            <div className="card">
              <div className="clabel">الأسلوب البصري والشخصية *</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: ".5rem" }}>
                {STYLES.map((s) => (
                  <button key={s.id} onClick={() => setStyle(s.id)} className={`style-btn ${style === s.id ? "on" : ""}`}>
                    <div style={{ fontWeight: 700, fontSize: ".85rem" }}>{s.ar}</div>
                    <div style={{ fontSize: ".65rem", opacity: 0.6, marginTop: 2 }}>{s.en}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="clabel">الألوان المفضلة <span style={{ color: "#3A3650", fontWeight: 400 }}>(اختر حتى 3 ألوان)</span></div>
              <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                {COLORS.map((c) => (
                  <div key={c.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <button
                      onClick={() => toggleColor(c.id)}
                      style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer", border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent", boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none", transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem", transition: "all .15s" }}
                    >
                      {cols.includes(c.id) ? "✓" : ""}
                    </button>
                    <span style={{ fontSize: ".62rem", color: "#6B6478" }}>{c.ar}</span>
                  </div>
                ))}
              </div>
            </div>

            {err && (
              <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
                {err}
              </div>
            )}

            <button className="gold-btn" style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }} onClick={handleGenerate}>
              ✦ ولّد Brand Kit كامل مع تحليل المنافسين
            </button>
          </div>
        </div>
      )}

      {view === "generating" && <GenScreen phase={phase} pct={pct} />}

      {view === "result" && result && (
        <ResultScreen result={result} tab={tab} setTab={setTab} onBack={() => { setView("list"); fetchProjectsList(); }} />
      )}

      {view === "result" && !result && (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <p style={{ color: "#F87171", fontSize: "1rem" }}>⚠️ فشل تحميل البيانات</p>
          <button className="gold-btn" onClick={() => setView("list")}>العودة للقائمة</button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── GENERATING SCREEN ── */
function GenScreen({ phase, pct }: { phase: number; pct: number }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", padding: "2rem", background: "#08080F" }}>
      <div style={{ position: "relative", width: 110, height: 110 }}>
        <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
          <circle cx="55" cy="55" r="48" fill="none" stroke="#1E1E2E" strokeWidth="4" />
          <circle
            cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
            style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#C9973A" }}>
          {pct}%
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "1.05rem", fontWeight: 600, color: "#C9973A", marginBottom: ".375rem" }}>{PHASES[phase]?.label}</p>
        <p style={{ fontSize: ".8rem", color: "#6B6478" }}>الذكاء الاصطناعي يبني هويتك التجارية الآن...</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", width: "100%", maxWidth: 340 }}>
        {PHASES.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .875rem", borderRadius: 9, fontSize: ".8rem", background: i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent", color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", transition: "all .3s" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650", animation: i === phase ? "blink 1s ease-in-out infinite" : "none" }} />
            <span>{i < phase ? "✓ " : ""}{p.label}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
    </div>
  );
}

/* ── RESULT SCREEN ── */
const TABS = [
  { id: "identity", label: "🎨 الهوية" },
  { id: "logo", label: "🏷️ الشعار" },
  { id: "social", label: "📱 السوشيال" },
  { id: "landing", label: "🌐 صفحة الهبوط" },
  { id: "brochure", label: "📄 البروشور" },
  { id: "competitors", label: "🔍 المنافسون" },
];

function ResultScreen({
  result,
  tab,
  setTab,
  onBack,
}: {
  result: any;
  tab: string;
  setTab: (t: string) => void;
  onBack: () => void;
}) {
  const [socialData, setSocialData] = useState<any>(null);

  const brand = result?.brandIdentity ?? {};
  const logoRaw = result?.logo ?? {};
  const logoStr =
    typeof logoRaw === "string"
      ? logoRaw
      : logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "";
  const logo = sanitizeSVGClient(logoStr);
  const social = socialData ?? result?.socialMedia ?? {};
  const landing = result?.landingPage ?? {};
  const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
  const competitors = result?.competitors ?? {};
  const projectId = result?.projectId ?? result?._id ?? "";

  const namesRaw: any[] = brand?.names ?? [];
  const nameObjects: { name: string; reason?: string; meaning?: string }[] = namesRaw.map(
    (n: any) => (typeof n === "string" ? { name: n } : n)
  );

  const displayName =
    result?.displayName ??
    brand?.recommendedName ??
    brand?.name ??
    nameObjects[0]?.name ??
    "Brand";

  const primary = brand?.primaryColor ?? brand?.colors?.[0]?.hex ?? "#C9973A";
  const secondary = brand?.secondaryColor ?? brand?.colors?.[1]?.hex ?? "#0E0E1A";

  return (
    <div className="page fade-up">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <div className="topbar">
          <button className="icon-btn" onClick={onBack}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
              <defs>
                <linearGradient id="resHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F0C96B" />
                  <stop offset="100%" stopColor="#C9973A" />
                </linearGradient>
              </defs>
              <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="url(#resHexGrad)" />
              <text x="18" y="23" textAnchor="middle" fontFamily="Tajawal, sans-serif" fontSize="13" fontWeight="900" fill="#08080F">ع</text>
            </svg>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Sora, sans-serif", fontSize: "14px", fontWeight: 800, background: "linear-gradient(90deg,#F0C96B,#C9973A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>ArabBrand</span>
              <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "9px", color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}>STUDIO</span>
            </div>
          </div>
          <div style={{ width: 36 }} />
        </div>

        {/* Hero Card */}
        <div style={{ background: `linear-gradient(135deg, ${secondary} 0%, #17172B 100%)`, border: "1px solid #C9973A22", borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${primary}18, transparent 70%)`, pointerEvents: "none" }} />

          {nameObjects.length > 0 && (
            <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.125rem" }}>
              {nameObjects.map((n, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ padding: ".25rem .75rem", borderRadius: 20, fontSize: ".72rem", border: n.name === brand.recommendedName ? `1px solid ${primary}` : "1px solid #C9973A33", background: n.name === brand.recommendedName ? primary : "transparent", color: n.name === brand.recommendedName ? secondary : "#8A8498", fontWeight: n.name === brand.recommendedName ? 700 : 400 }}>
                    {n.name}{n.name === brand.recommendedName && " ✦"}
                  </span>
                  {n.meaning && <span style={{ fontSize: ".58rem", color: "#3A3650", marginTop: 2 }}>{n.meaning}</span>}
                </div>
              ))}
            </div>
          )}

          <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#F0EDE6", marginBottom: ".375rem", letterSpacing: "-1px" }}>{displayName}</h1>
          <p style={{ fontSize: "1rem", color: primary, fontWeight: 500, marginBottom: ".25rem" }}>{brand?.tagline?.ar ?? brand?.tagline ?? ""}</p>
          <p style={{ fontSize: ".78rem", color: "#8A8498", fontStyle: "italic" }}>{brand?.tagline?.en ?? ""}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: ".375rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1.5rem", scrollbarWidth: "none" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{ padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`, background: tab === t.id ? primary : "transparent", color: tab === t.id ? secondary : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "identity" && <IdentityTab brand={brand} primary={primary} nameObjects={nameObjects} />}
        {tab === "logo" && <LogoTab logo={logo} displayName={displayName} brand={brand} />}
        {tab === "social" && <SocialTab social={social} displayName={displayName} projectId={projectId} onSocialUpdate={(s) => setSocialData(s)} />}
        {tab === "landing" && <LandingTab landing={landing} displayName={displayName} primary={primary} secondary={secondary} />}
        {tab === "brochure" && <BrochureTab brand={brand} brochureContent={brochureContent} displayName={displayName} primary={primary} secondary={secondary} />}
        {tab === "competitors" && <CompetitorsTab competitors={competitors} primary={primary} />}

        <button
          onClick={onBack}
          style={{ width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}
        >
          ← العودة للبراندات
        </button>
      </div>
    </div>
  );
}

// sanitize SVG client-side
function sanitizeSVGClient(raw: string): string {
  if (!raw || !raw.includes("<svg")) return "";
  let svg = raw.trim();
  if (!svg.includes("xmlns")) svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  if (!svg.includes("viewBox")) svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
  return svg;
}

/* ── IDENTITY TAB ── */
function IdentityTab({ brand, primary, nameObjects }: { brand: any; primary: string; nameObjects: any[] }) {
  const scores = [
    { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
    { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
    { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
    { l: "الملاءمة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
  ];

  return (
    <div className="fade-up">
      {nameObjects.length > 0 && nameObjects.some((n) => n.reason) && (
        <div className="card">
          <div className="clabel">مقترحات الأسماء المدروسة</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {nameObjects.map((n, i) => (
              <div key={i} style={{ background: n.name === brand.recommendedName ? `${primary}0D` : "#0A0A14", border: `1px solid ${n.name === brand.recommendedName ? primary + "44" : "#1E1E2E"}`, borderRadius: 12, padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".375rem" }}>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: n.name === brand.recommendedName ? primary : "#F0EDE6" }}>{n.name}</span>
                  {n.name === brand.recommendedName && (
                    <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: primary, color: "#08080F", fontWeight: 700 }}>موصى به</span>
                  )}
                  {n.meaning && <span style={{ fontSize: ".72rem", color: "#8A8498" }}>— {n.meaning}</span>}
                </div>
                {n.reason && <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.6, margin: 0 }}>{n.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="clabel">لوحة ألوان الهوية الموصى بها</div>
        {brand?.colors?.length > 0 ? (
          <>
            <div style={{ display: "flex", borderRadius: 12, overflow: "hidden", height: 60, marginBottom: "1rem" }}>
              {brand.colors.map((c: any, i: number) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: c.hex, padding: 4 }}>
                  <span style={{ fontSize: "9px", color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)", fontWeight: 700 }}>{c.name}</span>
                  <span style={{ fontSize: "8px", color: i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)", fontFamily: "monospace" }}>{c.hex}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {brand.colors.map((c: any, i: number) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: ".35rem", fontSize: ".78rem" }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: c.hex, border: "1px solid rgba(255,255,255,.1)" }} />
                  <span style={{ color: "#C4BDB5" }}>{c.name}</span>
                  <span style={{ fontFamily: "monospace", color: "#8A8498" }}>{c.hex}</span>
                </div>
              ))}
            </div>
          </>
        ) : <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد لوحة الألوان</p>}
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div className="clabel" style={{ marginBottom: 0 }}>مؤشر قوة البراند</div>
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

      <div className="card">
        <div className="clabel">استراتيجية التموضع والجمهور</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          {[["التموضع التسويقي", brand?.strategy?.positioning], ["الجمهور المستهدف", brand?.strategy?.audience]].map(([label, val]) => (
            <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
              <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{val ?? "—"}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
          <div style={{ fontSize: ".65rem", fontWeight: 700, color: primary, marginBottom: ".375rem", textTransform: "uppercase" }}>القيمة الفريدة المقترحة</div>
          <div style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{brand?.strategy?.value ?? "—"}</div>
        </div>
      </div>

      <div className="card">
        <div className="clabel">قصة العلامة التجارية</div>
        <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>{brand?.story?.ar ?? brand?.story ?? "—"}</p>
        {brand?.story?.en && <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>{brand.story.en}</p>}
      </div>

      {brand?.typography && (
        <div className="card">
          <div className="clabel">هوية الخطوط المقترحة</div>
          <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1.25rem", textAlign: "center", border: "1px solid #1E1E2E" }}>
            <div style={{ fontFamily: "Sora,sans-serif", fontSize: "1.75rem", fontWeight: 700, color: primary, marginBottom: ".25rem" }}>{brand.typography.display}</div>
            <div style={{ fontSize: "1.1rem", color: "rgba(240,237230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>{brand.typography.arabic}</div>
            <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand.typography.style}</div>
          </div>
        </div>
      )}

      {(brand?.voice || brand?.messages) && (
        <div className="card">
          <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
          {brand?.voice?.tone && (
            <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>
              النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span>
            </p>
          )}
          {brand?.voice?.traits?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem", marginBottom: "1.25rem" }}>
              {brand.voice.traits.map((t: string, i: number) => (
                <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          )}
          {brand?.messages?.length > 0 && (
            <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: "1rem" }}>
              <p style={{ fontSize: ".8rem", fontWeight: 700, color: "#8A8498", marginBottom: ".5rem" }}>الرسائل التسويقية:</p>
              {brand.messages.map((m: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".4rem 0" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: primary, marginTop: ".45rem", flexShrink: 0 }} />
                  <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{m}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── LOGO TAB ── */
function LogoTab({ logo, displayName, brand }: { logo: string; displayName: string; brand: any }) {
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

  if (!logo) return (
    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
      <p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار، جاري استخدام الشعار الاحتياطي</p>
    </div>
  );

  return (
    <div className="fade-up">
      <div className="card">
        <div className="clabel">الشعار على خلفية فاتحة</div>
        <div style={{ background: lightBg, borderRadius: 16, padding: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 240 }}>
          <div dangerouslySetInnerHTML={{ __html: logo }} style={{ width: "100%", maxWidth: 220, maxHeight: 220, display: "flex", justifyContent: "center" }} />
        </div>
        <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
          <button className="outline-btn" onClick={handleDownload}>⬇ تحميل SVG</button>
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
        <div className="clabel">كود SVG المصدري</div>
        <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.6, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {logo}
        </pre>
      </div>
    </div>
  );
}

/* ── SOCIAL TAB ── */
function SocialTab({ social, displayName, projectId, onSocialUpdate }: {
  social: any;
  displayName: string;
  projectId?: string;
  onSocialUpdate?: (s: any) => void;
}) {
  const [ptab, setPtab] = useState<"map" | "posts" | "videos" | "ready" | "plan">("map");
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg] = useState("");
  const [filterCat, setFilterCat] = useState("الكل");

  const igPosts = social?.instagram ?? [];
  const twTweets = social?.twitter ?? [];
  const contentMap = social?.contentMap ?? [];
  const postIdeas = social?.postIdeas ?? [];
  const videoIdeas = social?.videoIdeas ?? [];
  const weeklyPlan = social?.strategy?.weeklyPlan ?? [];

  const categories = ["الكل", ...Array.from(new Set(postIdeas.map((p: any) => p.category).filter(Boolean))) as string[]];
  const filteredPosts = filterCat === "الكل" ? postIdeas : postIdeas.filter((p: any) => p.category === filterCat);

  const catColor: Record<string, string> = {
    "Lifestyle": "#C9973A",
    "عرض المنتج/الخدمة": "#60A5FA",
    "قصص البراند": "#4ADE80",
    "عروض وتفاعل": "#F87171",
  };

  const typeIcon: Record<string, string> = {
    "صورة": "🖼",
    "فيديو": "🎬",
    "كاروسيل": "📑",
    "Reel": "🎞",
  };

  const handleGenerateMore = async () => {
    if (!projectId) return;
    setGenerating(true);
    setGenMsg("جاري توليد محتوى إضافي...");
    try {
      const res = await fetch(`/api/projects/${projectId}/social/generate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setGenMsg(data.message || "فشل التوليد");
      } else {
        setGenMsg(`✓ تم التوليد! رصيدك المتبقي: ${data.creditsLeft}`);
        onSocialUpdate?.(data.social);
        setTimeout(() => setGenMsg(""), 3000);
      }
    } catch {
      setGenMsg("خطأ في الاتصال");
    } finally {
      setGenerating(false);
    }
  };

  const SUBTABS = [
    { id: "map", label: "🗺 خريطة المحتوى" },
    { id: "posts", label: "💡 أفكار بوستات" },
    { id: "videos", label: "🎬 أفكار فيديوهات" },
    { id: "ready", label: "📋 منشورات جاهزة" },
    { id: "plan", label: "📅 خطة أسبوعية" },
  ];

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: ".3rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1rem", scrollbarWidth: "none" }}>
        {SUBTABS.map(({ id, label }) => (
          <button key={id} onClick={() => setPtab(id as any)}
            style={{ padding: ".4rem .85rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: ptab === id ? "#C9973A" : "transparent", color: ptab === id ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: ptab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
            {label}
          </button>
        ))}
        <button onClick={handleGenerateMore} disabled={generating}
          style={{ marginRight: "auto", padding: ".4rem 1rem", borderRadius: 20, border: "1.5px solid #C9973A44", background: generating ? "#1E1E2E" : "transparent", color: generating ? "#8A8498" : "#C9973A", fontFamily: "Tajawal,sans-serif", fontSize: ".75rem", fontWeight: 600, cursor: generating ? "default" : "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: ".35rem" }}>
          {generating ? "⏳" : "✦"} توليد إضافي <span style={{ padding: ".1rem .4rem", borderRadius: 4, background: "#C9973A22", fontSize: ".65rem" }}>1 كريديت</span>
        </button>
      </div>

      {genMsg && (
        <div style={{ background: genMsg.startsWith("✓") ? "#4ADE8011" : "#F8717111", border: `1px solid ${genMsg.startsWith("✓") ? "#4ADE8033" : "#F8717133"}`, borderRadius: 8, padding: ".6rem 1rem", marginBottom: ".75rem", fontSize: ".8rem", color: genMsg.startsWith("✓") ? "#4ADE80" : "#F87171", textAlign: "center" }}>
          {genMsg}
        </div>
      )}

      {ptab === "map" && (
        <div className="card">
          <div className="clabel">خريطة المحتوى — توزيع البوستات</div>
          {contentMap.length === 0 ? (
            <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لم يتم توليد خريطة المحتوى</p>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
                  <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    {(() => {
                      let offset = 0;
                      return contentMap.map((seg: any, i: number) => {
                        const val = seg.pct;
                        const circ = 2 * Math.PI * 15.9;
                        const dash = (val / 100) * circ;
                        const gap = circ - dash;
                        const el = (
                          <circle key={i} cx="18" cy="18" r="15.9" fill="none"
                            stroke={seg.color || "#C9973A"} strokeWidth="3.2"
                            strokeDasharray={`${dash} ${gap}`}
                            strokeDashoffset={-offset * circ / 100}
                          />
                        );
                        offset += val;
                        return el;
                      });
                    })()}
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontSize: ".62rem", color: "#8A8498", lineHeight: 1 }}>محتوى</span>
                    <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#F0EDE6" }}>متنوع</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  {contentMap.map((seg: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
                      <span style={{ fontSize: ".8rem", color: "#C4BDB5", flex: 1 }}>{seg.category}</span>
                      <span style={{ fontSize: ".8rem", fontWeight: 700, color: seg.color }}>{seg.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {contentMap.map((seg: any, i: number) => (
                  <div key={i} style={{ background: "#0A0A14", borderRadius: 12, padding: "1rem", borderRight: `3px solid ${seg.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
                      <span style={{ fontSize: ".85rem", fontWeight: 700, color: seg.color }}>{seg.category}</span>
                      <span style={{ fontSize: ".72rem", color: "#3A3650", marginRight: "auto" }}>{seg.pct}% من المحتوى</span>
                    </div>
                    {seg.desc && <p style={{ fontSize: ".78rem", color: "#8A8498", marginBottom: ".5rem", lineHeight: 1.6 }}>{seg.desc}</p>}
                    {seg.examples?.length > 0 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
                        {seg.examples.map((ex: string, j: number) => (
                          <div key={j} style={{ display: "flex", gap: ".4rem", alignItems: "flex-start" }}>
                            <span style={{ color: seg.color, fontSize: ".7rem", marginTop: 2 }}>›</span>
                            <span style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.55 }}>{ex}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {ptab === "posts" && (
        <div>
          {categories.length > 1 && (
            <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  style={{ padding: ".3rem .7rem", borderRadius: 16, border: `1px solid ${filterCat === cat ? (catColor[cat] || "#C9973A") : "#1E1E2E"}`, background: filterCat === cat ? (catColor[cat] || "#C9973A") + "22" : "transparent", color: filterCat === cat ? (catColor[cat] || "#C9973A") : "#8A8498", fontSize: ".72rem", cursor: "pointer" }}>
                  {cat}
                </button>
              ))}
            </div>
          )}
          {filteredPosts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار البوستات</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
              {filteredPosts.map((p: any, i: number) => {
                const cc = catColor[p.category] || "#C9973A";
                return (
                  <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.125rem", borderRight: `3px solid ${cc}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
                      <span style={{ fontSize: "1rem" }}>{typeIcon[p.type] || "📌"}</span>
                      <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{p.title}</span>
                      <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: cc + "22", color: cc, border: `1px solid ${cc}44` }}>{p.type}</span>
                      <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: "#1E1E2E", color: "#8A8498" }}>{p.platform}</span>
                    </div>
                    {p.visual && (
                      <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem", borderRight: `2px solid ${cc}66` }}>
                        <div style={{ fontSize: ".6rem", color: cc, fontWeight: 700, marginBottom: ".25rem" }}>🎨 المشهد البصري</div>
                        <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6, margin: 0 }}>{p.visual}</p>
                      </div>
                    )}
                    {p.caption && <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption}</p>}
                    {p.hashtags && <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags}</p>}
                    {p.category && (
                      <div style={{ marginTop: ".5rem" }}>
                        <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: cc + "15", color: cc, border: `1px solid ${cc}33` }}>{p.category}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {ptab === "videos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {videoIdeas.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
              <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار الفيديوهات</p>
            </div>
          ) : videoIdeas.map((v: any, i: number) => (
            <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".875rem" }}>
                <span style={{ fontSize: "1.1rem" }}>🎬</span>
                <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{v.concept || `فكرة فيديو ${i + 1}`}</span>
                <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#69C9D033", color: "#69C9D0" }}>{v.platform}</span>
                <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#1E1E2E", color: "#8A8498" }}>{v.duration}</span>
              </div>
              {v.hook && (
                <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem" }}>
                  <div style={{ fontSize: ".6rem", color: "#C9973A", fontWeight: 700, marginBottom: ".2rem" }}>⚡ الجملة الافتتاحية (أول 3 ثواني)</div>
                  <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#F0EDE6", margin: 0 }}>"{v.hook}"</p>
                </div>
              )}
              {v.scenes?.length > 0 && (
                <div style={{ marginBottom: ".625rem" }}>
                  <div style={{ fontSize: ".6rem", color: "#8A8498", fontWeight: 700, marginBottom: ".375rem" }}>🎞 المشاهد</div>
                  {v.scenes.map((s: string, j: number) => (
                    <div key={j} style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", padding: ".3rem 0", borderBottom: j < v.scenes.length - 1 ? "1px solid #1E1E2E" : "none" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#1E1E2E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", color: "#8A8498", flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                      <span style={{ fontSize: ".8rem", color: "#C4BDB5", lineHeight: 1.55 }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                {v.music && (
                  <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}>
                    <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>🎵 نوع الموسيقى</div>
                    <div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{v.music}</div>
                  </div>
                )}
                {v.cta && (
                  <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}>
                    <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>📢 نداء الإجراء</div>
                    <div style={{ fontSize: ".78rem", color: "#4ADE80" }}>{v.cta}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ptab === "ready" && (
        <div className="card">
          <div className="clabel">منشورات جاهزة للنسخ والنشر</div>
          {igPosts.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>IG</div>
                <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Instagram</span>
              </div>
              {igPosts.map((p: any, i: number) => (
                <div key={i} style={{ background: "linear-gradient(180deg,#13131E,#0A0A14)", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                      {displayName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
                      <div style={{ fontSize: ".6rem", color: "#3A3650" }}>حساب رسمي</div>
                    </div>
                  </div>
                  <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption ?? p.text ?? ""}</p>
                  <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags ?? ""}</p>
                  {p.theme && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)" }}>{p.theme}</span>}
                </div>
              ))}
            </div>
          )}
          {twTweets.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1D9BF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>X</div>
                <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Twitter / X</span>
              </div>
              {twTweets.map((t: any, i: number) => (
                <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0" }}>
                  <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{t.text ?? t.tweet ?? ""}</p>
                </div>
              ))}
            </div>
          )}
          {igPosts.length === 0 && twTweets.length === 0 && (
            <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لا يوجد منشورات جاهزة</p>
          )}
        </div>
      )}

      {ptab === "plan" && (
        <div>
          <div className="card">
            <div className="clabel">خطة النشر الأسبوعية</div>
            {weeklyPlan.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1.25rem" }}>
                {weeklyPlan.map((day: any, i: number) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1fr auto", alignItems: "center", gap: ".75rem", padding: ".75rem", background: "#0A0A14", borderRadius: 10, border: "1px solid #1E1E2E" }}>
                    <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#C9973A" }}>{day.day}</span>
                    <span style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{day.content || "—"}</span>
                    <span style={{ fontSize: ".7rem", color: "#8A8498", background: "#1E1E2E", padding: ".15rem .45rem", borderRadius: 5, whiteSpace: "nowrap" }}>{day.platform || ""}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#3A3650", fontSize: ".82rem", marginBottom: "1rem" }}>لم يتم توليد الخطة الأسبوعية</p>
            )}
          </div>
          {social?.strategy && (
            <div className="card">
              <div className="clabel">إحصائيات الاستراتيجية</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".625rem", marginBottom: ".75rem" }}>
                {[["أفضل أوقات النشر", social.strategy.bestTimes], ["معدل النشر", social.strategy.frequency], ["نبرة المحتوى", social.strategy.tone]].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: ".875rem", border: "1px solid #1E1E2E" }}>
                    <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#8A8498", marginBottom: ".375rem" }}>{label}</div>
                    <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{val}</div>
                  </div>
                ))}
              </div>
              {social.strategy.pillars?.length > 0 && (
                <div>
                  <p style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".5rem" }}>أعمدة المحتوى:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
                    {social.strategy.pillars.map((p: string, i: number) => (
                      <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)", fontSize: ".75rem" }}>{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── LANDING TAB ── */
function LandingTab({ landing, displayName, primary, secondary }: { landing: any; displayName: string; primary: string; secondary: string }) {
  const [view, setView] = useState("preview");

  const stats = landing?.stats ?? [
    { value: "100+", label: "عميل راضٍ" },
    { value: "98%", label: "معدل الرضا" },
    { value: "24/7", label: "دعم مستمر" },
  ];

  const htmlCode = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${displayName}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;direction:rtl;background:${secondary};color:#F0EDE6}
nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2rem;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:${secondary}ee;backdrop-filter:blur(12px);z-index:10}
.logo{font-size:1.25rem;font-weight:900;color:${primary}}
.nav-cta{padding:.5rem 1.25rem;border-radius:8px;background:${primary};color:${secondary};font-weight:700;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:.9rem}
.hero{padding:5rem 2rem 4rem;text-align:center;max-width:700px;margin:0 auto}
.hero h1{font-size:2.75rem;font-weight:900;margin-bottom:1.25rem;line-height:1.25;color:#ffffff}
.hero p{font-size:1.05rem;color:rgba(240,237,230,.7);margin-bottom:2.5rem;line-height:1.8}
.hero-btn{display:inline-block;padding:1rem 2.75rem;border-radius:14px;background:${primary};color:${secondary};font-weight:700;font-size:1.05rem;border:none;cursor:pointer;font-family:'Tajawal',sans-serif;text-decoration:none;transition:opacity .2s}
.hero-btn:hover{opacity:.9}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;padding:2rem;max-width:700px;margin:0 auto;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
.stat{text-align:center}.stat-val{font-size:2rem;font-weight:900;color:${primary};line-height:1}.stat-lbl{font-size:.82rem;color:rgba(240,237,230,.5);margin-top:.25rem}
.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.25rem;padding:3rem 2rem;max-width:900px;margin:0 auto}
.feat{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:1.5rem;transition:border-color .2s}
.feat:hover{border-color:${primary}44}
.feat-icon{font-size:2.25rem;margin-bottom:.875rem}
.feat h3{font-size:1rem;font-weight:700;color:${primary};margin-bottom:.5rem}
.feat p{font-size:.875rem;color:rgba(240,237,230,.6);line-height:1.7}
.testimonial{padding:4rem 2rem;text-align:center;max-width:600px;margin:0 auto}
.quote-mark{font-size:4rem;color:${primary};opacity:.3;line-height:.5;margin-bottom:1rem}
.quote-text{font-size:1.1rem;font-style:italic;color:rgba(240,237,230,.85);line-height:1.8;margin-bottom:1.5rem}
.quote-author{font-size:.85rem;color:${primary};font-weight:700}
.quote-role{font-size:.75rem;color:rgba(240,237,230,.4);margin-top:.25rem}
.cta-sec{padding:5rem 2rem;text-align:center;background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border-top:1px solid rgba(255,255,255,.07)}
.cta-sec h2{font-size:2.25rem;font-weight:900;margin-bottom:.875rem;color:#fff}
.cta-sec p{color:rgba(240,237,230,.6);margin-bottom:2rem;font-size:1rem}
footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.07);text-align:center;font-size:.78rem;color:rgba(240,237,230,.25)}
</style>
</head>
<body>
<nav>
  <div class="logo">${displayName}</div>
  <button class="nav-cta">${landing?.hero?.cta || "تواصل معنا"}</button>
</nav>
<div class="hero">
  <h1>${landing?.hero?.headline || landing?.headline || "نحن هنا لخدمتك"}</h1>
  <p>${landing?.hero?.subheadline || landing?.subheadline || ""}</p>
  <button class="hero-btn">${landing?.hero?.cta || "ابدأ الآن"}</button>
</div>
<div class="stats">
${stats.map((s: any) => `  <div class="stat"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("\n")}
</div>
<div class="feats">
${(landing?.features || landing?.sections || []).map((f: any) => `  <div class="feat"><div class="feat-icon">${f.emoji || "✦"}</div><h3>${f.title || ""}</h3><p>${f.desc || f.description || ""}</p></div>`).join("\n")}
</div>
${landing?.testimonial?.text ? `<div class="testimonial">
  <div class="quote-mark">"</div>
  <p class="quote-text">${landing.testimonial.text}</p>
  <div class="quote-author">${landing.testimonial.name || ""}</div>
  <div class="quote-role">${landing.testimonial.role || ""}</div>
</div>` : ""}
<div class="cta-sec">
  <h2>${landing?.cta?.headline || "انضم إلينا اليوم"}</h2>
  <p>${landing?.cta?.subheadline || ""}</p>
  <button class="hero-btn">${landing?.cta?.button || "ابدأ الآن"}</button>
</div>
<footer>© ${new Date().getFullYear()} ${displayName} — جميع الحقوق محفوظة</footer>
</body>
</html>`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([htmlCode], { type: "text/html" }));
    a.download = `${displayName}-landing.html`;
    a.click();
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem", alignItems: "center" }}>
        {[["preview", "👁 معاينة"], ["code", "{ } الكود"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{ padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: view === k ? "#1E1E2E" : "transparent", color: view === k ? "#F0EDE6" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer" }}>
            {l}
          </button>
        ))}
        <button className="gold-btn" style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={handleDownload}>⬇ تحميل HTML</button>
      </div>
      {view === "preview" ? (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>{displayName.toLowerCase().replace(/\s+/g, "-")}.html</span>
            <div style={{ width: 40 }} />
          </div>
          <iframe title="Landing Page Preview" srcDoc={htmlCode} style={{ width: "100%", height: "600px", border: "none" }} />
        </div>
      ) : (
        <div className="card">
          <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", maxHeight: "450px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {htmlCode}
          </pre>
        </div>
      )}
    </div>
  );
}

/* ── BROCHURE TAB ── */
function BrochureTab({ brand, brochureContent, displayName, primary, secondary }: { brand: any; brochureContent: any; displayName: string; primary: string; secondary: string }) {
  const taglineAr = brand?.tagline?.ar ?? brand?.tagline ?? "";
  const taglineEn = brand?.tagline?.en ?? "";
  const intro = brochureContent?.intro ?? brand?.story?.ar ?? brand?.story ?? "";
  const services = brochureContent?.services ?? [];
  const whyUs = brochureContent?.whyUs ?? brand?.messages ?? [];
  const sections = brochureContent?.sections ?? [];
  const contact = brochureContent?.contact ?? {};
  const brocheureHeadline = brochureContent?.headline ?? displayName;

  const htmlBrochure = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${displayName} — بروشور الشركة</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&family=Sora:wght@400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;direction:rtl;background:#f4f4f8;color:#1A1A28;padding:2rem;max-width:820px;margin:0 auto}
.cover{background:${secondary};border-radius:18px 18px 0 0;padding:4rem 3rem;text-align:center;position:relative;overflow:hidden;color:#F0EDE6}
.cover-pattern{position:absolute;inset:0;background-image:radial-gradient(${primary}22 1.5px,transparent 1.5px);background-size:22px 22px;pointer-events:none}
.cover-rel{position:relative}
.cover-name{font-family:'Sora',sans-serif;font-size:3.5rem;font-weight:900;color:${primary};line-height:1}
.cover-tagline{font-size:1.15rem;color:rgba(240,237,230,.75);margin-top:.75rem;font-weight:300}
.cover-tagline-en{font-size:.85rem;color:rgba(240,237,230,.35);font-style:italic;margin-top:.35rem}
.intro-band{background:${primary};padding:1.25rem 3rem;display:flex;align-items:center;justify-content:center}
.intro-text{color:${secondary};font-size:.95rem;line-height:1.75;text-align:center;font-weight:500}
.body{background:#fff;padding:2.5rem 3rem;border-left:1px solid #e8e8f0;border-right:1px solid #e8e8f0}
.section-title{font-size:.65rem;font-weight:900;letter-spacing:2px;color:${primary};text-transform:uppercase;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid ${primary}22}
.services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
.service-card{background:#f8f8fc;border-radius:12px;padding:1.25rem;border:1px solid #e8e8f0;text-align:center}
.service-icon{font-size:1.75rem;margin-bottom:.5rem}
.service-name{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.25rem}
.service-brief{font-size:.75rem;color:#6B6478;line-height:1.5}
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:2rem}
.why-item{display:flex;align-items:flex-start;gap:.625rem;padding:.875rem;background:#f8f8fc;border-radius:10px;border-right:3px solid ${primary}}
.why-dot{width:8px;height:8px;border-radius:50%;background:${primary};margin-top:.375rem;flex-shrink:0}
.why-text{font-size:.82rem;color:#3A3650;line-height:1.6}
.sections-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem}
.section-block{padding:1.25rem;border-radius:12px;background:#f8f8fc;border:1px solid #e8e8f0;border-top:3px solid ${primary}}
.section-block h4{font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.5rem}
.section-block p{font-size:.78rem;color:#6B6478;line-height:1.65}
.colors-strip{display:flex;height:10px;border-radius:0}
.color-sw{flex:1}
.footer-band{background:${secondary};padding:1.5rem 3rem;border-radius:0 0 18px 18px;display:flex;justify-content:space-between;align-items:center}
.footer-brand{font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:${primary}}
.footer-contact{font-size:.82rem;color:rgba(240,237,230,.5);text-align:center}
.footer-dots{display:flex;gap:5px}
.footer-dot{width:10px;height:10px;border-radius:50%}
</style>
</head>
<body>
<div class="cover">
  <div class="cover-pattern"></div>
  <div class="cover-rel">
    <div class="cover-name">${brocheureHeadline}</div>
    <div class="cover-tagline">${taglineAr}</div>
    <div class="cover-tagline-en">${taglineEn}</div>
  </div>
</div>
<div class="intro-band"><div class="intro-text">${intro}</div></div>
<div class="body">
  ${services.length > 0 ? `<div class="section-title">خدماتنا</div><div class="services-grid">${services.map((s: any) => `<div class="service-card"><div class="service-icon">${s.icon || "✦"}</div><div class="service-name">${s.name || ""}</div><div class="service-brief">${s.brief || ""}</div></div>`).join("")}</div>` : ""}
  ${sections.length > 0 ? `<div class="section-title">معلومات عن المشروع</div><div class="sections-grid">${sections.map((s: any) => `<div class="section-block"><h4>${s.title || ""}</h4><p>${s.content || ""}</p></div>`).join("")}</div>` : `<div class="section-title">عن البراند</div><div class="sections-grid">${[["التموضع التسويقي", brand?.strategy?.positioning ?? ""], ["الجمهور المستهدف", brand?.strategy?.audience ?? ""], ["القيمة الفريدة", brand?.strategy?.value ?? ""], ["نبرة الصوت", brand?.voice?.tone ?? ""]].map(([t, c]) => `<div class="section-block"><h4>${t}</h4><p>${c}</p></div>`).join("")}</div>`}
  ${whyUs.length > 0 ? `<div class="section-title">لماذا تختارنا؟</div><div class="why-grid">${whyUs.map((w: string) => `<div class="why-item"><div class="why-dot"></div><div class="why-text">${w}</div></div>`).join("")}</div>` : ""}
  ${contact?.tagline ? `<div style="text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:12px;border:1px solid #e8e8f0"><div style="font-size:1rem;font-weight:700;color:#1A1A28;margin-bottom:.75rem">${contact.tagline}</div><div style="display:inline-block;padding:.75rem 2rem;background:${primary};color:${secondary};border-radius:10px;font-weight:700;font-size:.9rem">${contact.cta || "تواصل معنا"}</div></div>` : ""}
</div>
<div class="colors-strip">${(brand?.colors || []).map((c: any) => `<div class="color-sw" style="background:${c.hex}"></div>`).join("")}</div>
<div class="footer-band">
  <div class="footer-brand">${displayName}</div>
  <div class="footer-contact">Brand Kit © ${new Date().getFullYear()}</div>
  <div class="footer-dots">${(brand?.colors || []).map((c: any) => `<div class="footer-dot" style="background:${c.hex}"></div>`).join("")}</div>
</div>
</body>
</html>`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([htmlBrochure], { type: "text/html" }));
    a.download = `${displayName}-brochure.html`;
    a.click();
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تنزيل بروشور HTML</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 5 }}>
            {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>brochure-preview.html</span>
          <div style={{ width: 40 }} />
        </div>
        <iframe title="Brochure Preview" srcDoc={htmlBrochure} style={{ width: "100%", height: "600px", border: "none", background: "#f4f4f8" }} />
      </div>
    </div>
  );
}

/* ── COMPETITORS TAB ── */
function CompetitorsTab({ competitors, primary }: { competitors: any; primary: string }) {
  if (!competitors || Object.keys(competitors).length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
        <p style={{ color: "#3A3650", fontSize: ".85rem" }}>لم يتم توليد تحليل المنافسين</p>
      </div>
    );
  }

  const levelColor = (level: string) => {
    if (level?.includes("شرس") || level?.includes("عالي")) return "#F87171";
    if (level?.includes("متوسط")) return "#FBBF24";
    return "#4ADE80";
  };

  const sizeColor = (size: string) => {
    if (size?.includes("ضخم")) return "#A78BFA";
    if (size?.includes("كبير")) return "#60A5FA";
    if (size?.includes("متوسط")) return "#FBBF24";
    return "#4ADE80";
  };

  return (
    <div className="fade-up">
      <div className="card">
        <div className="clabel">نظرة عامة على السوق</div>
        <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8, marginBottom: "1.25rem" }}>{competitors.marketOverview ?? "—"}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
          <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
            <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>حجم السوق</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: sizeColor(competitors.marketSize) }}>{competitors.marketSize ?? "—"}</div>
          </div>
          <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", textAlign: "center" }}>
            <div style={{ fontSize: ".65rem", color: "#8A8498", marginBottom: ".5rem" }}>مستوى المنافسة</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: levelColor(competitors.competitionLevel) }}>{competitors.competitionLevel ?? "—"}</div>
          </div>
        </div>
      </div>

      {competitors.competitors?.length > 0 && (
        <div className="card">
          <div className="clabel">المنافسون في السوق</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            {competitors.competitors.map((c: any, i: number) => (
              <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1.125rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".625rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                    <span style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{c.name}</span>
                    {c.website && <span style={{ fontSize: ".65rem", color: "#60A5FA", fontFamily: "monospace" }}>{c.website}</span>}
                  </div>
                  <div style={{ display: "flex", gap: ".375rem" }}>
                    <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: c.type?.includes("مباشر") ? "#F8717115" : "#4ADE8015", color: c.type?.includes("مباشر") ? "#F87171" : "#4ADE80", border: `1px solid ${c.type?.includes("مباشر") ? "#F8717133" : "#4ADE8033"}` }}>{c.type ?? "منافس"}</span>
                    {c.marketShare && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#C9973A15", color: "#C9973A", border: "1px solid #C9973A33" }}>{c.marketShare}</span>}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
                  <div>
                    <div style={{ fontSize: ".6rem", color: "#4ADE80", marginBottom: ".25rem", fontWeight: 700 }}>✓ نقاط القوة</div>
                    <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.strengths ?? "—"}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: ".6rem", color: "#F87171", marginBottom: ".25rem", fontWeight: 700 }}>✗ نقاط الضعف</div>
                    <p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.weaknesses ?? "—"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {competitors.gaps?.length > 0 && (
        <div className="card">
          <div className="clabel">فرص في السوق غير مستغلة</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {competitors.gaps.map((g: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: "#4ADE8008", border: "1px solid #4ADE8022", borderRadius: 9 }}>
                <span style={{ color: "#4ADE80", flexShrink: 0, fontSize: ".9rem" }}>💡</span>
                <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {competitors.differentiators?.length > 0 && (
        <div className="card">
          <div className="clabel">ما يجعل براندك مختلفاً</div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
            {competitors.differentiators.map((d: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: ".625rem", alignItems: "flex-start", padding: ".625rem", background: `${primary}08`, border: `1px solid ${primary}22`, borderRadius: 9 }}>
                <span style={{ color: primary, flexShrink: 0 }}>✦</span>
                <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {competitors.searchKeywords?.length > 0 && (
        <div className="card">
          <div className="clabel">كلمات البحث المقترحة لـ SEO</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
            {competitors.searchKeywords.map((k: string, i: number) => (
              <span key={i} style={{ padding: ".3rem .75rem", borderRadius: 20, fontSize: ".78rem", background: "#0A0A14", border: "1px solid #1E1E2E", color: "#C4BDB5", fontFamily: "monospace" }}>🔍 {k}</span>
            ))}
          </div>
        </div>
      )}

      {competitors.recommendation && (
        <div className="card" style={{ borderColor: `${primary}33` }}>
          <div className="clabel" style={{ color: primary }}>التوصية الاستراتيجية للدخول للسوق</div>
          <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.8 }}>{competitors.recommendation}</p>
        </div>
      )}
    </div>
  );
}