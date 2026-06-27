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
//   const [view, setView] = useState<"list" | "wizard" | "generating" | "result">(
//     "list",
//   );

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

//   // ── Delete state ──
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     };
//     init();
//     return () => {
//       stopAllTimers();
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

//   const toggleColor = (id: string) =>
//     setCols((p) =>
//       p.includes(id) ? p.filter((c) => c !== id) : [...p, id].slice(0, 3),
//     );

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
//               const resultRes = await fetch(
//                 `/api/projects/${projectId}/result`,
//               );
//               if (!resultRes.ok) {
//                 setErr("فشل تحميل نتائج البراند");
//                 setView("wizard");
//                 return;
//               }
//               const resultData = await resultRes.json();
//               const success = safeSetResult(resultData);
//               if (success) {
//                 setView("result");
//                 setTab("identity");
//                 fetchProjectsList();
//               } else {
//                 setErr("البيانات المستلمة غير مكتملة");
//                 setView("wizard");
//               }
//             } catch (e) {
//               setErr("فشل تحميل نتائج البراند");
//               setView("wizard");
//             }
//           }, 1000);
//         } else if (status === "failed") {
//           stopAllTimers();
//           setErr(
//             "فشل الذكاء الاصطناعي، يرجى إعادة المحاولة بوصف أكثر تفصيلاً.",
//           );
//           setView("wizard");
//         }
//       } catch (e) {
//         console.error("Polling error:", e);
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
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleViewResult = async (projId: string) => {
//     setLoading(true);
//     try {
//       const resultRes = await fetch(`/api/projects/${projId}/result`);
//       if (!resultRes.ok) {
//         alert("فشل تحميل هذا المشروع");
//         return;
//       }
//       const resultData = await resultRes.json();
//       const success = safeSetResult(resultData);
//       if (success) {
//         setView("result");
//         setTab("identity");
//       } else alert("بيانات المشروع غير مكتملة");
//     } catch (e) {
//       alert("خطأ في الاتصال");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Delete handler ──
//   const handleDeleteProject = async (projId: string) => {
//     if (deleteConfirmId !== projId) {
//       // أول ضغطة: اطلب تأكيد
//       setDeleteConfirmId(projId);
//       // إلغاء التأكيد بعد 3 ثواني تلقائياً
//       setTimeout(
//         () => setDeleteConfirmId((cur) => (cur === projId ? null : cur)),
//         3000,
//       );
//       return;
//     }

//     // ثاني ضغطة: نفّذ الحذف
//     setDeleteConfirmId(null);
//     setDeletingId(projId);
//     try {
//       const res = await fetch(`/api/projects/${projId}`, { method: "DELETE" });
//       if (res.ok) {
//         setProjects((prev) => prev.filter((p) => p._id !== projId));
//       } else {
//         const data = await res.json();
//         alert(data.message || "فشل حذف المشروع");
//       }
//     } catch (e) {
//       alert("خطأ في الاتصال");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/auth/logout", { method: "POST" });
//       navigate("/login");
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   if (loading)
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
//       {/* ── Navbar ── */}
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
//         {/* Logo */}
//         <Link
//           to="/"
//           style={{
//             textDecoration: "none",
//             display: "flex",
//             alignItems: "center",
//             gap: "10px",
//           }}
//         >
//           <svg
//             width="36"
//             height="36"
//             viewBox="0 0 36 36"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <defs>
//               <linearGradient
//                 id="dashHexGrad"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="100%"
//               >
//                 <stop offset="0%" stopColor="#F0C96B" />
//                 <stop offset="100%" stopColor="#C9973A" />
//               </linearGradient>
//             </defs>
//             <polygon
//               points="18,2 32,10 32,26 18,34 4,26 4,10"
//               fill="url(#dashHexGrad)"
//             />
//             <text
//               x="18"
//               y="23"
//               textAnchor="middle"
//               fontFamily="Tajawal, sans-serif"
//               fontSize="13"
//               fontWeight="900"
//               fill="#08080F"
//             >
//               EG
//             </text>
//           </svg>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <span
//               style={{
//                 fontFamily: "Sora, sans-serif",
//                 fontSize: "15px",
//                 fontWeight: 800,
//                 letterSpacing: "0.3px",
//                 background: "linear-gradient(90deg, #F0C96B, #C9973A)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 lineHeight: 1.1,
//               }}
//             >
//               EG Brand
//             </span>
//             <span
//               style={{
//                 fontFamily: "Tajawal, sans-serif",
//                 fontSize: "10px",
//                 fontWeight: 500,
//                 color: "#5A5270",
//                 letterSpacing: "0.5px",
//                 lineHeight: 1,
//               }}
//             ></span>
//           </div>
//         </Link>

//         {/* User info + logout */}
//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <span style={{ fontSize: ".8rem", color: "#8A8498" }}>
//             مرحباً، {user?.fullName}{" "}
//             <span style={{ color: "#C9973A", fontWeight: 700 }}>
//               ({user?.credits} رصيد)
//             </span>
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
//             onMouseEnter={(e) => {
//               e.currentTarget.style.borderColor = "#F8717144";
//               e.currentTarget.style.color = "#F87171";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.borderColor = "#1E1E2E";
//               e.currentTarget.style.color = "#8A8498";
//             }}
//           >
//             تسجيل الخروج
//           </button>
//         </div>
//       </header>

//       {/* ── LIST VIEW ── */}
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
//                   براندات الهوية
//                 </h1>
//                 <p
//                   style={{ fontSize: ".85rem", color: "#8A8498", marginTop: 4 }}
//                 >
//                   إدارة واستعراض العلامات البصرية المولدة
//                 </p>
//               </div>
//               <button
//                 className="gold-btn"
//                 style={{ padding: ".75rem 1.5rem", fontSize: ".9rem" }}
//                 onClick={() => {
//                   setView("wizard");
//                   setErr("");
//                 }}
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
//                 <h3
//                   style={{
//                     fontSize: "1.2rem",
//                     fontWeight: 700,
//                     marginBottom: ".5rem",
//                   }}
//                 >
//                   لا توجد براندات مولدة بعد
//                 </h3>
//                 <p
//                   style={{
//                     fontSize: ".85rem",
//                     color: "#8A8498",
//                     marginBottom: "1.5rem",
//                   }}
//                 >
//                   ابدأ الآن بتوليد علامتك التجارية الأولى بالذكاء الاصطناعي
//                 </p>
//                 <button
//                   className="gold-btn"
//                   style={{ padding: ".75rem 1.75rem" }}
//                   onClick={() => setView("wizard")}
//                 >
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
//                       position: "relative",
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.borderColor = "#C9973A44")
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.borderColor = "#1E1E2E")
//                     }
//                   >
//                     {/* ── Delete Button (top-right corner) ── */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleDeleteProject(proj._id);
//                       }}
//                       disabled={deletingId === proj._id}
//                       title={
//                         deleteConfirmId === proj._id
//                           ? "اضغط مجدداً للتأكيد"
//                           : "حذف المشروع"
//                       }
//                       style={{
//                         position: "absolute",
//                         top: "10px",
//                         right: "10px",
//                         width: deleteConfirmId === proj._id ? "auto" : 28,
//                         height: 28,
//                         padding: deleteConfirmId === proj._id ? "0 .5rem" : "0",
//                         borderRadius: deleteConfirmId === proj._id ? 6 : "50%",
//                         border: `1px solid ${deleteConfirmId === proj._id ? "#F8717155" : "#1E1E2E"}`,
//                         background:
//                           deleteConfirmId === proj._id
//                             ? "#F8717115"
//                             : "transparent",
//                         color:
//                           deleteConfirmId === proj._id ? "#F87171" : "#3A3650",
//                         fontSize:
//                           deleteConfirmId === proj._id ? ".62rem" : ".75rem",
//                         cursor: deletingId === proj._id ? "default" : "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: ".25rem",
//                         transition: "all .2s",
//                         zIndex: 2,
//                         whiteSpace: "nowrap",
//                         fontFamily: "Tajawal, sans-serif",
//                         fontWeight: 600,
//                         opacity: deletingId === proj._id ? 0.5 : 1,
//                       }}
//                       onMouseEnter={(e) => {
//                         if (deleteConfirmId !== proj._id) {
//                           e.currentTarget.style.borderColor = "#F8717155";
//                           e.currentTarget.style.color = "#F87171";
//                           e.currentTarget.style.background = "#F8717110";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (deleteConfirmId !== proj._id) {
//                           e.currentTarget.style.borderColor = "#1E1E2E";
//                           e.currentTarget.style.color = "#3A3650";
//                           e.currentTarget.style.background = "transparent";
//                         }
//                       }}
//                     >
//                       {deletingId === proj._id ? (
//                         <div
//                           style={{
//                             width: 10,
//                             height: 10,
//                             border: "1.5px solid #F8717133",
//                             borderTop: "1.5px solid #F87171",
//                             borderRadius: "50%",
//                             animation: "spin 0.8s linear infinite",
//                           }}
//                         />
//                       ) : deleteConfirmId === proj._id ? (
//                         <>⚠️ تأكيد الحذف؟</>
//                       ) : (
//                         <svg
//                           width="12"
//                           height="12"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         >
//                           <polyline points="3 6 5 6 21 6" />
//                           <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//                           <path d="M10 11v6M14 11v6" />
//                           <path d="M9 6V4h6v2" />
//                         </svg>
//                       )}
//                     </button>

//                     <div>
//                       {/* status + date — padding-right عشان يبعد عن زر الحذف اليمين */}
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "center",
//                           marginBottom: ".75rem",
//                           paddingRight: "2.5rem",
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
//                                   ? "#F8717115"
//                                   : "#C9973A15",
//                             color:
//                               proj.status === "completed"
//                                 ? "#4ADE80"
//                                 : proj.status === "failed"
//                                   ? "#F87171"
//                                   : "#C9973A",
//                           }}
//                         >
//                           {proj.status === "completed"
//                             ? "مكتمل"
//                             : proj.status === "failed"
//                               ? "فشل"
//                               : "جاري التوليد"}
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

//       {/* ── WIZARD VIEW ── */}
//       {view === "wizard" && (
//         <div className="page fade-up">
//           <div className="wrap">
//             <div className="topbar">
//               <button className="icon-btn" onClick={() => setView("list")}>
//                 ←
//               </button>
//               <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
//                 توليد براند جديد بالذكاء الاصطناعي
//               </h2>
//               <div style={{ width: 36 }} />
//             </div>

//             <div className="card">
//               <div className="clabel">فكرة مشروعك بالتفصيل *</div>
//               <textarea
//                 className="field"
//                 rows={4}
//                 placeholder="مثلاً: أريد بناء مشروع مقهى عربي متخصص في القهوة المختصة للشباب في الرياض..."
//                 value={idea}
//                 onChange={(e) => setIdea(e.target.value)}
//               />
//               <p
//                 style={{
//                   fontSize: ".7rem",
//                   color: "#3A3650",
//                   marginTop: ".35rem",
//                 }}
//               >
//                 💡 كلما كان الوصف أكثر تفصيلاً، كانت نتائج البراند أكثر دقة
//                 وتميزاً
//               </p>
//             </div>

//             <div className="card">
//               <div className="clabel">
//                 اسم البراند{" "}
//                 <span style={{ color: "#3A3650", fontWeight: 400 }}>
//                   (اختياري)
//                 </span>
//               </div>
//               <input
//                 className="field"
//                 placeholder="اتركه فارغاً وسنقترح لك 3 أسماء عربية مميزة مع شرح كل اسم"
//                 value={bname}
//                 onChange={(e) => setBname(e.target.value)}
//               />
//               {!bname && (
//                 <div
//                   style={{
//                     background: "#C9973A0D",
//                     border: "1px solid #C9973A22",
//                     borderRadius: 8,
//                     padding: ".5rem .75rem",
//                     marginTop: ".5rem",
//                     fontSize: ".72rem",
//                     color: "#C9973A",
//                   }}
//                 >
//                   ✦ سيقترح الذكاء الاصطناعي 3 أسماء مدروسة مع معنى كل اسم وسبب
//                   اختياره
//                 </div>
//               )}
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
//                     <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
//                       {s.ar}
//                     </div>
//                     <div
//                       style={{ fontSize: ".65rem", opacity: 0.6, marginTop: 2 }}
//                     >
//                       {s.en}
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="card">
//               <div className="clabel">
//                 الألوان المفضلة{" "}
//                 <span style={{ color: "#3A3650", fontWeight: 400 }}>
//                   (اختر حتى 3 ألوان)
//                 </span>
//               </div>
//               <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
//                 {COLORS.map((c) => (
//                   <div
//                     key={c.id}
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "center",
//                       gap: 4,
//                     }}
//                   >
//                     <button
//                       onClick={() => toggleColor(c.id)}
//                       style={{
//                         width: 34,
//                         height: 34,
//                         borderRadius: "50%",
//                         background: c.hex,
//                         cursor: "pointer",
//                         border: cols.includes(c.id)
//                           ? "2px solid #fff"
//                           : "2px solid transparent",
//                         boxShadow: cols.includes(c.id)
//                           ? "0 0 0 2px rgba(255,255,255,.2)"
//                           : "none",
//                         transform: cols.includes(c.id)
//                           ? "scale(1.1)"
//                           : "scale(1)",
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
//                     <span style={{ fontSize: ".62rem", color: "#6B6478" }}>
//                       {c.ar}
//                     </span>
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
//               ✦ ولّد Brand Kit كامل مع تحليل المنافسين
//             </button>
//           </div>
//         </div>
//       )}

//       {view === "generating" && <GenScreen phase={phase} pct={pct} />}

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
//           <button className="gold-btn" onClick={() => setView("list")}>
//             العودة للقائمة
//           </button>
//         </div>
//       )}

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }

// /* ── GENERATING SCREEN ── */
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
//           <circle
//             cx="55"
//             cy="55"
//             r="48"
//             fill="none"
//             stroke="#1E1E2E"
//             strokeWidth="4"
//           />
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
//         <p
//           style={{
//             fontSize: "1.05rem",
//             fontWeight: 600,
//             color: "#C9973A",
//             marginBottom: ".375rem",
//           }}
//         >
//           {PHASES[phase]?.label}
//         </p>
//         <p style={{ fontSize: ".8rem", color: "#6B6478" }}>
//           الذكاء الاصطناعي يبني هويتك التجارية الآن...
//         </p>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: ".5rem",
//           width: "100%",
//           maxWidth: 340,
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
//                 i < phase
//                   ? "#4ADE8011"
//                   : i === phase
//                     ? "#C9973A11"
//                     : "transparent",
//               color:
//                 i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
//               transition: "all .3s",
//             }}
//           >
//             <div
//               style={{
//                 width: 7,
//                 height: 7,
//                 borderRadius: "50%",
//                 flexShrink: 0,
//                 background:
//                   i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
//                 animation:
//                   i === phase ? "blink 1s ease-in-out infinite" : "none",
//               }}
//             />
//             <span>
//               {i < phase ? "✓ " : ""}
//               {p.label}
//             </span>
//           </div>
//         ))}
//       </div>
//       <style>{`@keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
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
//   const [socialData, setSocialData] = useState<any>(null);

//   const brand = result?.brandIdentity ?? {};
//   const logoRaw = result?.logo ?? {};
//   const logoStr =
//     typeof logoRaw === "string"
//       ? logoRaw
//       : (logoRaw?.svg ??
//         logoRaw?.svgCode ??
//         logoRaw?.content ??
//         logoRaw?.code ??
//         "");
//   const logo = sanitizeSVGClient(logoStr);
//   const social = socialData ?? result?.socialMedia ?? {};
//   const landing = result?.landingPage ?? {};
//   const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
//   const competitors = result?.competitors ?? {};
//   const projectId = result?.projectId ?? result?._id ?? "";

//   const namesRaw: any[] = brand?.names ?? [];
//   const nameObjects: { name: string; reason?: string; meaning?: string }[] =
//     namesRaw.map((n: any) => (typeof n === "string" ? { name: n } : n));

//   const displayName =
//     result?.displayName ??
//     brand?.recommendedName ??
//     brand?.name ??
//     nameObjects[0]?.name ??
//     "Brand";

//   const primary = brand?.primaryColor ?? brand?.colors?.[0]?.hex ?? "#C9973A";
//   const secondary =
//     brand?.secondaryColor ?? brand?.colors?.[1]?.hex ?? "#0E0E1A";

//   return (
//     <div className="page fade-up">
//       <div className="wrap" style={{ maxWidth: 800 }}>
//         <div className="topbar">
//           <button className="icon-btn" onClick={onBack}>
//             ←
//           </button>
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
//               <defs>
//                 <linearGradient
//                   id="resHexGrad"
//                   x1="0%"
//                   y1="0%"
//                   x2="100%"
//                   y2="100%"
//                 >
//                   <stop offset="0%" stopColor="#F0C96B" />
//                   <stop offset="100%" stopColor="#C9973A" />
//                 </linearGradient>
//               </defs>
//               <polygon
//                 points="18,2 32,10 32,26 18,34 4,26 4,10"
//                 fill="url(#resHexGrad)"
//               />
//               <text
//                 x="18"
//                 y="23"
//                 textAnchor="middle"
//                 fontFamily="Tajawal, sans-serif"
//                 fontSize="13"
//                 fontWeight="900"
//                 fill="#08080F"
//               >
//                 EG
//               </text>
//             </svg>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <span
//                 style={{
//                   fontFamily: "Sora, sans-serif",
//                   fontSize: "14px",
//                   fontWeight: 800,
//                   background: "linear-gradient(90deg,#F0C96B,#C9973A)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                   lineHeight: 1.1,
//                 }}
//               >
//                 EG Brand
//               </span>
//               <span
//                 style={{
//                   fontFamily: "Tajawal, sans-serif",
//                   fontSize: "9px",
//                   color: "#5A5270",
//                   letterSpacing: "0.5px",
//                   lineHeight: 1,
//                 }}
//               ></span>
//             </div>
//           </div>
//           <div style={{ width: 36 }} />
//         </div>

//         {/* Hero Card */}
//         <div
//           style={{
//             background: `linear-gradient(135deg, ${secondary} 0%, #17172B 100%)`,
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
//               background: `radial-gradient(circle, ${primary}18, transparent 70%)`,
//               pointerEvents: "none",
//             }}
//           />

//           {nameObjects.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 gap: ".375rem",
//                 justifyContent: "center",
//                 flexWrap: "wrap",
//                 marginBottom: "1.125rem",
//               }}
//             >
//               {nameObjects.map((n, i) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                   }}
//                 >
//                   <span
//                     style={{
//                       padding: ".25rem .75rem",
//                       borderRadius: 20,
//                       fontSize: ".72rem",
//                       border:
//                         n.name === brand.recommendedName
//                           ? `1px solid ${primary}`
//                           : "1px solid #C9973A33",
//                       background:
//                         n.name === brand.recommendedName
//                           ? primary
//                           : "transparent",
//                       color:
//                         n.name === brand.recommendedName
//                           ? secondary
//                           : "#8A8498",
//                       fontWeight: n.name === brand.recommendedName ? 700 : 400,
//                     }}
//                   >
//                     {n.name}
//                     {n.name === brand.recommendedName && " ✦"}
//                   </span>
//                   {n.meaning && (
//                     <span
//                       style={{
//                         fontSize: ".58rem",
//                         color: "#3A3650",
//                         marginTop: 2,
//                       }}
//                     >
//                       {n.meaning}
//                     </span>
//                   )}
//                 </div>
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
//           <p
//             style={{
//               fontSize: "1rem",
//               color: primary,
//               fontWeight: 500,
//               marginBottom: ".25rem",
//             }}
//           >
//             {brand?.tagline?.ar ?? brand?.tagline ?? ""}
//           </p>
//           <p
//             style={{
//               fontSize: ".78rem",
//               color: "#8A8498",
//               fontStyle: "italic",
//             }}
//           >
//             {brand?.tagline?.en ?? ""}
//           </p>
//         </div>

//         {/* Tabs */}
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
//                 border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`,
//                 background: tab === t.id ? primary : "transparent",
//                 color: tab === t.id ? secondary : "#8A8498",
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

//         {tab === "identity" && (
//           <IdentityTab
//             brand={brand}
//             primary={primary}
//             nameObjects={nameObjects}
//           />
//         )}
//         {tab === "logo" && (
//           <LogoTab logo={logo} displayName={displayName} brand={brand} />
//         )}
//         {tab === "social" && (
//           <SocialTab
//             social={social}
//             displayName={displayName}
//             projectId={projectId}
//             onSocialUpdate={(s) => setSocialData(s)}
//           />
//         )}
//         {tab === "landing" && (
//           <LandingTab
//             landing={landing}
//             displayName={displayName}
//             primary={primary}
//             secondary={secondary}
//           />
//         )}
//         {tab === "brochure" && (
//           <BrochureTab
//             brand={brand}
//             brochureContent={brochureContent}
//             displayName={displayName}
//             primary={primary}
//             secondary={secondary}
//           />
//         )}
//         {tab === "competitors" && (
//           <CompetitorsTab competitors={competitors} primary={primary} />
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

// // sanitize SVG client-side
// function sanitizeSVGClient(raw: string): string {
//   if (!raw || !raw.includes("<svg")) return "";
//   let svg = raw.trim();
//   if (!svg.includes("xmlns"))
//     svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
//   if (!svg.includes("viewBox"))
//     svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
//   return svg;
// }

// /* ── IDENTITY TAB ── */
// function IdentityTab({
//   brand,
//   primary,
//   nameObjects,
// }: {
//   brand: any;
//   primary: string;
//   nameObjects: any[];
// }) {
//   const scores = [
//     { l: "الهوية والتميز البصري", v: brand?.score?.identity ?? 85 },
//     { l: "الجاذبية التسويقية", v: brand?.score?.marketing ?? 80 },
//     { l: "سهولة التذكر والانتشار", v: brand?.score?.memory ?? 88 },
//     { l: "الملاءمة للثقافة العربية", v: brand?.score?.arabicFit ?? 90 },
//   ];

//   return (
//     <div className="fade-up">
//       {nameObjects.length > 0 && nameObjects.some((n) => n.reason) && (
//         <div className="card">
//           <div className="clabel">مقترحات الأسماء المدروسة</div>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
//           >
//             {nameObjects.map((n, i) => (
//               <div
//                 key={i}
//                 style={{
//                   background:
//                     n.name === brand.recommendedName
//                       ? `${primary}0D`
//                       : "#0A0A14",
//                   border: `1px solid ${n.name === brand.recommendedName ? primary + "44" : "#1E1E2E"}`,
//                   borderRadius: 12,
//                   padding: "1rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: ".5rem",
//                     marginBottom: ".375rem",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "1rem",
//                       fontWeight: 700,
//                       color:
//                         n.name === brand.recommendedName ? primary : "#F0EDE6",
//                     }}
//                   >
//                     {n.name}
//                   </span>
//                   {n.name === brand.recommendedName && (
//                     <span
//                       style={{
//                         padding: ".15rem .5rem",
//                         borderRadius: 5,
//                         fontSize: ".62rem",
//                         background: primary,
//                         color: "#08080F",
//                         fontWeight: 700,
//                       }}
//                     >
//                       موصى به
//                     </span>
//                   )}
//                   {n.meaning && (
//                     <span style={{ fontSize: ".72rem", color: "#8A8498" }}>
//                       — {n.meaning}
//                     </span>
//                   )}
//                 </div>
//                 {n.reason && (
//                   <p
//                     style={{
//                       fontSize: ".78rem",
//                       color: "#8A8498",
//                       lineHeight: 1.6,
//                       margin: 0,
//                     }}
//                   >
//                     {n.reason}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

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
//                   <span
//                     style={{
//                       fontSize: "9px",
//                       color: i === 3 ? "#1A1A1A" : "rgba(255,255,255,.9)",
//                       fontWeight: 700,
//                     }}
//                   >
//                     {c.name}
//                   </span>
//                   <span
//                     style={{
//                       fontSize: "8px",
//                       color:
//                         i === 3 ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.6)",
//                       fontFamily: "monospace",
//                     }}
//                   >
//                     {c.hex}
//                   </span>
//                 </div>
//               ))}
//             </div>
//             <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
//               {brand.colors.map((c: any, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: ".35rem",
//                     fontSize: ".78rem",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 12,
//                       height: 12,
//                       borderRadius: 3,
//                       background: c.hex,
//                       border: "1px solid rgba(255,255,255,.1)",
//                     }}
//                   />
//                   <span style={{ color: "#C4BDB5" }}>{c.name}</span>
//                   <span style={{ fontFamily: "monospace", color: "#8A8498" }}>
//                     {c.hex}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <p style={{ color: "#3A3650", fontSize: ".82rem" }}>
//             لم يتم توليد لوحة الألوان
//           </p>
//         )}
//       </div>

//       <div className="card">
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             marginBottom: "1.25rem",
//           }}
//         >
//           <div className="clabel" style={{ marginBottom: 0 }}>
//             مؤشر قوة البراند
//           </div>
//           <div style={{ textAlign: "center" }}>
//             <div
//               style={{
//                 fontSize: "2.75rem",
//                 fontWeight: 900,
//                 color: primary,
//                 lineHeight: 1,
//                 fontFamily: "Sora,sans-serif",
//               }}
//             >
//               {brand?.score?.overall ?? 86}
//             </div>
//             <div style={{ fontSize: ".6rem", color: "#8A8498" }}>/100</div>
//           </div>
//         </div>
//         {scores.map((s, i) => (
//           <div
//             key={i}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: ".75rem",
//               marginBottom: ".65rem",
//             }}
//           >
//             <span
//               style={{
//                 fontSize: ".77rem",
//                 color: "#8A8498",
//                 width: 180,
//                 textAlign: "right",
//                 flexShrink: 0,
//               }}
//             >
//               {s.l}
//             </span>
//             <div
//               style={{
//                 flex: 1,
//                 height: 6,
//                 background: "#1E1E2E",
//                 borderRadius: 3,
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   height: "100%",
//                   background: `linear-gradient(90deg, ${primary}, ${primary}88)`,
//                   borderRadius: 3,
//                   width: `${s.v}%`,
//                 }}
//               />
//             </div>
//             <span
//               style={{
//                 fontSize: ".75rem",
//                 fontWeight: 700,
//                 color: primary,
//                 width: 24,
//                 textAlign: "left",
//               }}
//             >
//               {s.v}
//             </span>
//           </div>
//         ))}
//       </div>

//       <div className="card">
//         <div className="clabel">استراتيجية التموضع والجمهور</div>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: ".75rem",
//           }}
//         >
//           {[
//             ["التموضع التسويقي", brand?.strategy?.positioning],
//             ["الجمهور المستهدف", brand?.strategy?.audience],
//           ].map(([label, val]) => (
//             <div
//               key={label}
//               style={{
//                 background: "#0A0A14",
//                 borderRadius: 10,
//                 padding: "1rem",
//                 border: "1px solid #1E1E2E",
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: ".65rem",
//                   fontWeight: 700,
//                   color: primary,
//                   marginBottom: ".375rem",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 {label}
//               </div>
//               <div
//                 style={{
//                   fontSize: ".82rem",
//                   color: "#C4BDB5",
//                   lineHeight: 1.6,
//                 }}
//               >
//                 {val ?? "—"}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div
//           style={{
//             background: "#0A0A14",
//             borderRadius: 10,
//             padding: "1rem",
//             border: "1px solid #1E1E2E",
//             marginTop: ".75rem",
//           }}
//         >
//           <div
//             style={{
//               fontSize: ".65rem",
//               fontWeight: 700,
//               color: primary,
//               marginBottom: ".375rem",
//               textTransform: "uppercase",
//             }}
//           >
//             القيمة الفريدة المقترحة
//           </div>
//           <div
//             style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}
//           >
//             {brand?.strategy?.value ?? "—"}
//           </div>
//         </div>
//       </div>

//       <div className="card">
//         <div className="clabel">قصة العلامة التجارية</div>
//         <p
//           style={{
//             fontSize: ".9rem",
//             color: "#C4BDB5",
//             lineHeight: 1.9,
//             marginBottom: ".875rem",
//           }}
//         >
//           {brand?.story?.ar ?? brand?.story ?? "—"}
//         </p>
//         {brand?.story?.en && (
//           <p
//             style={{
//               fontSize: ".8rem",
//               color: "#8A8498",
//               fontStyle: "italic",
//               lineHeight: 1.7,
//             }}
//           >
//             {brand.story.en}
//           </p>
//         )}
//       </div>

//       {brand?.typography && (
//         <div className="card">
//           <div className="clabel">هوية الخطوط المقترحة</div>
//           <div
//             style={{
//               background: "#0A0A14",
//               borderRadius: 12,
//               padding: "1.25rem",
//               textAlign: "center",
//               border: "1px solid #1E1E2E",
//             }}
//           >
//             <div
//               style={{
//                 fontFamily: "Sora,sans-serif",
//                 fontSize: "1.75rem",
//                 fontWeight: 700,
//                 color: primary,
//                 marginBottom: ".25rem",
//               }}
//             >
//               {brand.typography.display}
//             </div>
//             <div
//               style={{
//                 fontSize: "1.1rem",
//                 color: "rgba(240,237230,.65)",
//                 marginBottom: ".5rem",
//                 fontWeight: 300,
//               }}
//             >
//               {brand.typography.arabic}
//             </div>
//             <div style={{ fontSize: ".72rem", color: "#8A8498" }}>
//               {brand.typography.style}
//             </div>
//           </div>
//         </div>
//       )}

//       {(brand?.voice || brand?.messages) && (
//         <div className="card">
//           <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
//           {brand?.voice?.tone && (
//             <p
//               style={{
//                 fontSize: ".85rem",
//                 color: "#8A8498",
//                 marginBottom: ".75rem",
//               }}
//             >
//               النبرة العامة:{" "}
//               <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span>
//             </p>
//           )}
//           {brand?.voice?.traits?.length > 0 && (
//             <div
//               style={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: ".375rem",
//                 marginBottom: "1.25rem",
//               }}
//             >
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
//               <p
//                 style={{
//                   fontSize: ".8rem",
//                   fontWeight: 700,
//                   color: "#8A8498",
//                   marginBottom: ".5rem",
//                 }}
//               >
//                 الرسائل التسويقية:
//               </p>
//               {brand.messages.map((m: string, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     display: "flex",
//                     gap: ".625rem",
//                     alignItems: "flex-start",
//                     padding: ".4rem 0",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 6,
//                       height: 6,
//                       borderRadius: "50%",
//                       background: primary,
//                       marginTop: ".45rem",
//                       flexShrink: 0,
//                     }}
//                   />
//                   <span
//                     style={{
//                       fontSize: ".82rem",
//                       color: "#C4BDB5",
//                       lineHeight: 1.6,
//                     }}
//                   >
//                     {m}
//                   </span>
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
// function LogoTab({
//   logo,
//   displayName,
//   brand,
// }: {
//   logo: string;
//   displayName: string;
//   brand: any;
// }) {
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

//   if (!logo)
//     return (
//       <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//         <p style={{ color: "#3A3650" }}>
//           ⚠️ لم يتم توليد الشعار، جاري استخدام الشعار الاحتياطي
//         </p>
//       </div>
//     );

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
//             style={{
//               width: "100%",
//               maxWidth: 220,
//               maxHeight: 220,
//               display: "flex",
//               justifyContent: "center",
//             }}
//           />
//         </div>
//         <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
//           <button className="outline-btn" onClick={handleDownload}>
//             ⬇ تحميل SVG
//           </button>
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
//             style={{
//               width: "100%",
//               maxWidth: 220,
//               maxHeight: 220,
//               display: "flex",
//               justifyContent: "center",
//             }}
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

// /* ── SOCIAL TAB ── */
// function SocialTab({
//   social,
//   displayName,
//   projectId,
//   onSocialUpdate,
// }: {
//   social: any;
//   displayName: string;
//   projectId?: string;
//   onSocialUpdate?: (s: any) => void;
// }) {
//   const [ptab, setPtab] = useState<
//     "map" | "posts" | "videos" | "ready" | "plan"
//   >("map");
//   const [generating, setGenerating] = useState(false);
//   const [genMsg, setGenMsg] = useState("");
//   const [filterCat, setFilterCat] = useState("الكل");

//   const igPosts = social?.instagram ?? [];
//   const twTweets = social?.twitter ?? [];
//   const contentMap = social?.contentMap ?? [];
//   const postIdeas = social?.postIdeas ?? [];
//   const videoIdeas = social?.videoIdeas ?? [];
//   const weeklyPlan = social?.strategy?.weeklyPlan ?? [];

//   const categories = [
//     "الكل",
//     ...(Array.from(
//       new Set(postIdeas.map((p: any) => p.category).filter(Boolean)),
//     ) as string[]),
//   ];
//   const filteredPosts =
//     filterCat === "الكل"
//       ? postIdeas
//       : postIdeas.filter((p: any) => p.category === filterCat);

//   const catColor: Record<string, string> = {
//     Lifestyle: "#C9973A",
//     "عرض المنتج/الخدمة": "#60A5FA",
//     "قصص البراند": "#4ADE80",
//     "عروض وتفاعل": "#F87171",
//   };

//   const typeIcon: Record<string, string> = {
//     صورة: "🖼",
//     فيديو: "🎬",
//     كاروسيل: "📑",
//     Reel: "🎞",
//   };

//   const handleGenerateMore = async () => {
//     if (!projectId) return;
//     setGenerating(true);
//     setGenMsg("جاري توليد محتوى إضافي...");
//     try {
//       const res = await fetch(`/api/projects/${projectId}/social/generate`, {
//         method: "POST",
//       });
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
//     { id: "map", label: "🗺 خريطة المحتوى" },
//     { id: "posts", label: "💡 أفكار بوستات" },
//     { id: "videos", label: "🎬 أفكار فيديوهات" },
//     { id: "ready", label: "📋 منشورات جاهزة" },
//     { id: "plan", label: "📅 خطة أسبوعية" },
//   ];

//   return (
//     <div className="fade-up">
//       <div
//         style={{
//           display: "flex",
//           gap: ".3rem",
//           overflowX: "auto",
//           paddingBottom: ".5rem",
//           marginBottom: "1rem",
//           scrollbarWidth: "none",
//         }}
//       >
//         {SUBTABS.map(({ id, label }) => (
//           <button
//             key={id}
//             onClick={() => setPtab(id as any)}
//             style={{
//               padding: ".4rem .85rem",
//               borderRadius: 20,
//               border: "1.5px solid #1E1E2E",
//               background: ptab === id ? "#C9973A" : "transparent",
//               color: ptab === id ? "#08080F" : "#8A8498",
//               fontFamily: "Tajawal,sans-serif",
//               fontSize: ".78rem",
//               fontWeight: ptab === id ? 700 : 400,
//               cursor: "pointer",
//               whiteSpace: "nowrap",
//               transition: "all .2s",
//             }}
//           >
//             {label}
//           </button>
//         ))}
//         <button
//           onClick={handleGenerateMore}
//           disabled={generating}
//           style={{
//             marginRight: "auto",
//             padding: ".4rem 1rem",
//             borderRadius: 20,
//             border: "1.5px solid #C9973A44",
//             background: generating ? "#1E1E2E" : "transparent",
//             color: generating ? "#8A8498" : "#C9973A",
//             fontFamily: "Tajawal,sans-serif",
//             fontSize: ".75rem",
//             fontWeight: 600,
//             cursor: generating ? "default" : "pointer",
//             whiteSpace: "nowrap",
//             display: "flex",
//             alignItems: "center",
//             gap: ".35rem",
//           }}
//         >
//           {generating ? "⏳" : "✦"} توليد إضافي{" "}
//           <span
//             style={{
//               padding: ".1rem .4rem",
//               borderRadius: 4,
//               background: "#C9973A22",
//               fontSize: ".65rem",
//             }}
//           >
//             1 كريديت
//           </span>
//         </button>
//       </div>

//       {genMsg && (
//         <div
//           style={{
//             background: genMsg.startsWith("✓") ? "#4ADE8011" : "#F8717111",
//             border: `1px solid ${genMsg.startsWith("✓") ? "#4ADE8033" : "#F8717133"}`,
//             borderRadius: 8,
//             padding: ".6rem 1rem",
//             marginBottom: ".75rem",
//             fontSize: ".8rem",
//             color: genMsg.startsWith("✓") ? "#4ADE80" : "#F87171",
//             textAlign: "center",
//           }}
//         >
//           {genMsg}
//         </div>
//       )}

//       {ptab === "map" && (
//         <div className="card">
//           <div className="clabel">خريطة المحتوى — توزيع البوستات</div>
//           {contentMap.length === 0 ? (
//             <p
//               style={{
//                 color: "#3A3650",
//                 fontSize: ".82rem",
//                 textAlign: "center",
//                 padding: "1.5rem",
//               }}
//             >
//               لم يتم توليد خريطة المحتوى
//             </p>
//           ) : (
//             <>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "1.5rem",
//                   marginBottom: "1.5rem",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     position: "relative",
//                     width: 130,
//                     height: 130,
//                     flexShrink: 0,
//                   }}
//                 >
//                   <svg
//                     viewBox="0 0 36 36"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       transform: "rotate(-90deg)",
//                     }}
//                   >
//                     {(() => {
//                       let offset = 0;
//                       return contentMap.map((seg: any, i: number) => {
//                         const val = seg.pct;
//                         const circ = 2 * Math.PI * 15.9;
//                         const dash = (val / 100) * circ;
//                         const gap = circ - dash;
//                         const el = (
//                           <circle
//                             key={i}
//                             cx="18"
//                             cy="18"
//                             r="15.9"
//                             fill="none"
//                             stroke={seg.color || "#C9973A"}
//                             strokeWidth="3.2"
//                             strokeDasharray={`${dash} ${gap}`}
//                             strokeDashoffset={(-offset * circ) / 100}
//                           />
//                         );
//                         offset += val;
//                         return el;
//                       });
//                     })()}
//                   </svg>
//                   <div
//                     style={{
//                       position: "absolute",
//                       inset: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       flexDirection: "column",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: ".62rem",
//                         color: "#8A8498",
//                         lineHeight: 1,
//                       }}
//                     >
//                       محتوى
//                     </span>
//                     <span
//                       style={{
//                         fontSize: ".72rem",
//                         fontWeight: 700,
//                         color: "#F0EDE6",
//                       }}
//                     >
//                       متنوع
//                     </span>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1, minWidth: 160 }}>
//                   {contentMap.map((seg: any, i: number) => (
//                     <div
//                       key={i}
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: ".5rem",
//                         marginBottom: ".5rem",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 10,
//                           height: 10,
//                           borderRadius: 2,
//                           background: seg.color,
//                           flexShrink: 0,
//                         }}
//                       />
//                       <span
//                         style={{ fontSize: ".8rem", color: "#C4BDB5", flex: 1 }}
//                       >
//                         {seg.category}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: ".8rem",
//                           fontWeight: 700,
//                           color: seg.color,
//                         }}
//                       >
//                         {seg.pct}%
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: ".75rem",
//                 }}
//               >
//                 {contentMap.map((seg: any, i: number) => (
//                   <div
//                     key={i}
//                     style={{
//                       background: "#0A0A14",
//                       borderRadius: 12,
//                       padding: "1rem",
//                       borderRight: `3px solid ${seg.color}`,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: ".5rem",
//                         marginBottom: ".5rem",
//                       }}
//                     >
//                       <div
//                         style={{
//                           width: 8,
//                           height: 8,
//                           borderRadius: "50%",
//                           background: seg.color,
//                         }}
//                       />
//                       <span
//                         style={{
//                           fontSize: ".85rem",
//                           fontWeight: 700,
//                           color: seg.color,
//                         }}
//                       >
//                         {seg.category}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: ".72rem",
//                           color: "#3A3650",
//                           marginRight: "auto",
//                         }}
//                       >
//                         {seg.pct}% من المحتوى
//                       </span>
//                     </div>
//                     {seg.desc && (
//                       <p
//                         style={{
//                           fontSize: ".78rem",
//                           color: "#8A8498",
//                           marginBottom: ".5rem",
//                           lineHeight: 1.6,
//                         }}
//                       >
//                         {seg.desc}
//                       </p>
//                     )}
//                     {seg.examples?.length > 0 && (
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           gap: ".3rem",
//                         }}
//                       >
//                         {seg.examples.map((ex: string, j: number) => (
//                           <div
//                             key={j}
//                             style={{
//                               display: "flex",
//                               gap: ".4rem",
//                               alignItems: "flex-start",
//                             }}
//                           >
//                             <span
//                               style={{
//                                 color: seg.color,
//                                 fontSize: ".7rem",
//                                 marginTop: 2,
//                               }}
//                             >
//                               ›
//                             </span>
//                             <span
//                               style={{
//                                 fontSize: ".78rem",
//                                 color: "#C4BDB5",
//                                 lineHeight: 1.55,
//                               }}
//                             >
//                               {ex}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {ptab === "posts" && (
//         <div>
//           {categories.length > 1 && (
//             <div
//               style={{
//                 display: "flex",
//                 gap: ".35rem",
//                 flexWrap: "wrap",
//                 marginBottom: "1rem",
//               }}
//             >
//               {categories.map((cat) => (
//                 <button
//                   key={cat}
//                   onClick={() => setFilterCat(cat)}
//                   style={{
//                     padding: ".3rem .7rem",
//                     borderRadius: 16,
//                     border: `1px solid ${filterCat === cat ? catColor[cat] || "#C9973A" : "#1E1E2E"}`,
//                     background:
//                       filterCat === cat
//                         ? (catColor[cat] || "#C9973A") + "22"
//                         : "transparent",
//                     color:
//                       filterCat === cat
//                         ? catColor[cat] || "#C9973A"
//                         : "#8A8498",
//                     fontSize: ".72rem",
//                     cursor: "pointer",
//                   }}
//                 >
//                   {cat}
//                 </button>
//               ))}
//             </div>
//           )}
//           {filteredPosts.length === 0 ? (
//             <div
//               className="card"
//               style={{ textAlign: "center", padding: "2rem" }}
//             >
//               <p style={{ color: "#3A3650", fontSize: ".82rem" }}>
//                 لم يتم توليد أفكار البوستات
//               </p>
//             </div>
//           ) : (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: ".75rem",
//               }}
//             >
//               {filteredPosts.map((p: any, i: number) => {
//                 const cc = catColor[p.category] || "#C9973A";
//                 return (
//                   <div
//                     key={i}
//                     style={{
//                       background: "#0A0A14",
//                       border: "1px solid #1E1E2E",
//                       borderRadius: 14,
//                       padding: "1.125rem",
//                       borderRight: `3px solid ${cc}`,
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: ".5rem",
//                         marginBottom: ".625rem",
//                       }}
//                     >
//                       <span style={{ fontSize: "1rem" }}>
//                         {typeIcon[p.type] || "📌"}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: ".82rem",
//                           fontWeight: 700,
//                           color: "#F0EDE6",
//                           flex: 1,
//                         }}
//                       >
//                         {p.title}
//                       </span>
//                       <span
//                         style={{
//                           padding: ".15rem .5rem",
//                           borderRadius: 5,
//                           fontSize: ".6rem",
//                           background: cc + "22",
//                           color: cc,
//                           border: `1px solid ${cc}44`,
//                         }}
//                       >
//                         {p.type}
//                       </span>
//                       <span
//                         style={{
//                           padding: ".15rem .5rem",
//                           borderRadius: 5,
//                           fontSize: ".6rem",
//                           background: "#1E1E2E",
//                           color: "#8A8498",
//                         }}
//                       >
//                         {p.platform}
//                       </span>
//                     </div>
//                     {p.visual && (
//                       <div
//                         style={{
//                           background: "#08080F",
//                           borderRadius: 8,
//                           padding: ".625rem .75rem",
//                           marginBottom: ".625rem",
//                           borderRight: `2px solid ${cc}66`,
//                         }}
//                       >
//                         <div
//                           style={{
//                             fontSize: ".6rem",
//                             color: cc,
//                             fontWeight: 700,
//                             marginBottom: ".25rem",
//                           }}
//                         >
//                           🎨 المشهد البصري
//                         </div>
//                         <p
//                           style={{
//                             fontSize: ".78rem",
//                             color: "#C4BDB5",
//                             lineHeight: 1.6,
//                             margin: 0,
//                           }}
//                         >
//                           {p.visual}
//                         </p>
//                       </div>
//                     )}
//                     {p.caption && (
//                       <p
//                         style={{
//                           fontSize: ".82rem",
//                           color: "#C4BDB5",
//                           lineHeight: 1.7,
//                           marginBottom: ".5rem",
//                           whiteSpace: "pre-wrap",
//                         }}
//                       >
//                         {p.caption}
//                       </p>
//                     )}
//                     {p.hashtags && (
//                       <p
//                         style={{
//                           fontSize: ".75rem",
//                           color: "#60A5FA",
//                           lineHeight: 1.7,
//                           marginBottom: ".375rem",
//                         }}
//                       >
//                         {p.hashtags}
//                       </p>
//                     )}
//                     {p.category && (
//                       <div style={{ marginTop: ".5rem" }}>
//                         <span
//                           style={{
//                             padding: ".15rem .5rem",
//                             borderRadius: 5,
//                             fontSize: ".62rem",
//                             background: cc + "15",
//                             color: cc,
//                             border: `1px solid ${cc}33`,
//                           }}
//                         >
//                           {p.category}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {ptab === "videos" && (
//         <div
//           style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
//         >
//           {videoIdeas.length === 0 ? (
//             <div
//               className="card"
//               style={{ textAlign: "center", padding: "2rem" }}
//             >
//               <p style={{ color: "#3A3650", fontSize: ".82rem" }}>
//                 لم يتم توليد أفكار الفيديوهات
//               </p>
//             </div>
//           ) : (
//             videoIdeas.map((v: any, i: number) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "#0A0A14",
//                   border: "1px solid #1E1E2E",
//                   borderRadius: 14,
//                   padding: "1.25rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: ".5rem",
//                     marginBottom: ".875rem",
//                   }}
//                 >
//                   <span style={{ fontSize: "1.1rem" }}>🎬</span>
//                   <span
//                     style={{
//                       fontSize: ".82rem",
//                       fontWeight: 700,
//                       color: "#F0EDE6",
//                       flex: 1,
//                     }}
//                   >
//                     {v.concept || `فكرة فيديو ${i + 1}`}
//                   </span>
//                   <span
//                     style={{
//                       padding: ".15rem .5rem",
//                       borderRadius: 5,
//                       fontSize: ".62rem",
//                       background: "#69C9D033",
//                       color: "#69C9D0",
//                     }}
//                   >
//                     {v.platform}
//                   </span>
//                   <span
//                     style={{
//                       padding: ".15rem .5rem",
//                       borderRadius: 5,
//                       fontSize: ".62rem",
//                       background: "#1E1E2E",
//                       color: "#8A8498",
//                     }}
//                   >
//                     {v.duration}
//                   </span>
//                 </div>
//                 {v.hook && (
//                   <div
//                     style={{
//                       background: "#C9973A0D",
//                       border: "1px solid #C9973A22",
//                       borderRadius: 8,
//                       padding: ".625rem .75rem",
//                       marginBottom: ".625rem",
//                     }}
//                   >
//                     <div
//                       style={{
//                         fontSize: ".6rem",
//                         color: "#C9973A",
//                         fontWeight: 700,
//                         marginBottom: ".2rem",
//                       }}
//                     >
//                       ⚡ الجملة الافتتاحية (أول 3 ثواني)
//                     </div>
//                     <p
//                       style={{
//                         fontSize: ".85rem",
//                         fontWeight: 600,
//                         color: "#F0EDE6",
//                         margin: 0,
//                       }}
//                     >
//                       "{v.hook}"
//                     </p>
//                   </div>
//                 )}
//                 {v.scenes?.length > 0 && (
//                   <div style={{ marginBottom: ".625rem" }}>
//                     <div
//                       style={{
//                         fontSize: ".6rem",
//                         color: "#8A8498",
//                         fontWeight: 700,
//                         marginBottom: ".375rem",
//                       }}
//                     >
//                       🎞 المشاهد
//                     </div>
//                     {v.scenes.map((s: string, j: number) => (
//                       <div
//                         key={j}
//                         style={{
//                           display: "flex",
//                           gap: ".5rem",
//                           alignItems: "flex-start",
//                           padding: ".3rem 0",
//                           borderBottom:
//                             j < v.scenes.length - 1
//                               ? "1px solid #1E1E2E"
//                               : "none",
//                         }}
//                       >
//                         <span
//                           style={{
//                             width: 18,
//                             height: 18,
//                             borderRadius: "50%",
//                             background: "#1E1E2E",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: ".6rem",
//                             color: "#8A8498",
//                             flexShrink: 0,
//                             marginTop: 1,
//                           }}
//                         >
//                           {j + 1}
//                         </span>
//                         <span
//                           style={{
//                             fontSize: ".8rem",
//                             color: "#C4BDB5",
//                             lineHeight: 1.55,
//                           }}
//                         >
//                           {s}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: ".5rem",
//                   }}
//                 >
//                   {v.music && (
//                     <div
//                       style={{
//                         background: "#08080F",
//                         borderRadius: 8,
//                         padding: ".5rem .625rem",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: ".6rem",
//                           color: "#8A8498",
//                           marginBottom: ".2rem",
//                         }}
//                       >
//                         🎵 نوع الموسيقى
//                       </div>
//                       <div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>
//                         {v.music}
//                       </div>
//                     </div>
//                   )}
//                   {v.cta && (
//                     <div
//                       style={{
//                         background: "#08080F",
//                         borderRadius: 8,
//                         padding: ".5rem .625rem",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: ".6rem",
//                           color: "#8A8498",
//                           marginBottom: ".2rem",
//                         }}
//                       >
//                         📢 نداء الإجراء
//                       </div>
//                       <div style={{ fontSize: ".78rem", color: "#4ADE80" }}>
//                         {v.cta}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {ptab === "ready" && (
//         <div className="card">
//           <div className="clabel">منشورات جاهزة للنسخ والنشر</div>
//           {igPosts.length > 0 && (
//             <div style={{ marginBottom: "1.25rem" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".5rem",
//                   marginBottom: ".75rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 22,
//                     height: 22,
//                     borderRadius: 6,
//                     background:
//                       "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: ".65rem",
//                     fontWeight: 700,
//                     color: "#fff",
//                   }}
//                 >
//                   IG
//                 </div>
//                 <span
//                   style={{
//                     fontSize: ".8rem",
//                     fontWeight: 700,
//                     color: "#F0EDE6",
//                   }}
//                 >
//                   Instagram
//                 </span>
//               </div>
//               {igPosts.map((p: any, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     background: "linear-gradient(180deg,#13131E,#0A0A14)",
//                     border: "1px solid #1E1E2E",
//                     borderRadius: 12,
//                     padding: "1rem",
//                     marginBottom: ".625rem",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: ".5rem",
//                       marginBottom: ".625rem",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: 28,
//                         height: 28,
//                         borderRadius: "50%",
//                         background:
//                           "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: ".6rem",
//                         fontWeight: 700,
//                         color: "#fff",
//                         flexShrink: 0,
//                       }}
//                     >
//                       {displayName.slice(0, 2).toUpperCase()}
//                     </div>
//                     <div>
//                       <div
//                         style={{
//                           fontSize: ".78rem",
//                           fontWeight: 700,
//                           color: "#F0EDE6",
//                         }}
//                       >
//                         {displayName}
//                       </div>
//                       <div style={{ fontSize: ".6rem", color: "#3A3650" }}>
//                         حساب رسمي
//                       </div>
//                     </div>
//                   </div>
//                   <p
//                     style={{
//                       fontSize: ".82rem",
//                       color: "#C4BDB5",
//                       lineHeight: 1.75,
//                       marginBottom: ".5rem",
//                       whiteSpace: "pre-wrap",
//                     }}
//                   >
//                     {p.caption ?? p.text ?? ""}
//                   </p>
//                   <p
//                     style={{
//                       fontSize: ".75rem",
//                       color: "#60A5FA",
//                       lineHeight: 1.7,
//                       marginBottom: ".375rem",
//                     }}
//                   >
//                     {p.hashtags ?? ""}
//                   </p>
//                   {p.theme && (
//                     <span
//                       style={{
//                         padding: ".15rem .5rem",
//                         borderRadius: 5,
//                         fontSize: ".62rem",
//                         background: "rgba(201,151,58,.1)",
//                         color: "#C9973A",
//                         border: "1px solid rgba(201,151,58,.2)",
//                       }}
//                     >
//                       {p.theme}
//                     </span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//           {twTweets.length > 0 && (
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: ".5rem",
//                   marginBottom: ".75rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 22,
//                     height: 22,
//                     borderRadius: 6,
//                     background: "#1D9BF0",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: ".65rem",
//                     fontWeight: 700,
//                     color: "#fff",
//                   }}
//                 >
//                   X
//                 </div>
//                 <span
//                   style={{
//                     fontSize: ".8rem",
//                     fontWeight: 700,
//                     color: "#F0EDE6",
//                   }}
//                 >
//                   Twitter / X
//                 </span>
//               </div>
//               {twTweets.map((t: any, i: number) => (
//                 <div
//                   key={i}
//                   style={{
//                     background: "#0A0A14",
//                     border: "1px solid #1E1E2E",
//                     borderRadius: 12,
//                     padding: "1rem",
//                     marginBottom: ".625rem",
//                     borderRight: "3px solid #1D9BF0",
//                   }}
//                 >
//                   <p
//                     style={{
//                       fontSize: ".85rem",
//                       color: "#C4BDB5",
//                       lineHeight: 1.7,
//                       whiteSpace: "pre-wrap",
//                       margin: 0,
//                     }}
//                   >
//                     {t.text ?? t.tweet ?? ""}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//           {igPosts.length === 0 && twTweets.length === 0 && (
//             <p
//               style={{
//                 color: "#3A3650",
//                 fontSize: ".82rem",
//                 textAlign: "center",
//                 padding: "1.5rem",
//               }}
//             >
//               لا يوجد منشورات جاهزة
//             </p>
//           )}
//         </div>
//       )}

//       {ptab === "plan" && (
//         <div>
//           <div className="card">
//             <div className="clabel">خطة النشر الأسبوعية</div>
//             {weeklyPlan.length > 0 ? (
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: ".5rem",
//                   marginBottom: "1.25rem",
//                 }}
//               >
//                 {weeklyPlan.map((day: any, i: number) => (
//                   <div
//                     key={i}
//                     style={{
//                       display: "grid",
//                       gridTemplateColumns: "80px 1fr auto",
//                       alignItems: "center",
//                       gap: ".75rem",
//                       padding: ".75rem",
//                       background: "#0A0A14",
//                       borderRadius: 10,
//                       border: "1px solid #1E1E2E",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: ".8rem",
//                         fontWeight: 700,
//                         color: "#C9973A",
//                       }}
//                     >
//                       {day.day}
//                     </span>
//                     <span style={{ fontSize: ".82rem", color: "#C4BDB5" }}>
//                       {day.content || "—"}
//                     </span>
//                     <span
//                       style={{
//                         fontSize: ".7rem",
//                         color: "#8A8498",
//                         background: "#1E1E2E",
//                         padding: ".15rem .45rem",
//                         borderRadius: 5,
//                         whiteSpace: "nowrap",
//                       }}
//                     >
//                       {day.platform || ""}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p
//                 style={{
//                   color: "#3A3650",
//                   fontSize: ".82rem",
//                   marginBottom: "1rem",
//                 }}
//               >
//                 لم يتم توليد الخطة الأسبوعية
//               </p>
//             )}
//           </div>
//           {social?.strategy && (
//             <div className="card">
//               <div className="clabel">إحصائيات الاستراتيجية</div>
//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gap: ".625rem",
//                   marginBottom: ".75rem",
//                 }}
//               >
//                 {[
//                   ["أفضل أوقات النشر", social.strategy.bestTimes],
//                   ["معدل النشر", social.strategy.frequency],
//                   ["نبرة المحتوى", social.strategy.tone],
//                 ]
//                   .filter(([, v]) => v)
//                   .map(([label, val]) => (
//                     <div
//                       key={label}
//                       style={{
//                         background: "#0A0A14",
//                         borderRadius: 10,
//                         padding: ".875rem",
//                         border: "1px solid #1E1E2E",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: ".6rem",
//                           fontWeight: 700,
//                           color: "#8A8498",
//                           marginBottom: ".375rem",
//                         }}
//                       >
//                         {label}
//                       </div>
//                       <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>
//                         {val}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//               {social.strategy.pillars?.length > 0 && (
//                 <div>
//                   <p
//                     style={{
//                       fontSize: ".75rem",
//                       color: "#8A8498",
//                       marginBottom: ".5rem",
//                     }}
//                   >
//                     أعمدة المحتوى:
//                   </p>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: ".375rem",
//                     }}
//                   >
//                     {social.strategy.pillars.map((p: string, i: number) => (
//                       <span
//                         key={i}
//                         style={{
//                           padding: ".25rem .65rem",
//                           borderRadius: 6,
//                           background: "rgba(201,151,58,.1)",
//                           color: "#C9973A",
//                           border: "1px solid rgba(201,151,58,.2)",
//                           fontSize: ".75rem",
//                         }}
//                       >
//                         {p}
//                       </span>
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
// function LandingTab({
//   landing,
//   displayName,
//   primary,
//   secondary,
// }: {
//   landing: any;
//   displayName: string;
//   primary: string;
//   secondary: string;
// }) {
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
// ${
//   landing?.testimonial?.text
//     ? `<div class="testimonial">
//   <div class="quote-mark">"</div>
//   <p class="quote-text">${landing.testimonial.text}</p>
//   <div class="quote-author">${landing.testimonial.name || ""}</div>
//   <div class="quote-role">${landing.testimonial.role || ""}</div>
// </div>`
//     : ""
// }
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
//       <div
//         style={{
//           display: "flex",
//           gap: ".375rem",
//           marginBottom: "1rem",
//           alignItems: "center",
//         }}
//       >
//         {[
//           ["preview", "👁 معاينة"],
//           ["code", "{ } الكود"],
//         ].map(([k, l]) => (
//           <button
//             key={k}
//             onClick={() => setView(k)}
//             style={{
//               padding: ".45rem .9rem",
//               borderRadius: 20,
//               border: "1.5px solid #1E1E2E",
//               background: view === k ? "#1E1E2E" : "transparent",
//               color: view === k ? "#F0EDE6" : "#8A8498",
//               fontFamily: "Tajawal,sans-serif",
//               fontSize: ".78rem",
//               cursor: "pointer",
//             }}
//           >
//             {l}
//           </button>
//         ))}
//         <button
//           className="gold-btn"
//           style={{
//             marginRight: "auto",
//             padding: ".45rem 1.1rem",
//             fontSize: ".78rem",
//           }}
//           onClick={handleDownload}
//         >
//           ⬇ تحميل HTML
//         </button>
//       </div>
//       {view === "preview" ? (
//         <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//           <div
//             style={{
//               background: "#0B0B12",
//               borderBottom: "1px solid #1E1E2E",
//               padding: ".5rem 1rem",
//               display: "flex",
//               alignItems: "center",
//               borderRadius: "18px 18px 0 0",
//               justifyContent: "space-between",
//             }}
//           >
//             <div style={{ display: "flex", gap: 5 }}>
//               {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
//                 <div
//                   key={c}
//                   style={{
//                     width: 10,
//                     height: 10,
//                     borderRadius: "50%",
//                     background: c,
//                   }}
//                 />
//               ))}
//             </div>
//             <span
//               style={{
//                 fontSize: ".7rem",
//                 color: "#3A3650",
//                 fontFamily: "monospace",
//               }}
//             >
//               {displayName.toLowerCase().replace(/\s+/g, "-")}.html
//             </span>
//             <div style={{ width: 40 }} />
//           </div>
//           <iframe
//             title="Landing Page Preview"
//             srcDoc={htmlCode}
//             style={{ width: "100%", height: "600px", border: "none" }}
//           />
//         </div>
//       ) : (
//         <div className="card">
//           <pre
//             style={{
//               background: "#0A0A14",
//               borderRadius: 10,
//               padding: "1rem",
//               fontFamily: "monospace",
//               fontSize: ".68rem",
//               color: "#4ADE80",
//               overflowX: "auto",
//               lineHeight: 1.65,
//               border: "1px solid #1E1E2E",
//               maxHeight: "450px",
//               overflowY: "auto",
//               whiteSpace: "pre-wrap",
//               wordBreak: "break-all",
//             }}
//           >
//             {htmlCode}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── BROCHURE TAB ── */
// function BrochureTab({
//   brand,
//   brochureContent,
//   displayName,
//   primary,
//   secondary,
// }: {
//   brand: any;
//   brochureContent: any;
//   displayName: string;
//   primary: string;
//   secondary: string;
// }) {
//   const taglineAr = brand?.tagline?.ar ?? brand?.tagline ?? "";
//   const taglineEn = brand?.tagline?.en ?? "";
//   const intro =
//     brochureContent?.intro ?? brand?.story?.ar ?? brand?.story ?? "";
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
// <div class="intro-band"><div class="intro-text">${intro}</div></div>
// <div class="body">
//   ${services.length > 0 ? `<div class="section-title">خدماتنا</div><div class="services-grid">${services.map((s: any) => `<div class="service-card"><div class="service-icon">${s.icon || "✦"}</div><div class="service-name">${s.name || ""}</div><div class="service-brief">${s.brief || ""}</div></div>`).join("")}</div>` : ""}
//   ${
//     sections.length > 0
//       ? `<div class="section-title">معلومات عن المشروع</div><div class="sections-grid">${sections.map((s: any) => `<div class="section-block"><h4>${s.title || ""}</h4><p>${s.content || ""}</p></div>`).join("")}</div>`
//       : `<div class="section-title">عن البراند</div><div class="sections-grid">${[
//           ["التموضع التسويقي", brand?.strategy?.positioning ?? ""],
//           ["الجمهور المستهدف", brand?.strategy?.audience ?? ""],
//           ["القيمة الفريدة", brand?.strategy?.value ?? ""],
//           ["نبرة الصوت", brand?.voice?.tone ?? ""],
//         ]
//           .map(
//             ([t, c]) =>
//               `<div class="section-block"><h4>${t}</h4><p>${c}</p></div>`,
//           )
//           .join("")}</div>`
//   }
//   ${whyUs.length > 0 ? `<div class="section-title">لماذا تختارنا؟</div><div class="why-grid">${whyUs.map((w: string) => `<div class="why-item"><div class="why-dot"></div><div class="why-text">${w}</div></div>`).join("")}</div>` : ""}
//   ${contact?.tagline ? `<div style="text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:12px;border:1px solid #e8e8f0"><div style="font-size:1rem;font-weight:700;color:#1A1A28;margin-bottom:.75rem">${contact.tagline}</div><div style="display:inline-block;padding:.75rem 2rem;background:${primary};color:${secondary};border-radius:10px;font-weight:700;font-size:.9rem">${contact.cta || "تواصل معنا"}</div></div>` : ""}
// </div>
// <div class="colors-strip">${(brand?.colors || []).map((c: any) => `<div class="color-sw" style="background:${c.hex}"></div>`).join("")}</div>
// <div class="footer-band">
//   <div class="footer-brand">${displayName}</div>
//   <div class="footer-contact">Brand Kit © ${new Date().getFullYear()}</div>
//   <div class="footer-dots">${(brand?.colors || []).map((c: any) => `<div class="footer-dot" style="background:${c.hex}"></div>`).join("")}</div>
// </div>
// </body>
// </html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(
//       new Blob([htmlBrochure], { type: "text/html" }),
//     );
//     a.download = `${displayName}-brochure.html`;
//     a.click();
//   };

//   return (
//     <div className="fade-up">
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "flex-end",
//           marginBottom: "1rem",
//         }}
//       >
//         <button
//           className="gold-btn"
//           style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }}
//           onClick={handleDownload}
//         >
//           ⬇ تنزيل بروشور HTML
//         </button>
//       </div>
//       <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//         <div
//           style={{
//             background: "#0B0B12",
//             borderBottom: "1px solid #1E1E2E",
//             padding: ".5rem 1rem",
//             display: "flex",
//             alignItems: "center",
//             borderRadius: "18px 18px 0 0",
//             justifyContent: "space-between",
//           }}
//         >
//           <div style={{ display: "flex", gap: 5 }}>
//             {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
//               <div
//                 key={c}
//                 style={{
//                   width: 10,
//                   height: 10,
//                   borderRadius: "50%",
//                   background: c,
//                 }}
//               />
//             ))}
//           </div>
//           <span
//             style={{
//               fontSize: ".7rem",
//               color: "#3A3650",
//               fontFamily: "monospace",
//             }}
//           >
//             brochure-preview.html
//           </span>
//           <div style={{ width: 40 }} />
//         </div>
//         <iframe
//           title="Brochure Preview"
//           srcDoc={htmlBrochure}
//           style={{
//             width: "100%",
//             height: "600px",
//             border: "none",
//             background: "#f4f4f8",
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// /* ── COMPETITORS TAB ── */
// function CompetitorsTab({
//   competitors,
//   primary,
// }: {
//   competitors: any;
//   primary: string;
// }) {
//   if (!competitors || Object.keys(competitors).length === 0) {
//     return (
//       <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
//         <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p>
//         <p style={{ color: "#3A3650", fontSize: ".85rem" }}>
//           لم يتم توليد تحليل المنافسين
//         </p>
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
//       <div className="card">
//         <div className="clabel">نظرة عامة على السوق</div>
//         <p
//           style={{
//             fontSize: ".88rem",
//             color: "#C4BDB5",
//             lineHeight: 1.8,
//             marginBottom: "1.25rem",
//           }}
//         >
//           {competitors.marketOverview ?? "—"}
//         </p>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: ".75rem",
//           }}
//         >
//           <div
//             style={{
//               background: "#0A0A14",
//               borderRadius: 10,
//               padding: "1rem",
//               border: "1px solid #1E1E2E",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: ".65rem",
//                 color: "#8A8498",
//                 marginBottom: ".5rem",
//               }}
//             >
//               حجم السوق
//             </div>
//             <div
//               style={{
//                 fontSize: "1.1rem",
//                 fontWeight: 700,
//                 color: sizeColor(competitors.marketSize),
//               }}
//             >
//               {competitors.marketSize ?? "—"}
//             </div>
//           </div>
//           <div
//             style={{
//               background: "#0A0A14",
//               borderRadius: 10,
//               padding: "1rem",
//               border: "1px solid #1E1E2E",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: ".65rem",
//                 color: "#8A8498",
//                 marginBottom: ".5rem",
//               }}
//             >
//               مستوى المنافسة
//             </div>
//             <div
//               style={{
//                 fontSize: "1.1rem",
//                 fontWeight: 700,
//                 color: levelColor(competitors.competitionLevel),
//               }}
//             >
//               {competitors.competitionLevel ?? "—"}
//             </div>
//           </div>
//         </div>
//       </div>
//       {competitors.competitors?.length > 0 && (
//         <div className="card">
//           <div className="clabel">المنافسون في السوق</div>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
//           >
//             {competitors.competitors.map((c: any, i: number) => (
//               <div
//                 key={i}
//                 style={{
//                   background: "#0A0A14",
//                   border: "1px solid #1E1E2E",
//                   borderRadius: 12,
//                   padding: "1.125rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     marginBottom: ".625rem",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: ".5rem",
//                     }}
//                   >
//                     <span
//                       style={{
//                         fontSize: ".95rem",
//                         fontWeight: 700,
//                         color: "#F0EDE6",
//                       }}
//                     >
//                       {c.name}
//                     </span>
//                     {c.website && (
//                       <span
//                         style={{
//                           fontSize: ".65rem",
//                           color: "#60A5FA",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         {c.website}
//                       </span>
//                     )}
//                   </div>
//                   <div style={{ display: "flex", gap: ".375rem" }}>
//                     <span
//                       style={{
//                         padding: ".15rem .5rem",
//                         borderRadius: 5,
//                         fontSize: ".62rem",
//                         background: c.type?.includes("مباشر")
//                           ? "#F8717115"
//                           : "#4ADE8015",
//                         color: c.type?.includes("مباشر")
//                           ? "#F87171"
//                           : "#4ADE80",
//                         border: `1px solid ${c.type?.includes("مباشر") ? "#F8717133" : "#4ADE8033"}`,
//                       }}
//                     >
//                       {c.type ?? "منافس"}
//                     </span>
//                     {c.marketShare && (
//                       <span
//                         style={{
//                           padding: ".15rem .5rem",
//                           borderRadius: 5,
//                           fontSize: ".62rem",
//                           background: "#C9973A15",
//                           color: "#C9973A",
//                           border: "1px solid #C9973A33",
//                         }}
//                       >
//                         {c.marketShare}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div
//                   style={{
//                     display: "grid",
//                     gridTemplateColumns: "1fr 1fr",
//                     gap: ".5rem",
//                   }}
//                 >
//                   <div>
//                     <div
//                       style={{
//                         fontSize: ".6rem",
//                         color: "#4ADE80",
//                         marginBottom: ".25rem",
//                         fontWeight: 700,
//                       }}
//                     >
//                       ✓ نقاط القوة
//                     </div>
//                     <p
//                       style={{
//                         fontSize: ".78rem",
//                         color: "#8A8498",
//                         lineHeight: 1.55,
//                       }}
//                     >
//                       {c.strengths ?? "—"}
//                     </p>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: ".6rem",
//                         color: "#F87171",
//                         marginBottom: ".25rem",
//                         fontWeight: 700,
//                       }}
//                     >
//                       ✗ نقاط الضعف
//                     </div>
//                     <p
//                       style={{
//                         fontSize: ".78rem",
//                         color: "#8A8498",
//                         lineHeight: 1.55,
//                       }}
//                     >
//                       {c.weaknesses ?? "—"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {competitors.gaps?.length > 0 && (
//         <div className="card">
//           <div className="clabel">فرص في السوق غير مستغلة</div>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
//           >
//             {competitors.gaps.map((g: string, i: number) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   gap: ".625rem",
//                   alignItems: "flex-start",
//                   padding: ".625rem",
//                   background: "#4ADE8008",
//                   border: "1px solid #4ADE8022",
//                   borderRadius: 9,
//                 }}
//               >
//                 <span
//                   style={{ color: "#4ADE80", flexShrink: 0, fontSize: ".9rem" }}
//                 >
//                   💡
//                 </span>
//                 <span
//                   style={{
//                     fontSize: ".82rem",
//                     color: "#C4BDB5",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   {g}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {competitors.differentiators?.length > 0 && (
//         <div className="card">
//           <div className="clabel">ما يجعل براندك مختلفاً</div>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}
//           >
//             {competitors.differentiators.map((d: string, i: number) => (
//               <div
//                 key={i}
//                 style={{
//                   display: "flex",
//                   gap: ".625rem",
//                   alignItems: "flex-start",
//                   padding: ".625rem",
//                   background: `${primary}08`,
//                   border: `1px solid ${primary}22`,
//                   borderRadius: 9,
//                 }}
//               >
//                 <span style={{ color: primary, flexShrink: 0 }}>✦</span>
//                 <span
//                   style={{
//                     fontSize: ".82rem",
//                     color: "#C4BDB5",
//                     lineHeight: 1.6,
//                   }}
//                 >
//                   {d}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//       {competitors.searchKeywords?.length > 0 && (
//         <div className="card">
//           <div className="clabel">كلمات البحث المقترحة لـ SEO</div>
//           <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//             {competitors.searchKeywords.map((k: string, i: number) => (
//               <span
//                 key={i}
//                 style={{
//                   padding: ".3rem .75rem",
//                   borderRadius: 20,
//                   fontSize: ".78rem",
//                   background: "#0A0A14",
//                   border: "1px solid #1E1E2E",
//                   color: "#C4BDB5",
//                   fontFamily: "monospace",
//                 }}
//               >
//                 🔍 {k}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {competitors.recommendation && (
//         <div className="card" style={{ borderColor: `${primary}33` }}>
//           <div className="clabel" style={{ color: primary }}>
//             التوصية الاستراتيجية للدخول للسوق
//           </div>
//           <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.8 }}>
//             {competitors.recommendation}
//           </p>
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

//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

//   const handleDeleteProject = async (projId: string) => {
//     if (deleteConfirmId !== projId) {
//       setDeleteConfirmId(projId);
//       setTimeout(() => setDeleteConfirmId((cur) => cur === projId ? null : cur), 3000);
//       return;
//     }

//     setDeleteConfirmId(null);
//     setDeletingId(projId);
//     try {
//       const res = await fetch(`/api/projects/${projId}`, { method: "DELETE" });
//       if (res.ok) {
//         setProjects((prev) => prev.filter((p) => p._id !== projId));
//       } else {
//         const data = await res.json();
//         alert(data.message || "فشل حذف المشروع");
//       }
//     } catch (e) {
//       alert("خطأ في الاتصال");
//     } finally {
//       setDeletingId(null);
//     }
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
//       {/* ── Navbar ── */}
//       <header style={{
//         position: "fixed", top: 0, right: 0, left: 0, zIndex: 90,
//         height: 64,
//         background: "rgba(8,8,15,.92)",
//         borderBottom: "1px solid #1E1E2E",
//         backdropFilter: "blur(16px)",
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//         padding: "0 1.5rem",
//       }}>
//         <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
//           <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <linearGradient id="dashHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#F0C96B" />
//                 <stop offset="100%" stopColor="#C9973A" />
//               </linearGradient>
//             </defs>
//             <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="url(#dashHexGrad)" />
//             <text x="18" y="23" textAnchor="middle" fontFamily="Tajawal, sans-serif" fontSize="13" fontWeight="900" fill="#08080F">ع</text>
//           </svg>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <span style={{ fontFamily: "Sora, sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "0.3px", background: "linear-gradient(90deg, #F0C96B, #C9973A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>
//               EG Brand
//             </span>
//             <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "10px", fontWeight: 500, color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}></span>
//           </div>
//         </Link>

//         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//           <span style={{ fontSize: ".8rem", color: "#8A8498" }}>
//             مرحباً، {user?.fullName}{" "}
//             <span style={{ color: "#C9973A", fontWeight: 700 }}>({user?.credits} رصيد)</span>
//           </span>
//           <button
//             onClick={handleLogout}
//             style={{ background: "transparent", border: "1px solid #1E1E2E", color: "#8A8498", padding: ".35rem .75rem", borderRadius: 8, fontSize: ".75rem", cursor: "pointer", transition: "all .2s" }}
//             onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#F8717144"; e.currentTarget.style.color = "#F87171"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}
//           >
//             تسجيل الخروج
//           </button>
//         </div>
//       </header>

//       {/* ── LIST VIEW ── */}
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
//                   <div
//                     key={proj._id}
//                     style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 16, padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "all .2s", position: "relative" }}
//                     onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C9973A44")}
//                     onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}
//                   >
//                     <button
//                       onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj._id); }}
//                       disabled={deletingId === proj._id}
//                       title={deleteConfirmId === proj._id ? "اضغط مجدداً للتأكيد" : "حذف المشروع"}
//                       style={{
//                         position: "absolute", top: "10px", left: "10px",
//                         width: deleteConfirmId === proj._id ? "auto" : 28,
//                         height: 28,
//                         padding: deleteConfirmId === proj._id ? "0 .5rem" : "0",
//                         borderRadius: deleteConfirmId === proj._id ? 6 : "50%",
//                         border: `1px solid ${deleteConfirmId === proj._id ? "#F8717155" : "#1E1E2E"}`,
//                         background: deleteConfirmId === proj._id ? "#F8717115" : "transparent",
//                         color: deleteConfirmId === proj._id ? "#F87171" : "#3A3650",
//                         fontSize: deleteConfirmId === proj._id ? ".62rem" : ".75rem",
//                         cursor: deletingId === proj._id ? "default" : "pointer",
//                         display: "flex", alignItems: "center", justifyContent: "center", gap: ".25rem",
//                         transition: "all .2s", zIndex: 2, whiteSpace: "nowrap",
//                         fontFamily: "Tajawal, sans-serif", fontWeight: 600,
//                         opacity: deletingId === proj._id ? 0.5 : 1,
//                       }}
//                       onMouseEnter={(e) => {
//                         if (deleteConfirmId !== proj._id) {
//                           e.currentTarget.style.borderColor = "#F8717155";
//                           e.currentTarget.style.color = "#F87171";
//                           e.currentTarget.style.background = "#F8717110";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (deleteConfirmId !== proj._id) {
//                           e.currentTarget.style.borderColor = "#1E1E2E";
//                           e.currentTarget.style.color = "#3A3650";
//                           e.currentTarget.style.background = "transparent";
//                         }
//                       }}
//                     >
//                       {deletingId === proj._id ? (
//                         <div style={{ width: 10, height: 10, border: "1.5px solid #F8717133", borderTop: "1.5px solid #F87171", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
//                       ) : deleteConfirmId === proj._id ? (
//                         <>⚠️ تأكيد الحذف؟</>
//                       ) : (
//                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                           <polyline points="3 6 5 6 21 6" />
//                           <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//                           <path d="M10 11v6M14 11v6" />
//                           <path d="M9 6V4h6v2" />
//                         </svg>
//                       )}
//                     </button>

//                     <div>
//                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ".75rem", paddingRight: "1rem" }}>
//                         <span style={{
//                           padding: ".2rem .5rem", borderRadius: 6, fontSize: ".65rem", fontWeight: 700,
//                           background: proj.status === "completed" ? "#4ADE8015" : proj.status === "failed" ? "#F8717115" : "#C9973A15",
//                           color: proj.status === "completed" ? "#4ADE80" : proj.status === "failed" ? "#F87171" : "#C9973A",
//                         }}>
//                           {proj.status === "completed" ? "مكتمل" : proj.status === "failed" ? "فشل" : "جاري التوليد"}
//                         </span>
//                         <span style={{ fontSize: ".65rem", color: "#3A3650" }}>
//                           {new Date(proj.createdAt).toLocaleDateString("ar-EG")}
//                         </span>
//                       </div>
//                       <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: ".5rem", color: "#F0EDE6" }}>{proj.projectTitle}</h3>
//                       <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", height: 38 }}>
//                         {proj.idea}
//                       </p>
//                     </div>

//                     <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: ".75rem", marginTop: "1rem" }}>
//                       {proj.status === "completed" ? (
//                         <button
//                           onClick={() => handleViewResult(proj._id)}
//                           style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#C9973A", fontWeight: 700, fontSize: ".8rem", cursor: "pointer", transition: "all .2s" }}
//                           onMouseEnter={(e) => { e.currentTarget.style.background = "#C9973A"; e.currentTarget.style.color = "#08080F"; }}
//                           onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9973A"; }}
//                         >
//                           استعراض الهوية 🎨
//                         </button>
//                       ) : proj.status === "generating" ? (
//                         <button
//                           onClick={() => { setView("generating"); setPct(40); setPhase(1); startPolling(proj._id); }}
//                           style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontSize: ".8rem", cursor: "pointer" }}
//                         >
//                           متابعة التوليد ⏳
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => { setView("wizard"); setIdea(proj.idea); setBname(proj.customBrandName || ""); setStyle(proj.selectedStyle); }}
//                           style={{ width: "100%", padding: ".5rem", borderRadius: 8, background: "transparent", border: "1.5px solid #F8717133", color: "#F87171", fontSize: ".8rem", cursor: "pointer" }}
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

//       {/* ── WIZARD VIEW ── */}
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
//                     <button
//                       onClick={() => toggleColor(c.id)}
//                       style={{ width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer", border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent", boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none", transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: ".85rem", transition: "all .15s" }}
//                     >
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

//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
//           <circle
//             cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4" strokeLinecap="round"
//             strokeDasharray={`${2 * Math.PI * 48}`}
//             strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
//             style={{ transition: "stroke-dashoffset 0.5s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
//           />
//         </svg>
//         <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#C9973A" }}>
//           {pct}%
//         </div>
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
//       <style>{`@keyframes blink { 0%,100%{opacity:.3} 50%{opacity:1} }`}</style>
//     </div>
//   );
// }

// /* ── RESULT SCREEN ── */
// const TABS = [
//   { id: "identity",    label: "🎨 الهوية" },
//   { id: "logo",        label: "🏷️ الشعار" },
//   { id: "social",      label: "📱 السوشيال" },
//   { id: "landing",     label: "🌐 صفحة الهبوط" },
//   { id: "brochure",    label: "📄 البروشور" },
//   { id: "card",        label: "💼 بطاقة عمل" },
//   { id: "launch",      label: "🚀 خطة الإطلاق" },
//   { id: "swot",        label: "📊 SWOT" },
//   { id: "objections",  label: "💬 الاعتراضات" },
//   { id: "persona",     label: "👤 العميل المثالي" },
//   { id: "ads",         label: "🎬 سكريبت إعلان" },
//   { id: "email",       label: "📧 حملة إيميل" },
//   { id: "competitors", label: "🔍 المنافسون" },
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
//   const [socialData, setSocialData] = useState<any>(null);
//   const [launchPlan, setLaunchPlan]   = useState<any>(result?.launchPlan   || null);
//   const [swotData,   setSwotData]     = useState<any>(result?.swot         || null);
//   const [objections, setObjections]   = useState<any>(result?.objections   || null);
//   const [persona,    setPersona]      = useState<any>(result?.buyerPersona  || null);
//   const [adScripts,  setAdScripts]    = useState<any>(result?.adScripts     || null);
//   const [emailCamp,  setEmailCamp]    = useState<any>(result?.emailCampaign || null);

//   const brand = result?.brandIdentity ?? {};
//   const logoRaw = result?.logo ?? {};
//   const logoStr =
//     typeof logoRaw === "string"
//       ? logoRaw
//       : logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "";
//   const logo = sanitizeSVGClient(logoStr);
//   const social = socialData ?? result?.socialMedia ?? {};
//   const landing = result?.landingPage ?? {};
//   const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
//   const competitors = result?.competitors ?? {};
//   const projectId = result?.projectId ?? result?._id ?? "";

//   const namesRaw: any[] = brand?.names ?? [];
//   const nameObjects: { name: string; reason?: string; meaning?: string }[] = namesRaw.map(
//     (n: any) => (typeof n === "string" ? { name: n } : n)
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
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
//               <defs>
//                 <linearGradient id="resHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
//                   <stop offset="0%" stopColor="#F0C96B" />
//                   <stop offset="100%" stopColor="#C9973A" />
//                 </linearGradient>
//               </defs>
//               <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="url(#resHexGrad)" />
//               <text x="18" y="23" textAnchor="middle" fontFamily="Tajawal, sans-serif" fontSize="13" fontWeight="900" fill="#08080F">ع</text>
//             </svg>
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <span style={{ fontFamily: "Sora, sans-serif", fontSize: "14px", fontWeight: 800, background: "linear-gradient(90deg,#F0C96B,#C9973A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>EG Brand</span>
//               <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "9px", color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}></span>
//             </div>
//           </div>
//           <div style={{ width: 36 }} />
//         </div>

//         {/* Hero Card */}
//         <div style={{ background: `linear-gradient(135deg, ${secondary} 0%, #17172B 100%)`, border: "1px solid #C9973A22", borderRadius: 20, padding: "2rem", textAlign: "center", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, background: `radial-gradient(circle, ${primary}18, transparent 70%)`, pointerEvents: "none" }} />

//           {nameObjects.length > 0 && (
//             <div style={{ display: "flex", gap: ".375rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "1.125rem" }}>
//               {nameObjects.map((n, i) => (
//                 <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
//                   <span style={{ padding: ".25rem .75rem", borderRadius: 20, fontSize: ".72rem", border: n.name === brand.recommendedName ? `1px solid ${primary}` : "1px solid #C9973A33", background: n.name === brand.recommendedName ? primary : "transparent", color: n.name === brand.recommendedName ? secondary : "#8A8498", fontWeight: n.name === brand.recommendedName ? 700 : 400 }}>
//                     {n.name}{n.name === brand.recommendedName && " ✦"}
//                   </span>
//                   {n.meaning && <span style={{ fontSize: ".58rem", color: "#3A3650", marginTop: 2 }}>{n.meaning}</span>}
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
//             <button
//               key={t.id}
//               onClick={() => setTab(t.id)}
//               style={{ padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`, background: tab === t.id ? primary : "transparent", color: tab === t.id ? secondary : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tab === "identity"    && <IdentityTab brand={brand} primary={primary} nameObjects={nameObjects} />}
//         {tab === "logo"        && <LogoTab logo={logo} displayName={displayName} brand={brand} />}
//         {tab === "social"      && <SocialTab social={social} displayName={displayName} projectId={projectId} onSocialUpdate={(s) => setSocialData(s)} />}
//         {tab === "landing"     && <LandingTab landing={landing} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "brochure"    && <BrochureTab brand={brand} brochureContent={brochureContent} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "card"        && <BusinessCardTab brand={brand} displayName={displayName} primary={primary} secondary={secondary} />}
//         {tab === "launch"      && <LaunchPlanTab data={launchPlan} projectId={projectId} primary={primary} onGenerated={setLaunchPlan} />}
//         {tab === "swot"        && <SwotTab data={swotData} projectId={projectId} primary={primary} onGenerated={setSwotData} />}
//         {tab === "objections"  && <ObjectionsTab data={objections} projectId={projectId} primary={primary} onGenerated={setObjections} />}
//         {tab === "persona"     && <BuyerPersonaTab data={persona} projectId={projectId} primary={primary} onGenerated={setPersona} />}
//         {tab === "ads"         && <AdScriptsTab data={adScripts} projectId={projectId} primary={primary} onGenerated={setAdScripts} />}
//         {tab === "email"       && <EmailCampaignTab data={emailCamp} projectId={projectId} primary={primary} onGenerated={setEmailCamp} />}
//         {tab === "competitors" && <CompetitorsTab competitors={competitors} primary={primary} />}

//         <button
//           onClick={onBack}
//           style={{ width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s" }}
//           onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
//           onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}
//         >
//           ← العودة للبراندات
//         </button>
//       </div>
//     </div>
//   );
// }

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

//       <div className="card">
//         <div className="clabel">قصة العلامة التجارية</div>
//         <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.9, marginBottom: ".875rem" }}>{brand?.story?.ar ?? brand?.story ?? "—"}</p>
//         {brand?.story?.en && <p style={{ fontSize: ".8rem", color: "#8A8498", fontStyle: "italic", lineHeight: 1.7 }}>{brand.story.en}</p>}
//       </div>

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
//       <p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار</p>
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
// function SocialTab({ social, displayName, projectId, onSocialUpdate }: {
//   social: any;
//   displayName: string;
//   projectId?: string;
//   onSocialUpdate?: (s: any) => void;
// }) {
//   const [ptab, setPtab] = useState<"map" | "posts" | "videos" | "ready" | "plan">("map");
//   const [generating, setGenerating] = useState(false);
//   const [genMsg, setGenMsg] = useState("");
//   const [filterCat, setFilterCat] = useState("الكل");

//   const igPosts    = social?.instagram ?? [];
//   const twTweets   = social?.twitter   ?? [];
//   const contentMap = social?.contentMap  ?? [];
//   const postIdeas  = social?.postIdeas   ?? [];
//   const videoIdeas = social?.videoIdeas  ?? [];
//   const weeklyPlan = social?.strategy?.weeklyPlan ?? [];

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
//       const res = await fetch(`/api/projects/${projectId}/extra-social`, { method: "POST" });
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
//       <div style={{ display: "flex", gap: ".3rem", overflowX: "auto", paddingBottom: ".5rem", marginBottom: "1rem", scrollbarWidth: "none" }}>
//         {SUBTABS.map(({ id, label }) => (
//           <button key={id} onClick={() => setPtab(id as any)}
//             style={{ padding: ".4rem .85rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: ptab === id ? "#C9973A" : "transparent", color: ptab === id ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: ptab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
//             {label}
//           </button>
//         ))}
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

//       {ptab === "map" && (
//         <div className="card">
//           <div className="clabel">خريطة المحتوى — توزيع البوستات</div>
//           {contentMap.length === 0 ? (
//             <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لم يتم توليد خريطة المحتوى</p>
//           ) : (
//             <>
//               <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
//                 <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }}>
//                   <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
//                     {(() => {
//                       let offset = 0;
//                       return contentMap.map((seg: any, i: number) => {
//                         const val = seg.pct;
//                         const circ = 2 * Math.PI * 15.9;
//                         const dash = (val / 100) * circ;
//                         const gap = circ - dash;
//                         const el = (
//                           <circle key={i} cx="18" cy="18" r="15.9" fill="none"
//                             stroke={seg.color || "#C9973A"} strokeWidth="3.2"
//                             strokeDasharray={`${dash} ${gap}`}
//                             strokeDashoffset={-offset * circ / 100}
//                           />
//                         );
//                         offset += val;
//                         return el;
//                       });
//                     })()}
//                   </svg>
//                   <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
//                     <span style={{ fontSize: ".62rem", color: "#8A8498", lineHeight: 1 }}>محتوى</span>
//                     <span style={{ fontSize: ".72rem", fontWeight: 700, color: "#F0EDE6" }}>متنوع</span>
//                   </div>
//                 </div>
//                 <div style={{ flex: 1, minWidth: 160 }}>
//                   {contentMap.map((seg: any, i: number) => (
//                     <div key={i} style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
//                       <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color, flexShrink: 0 }} />
//                       <span style={{ fontSize: ".8rem", color: "#C4BDB5", flex: 1 }}>{seg.category}</span>
//                       <span style={{ fontSize: ".8rem", fontWeight: 700, color: seg.color }}>{seg.pct}%</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//                 {contentMap.map((seg: any, i: number) => (
//                   <div key={i} style={{ background: "#0A0A14", borderRadius: 12, padding: "1rem", borderRight: `3px solid ${seg.color}` }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
//                       <div style={{ width: 8, height: 8, borderRadius: "50%", background: seg.color }} />
//                       <span style={{ fontSize: ".85rem", fontWeight: 700, color: seg.color }}>{seg.category}</span>
//                       <span style={{ fontSize: ".72rem", color: "#3A3650", marginRight: "auto" }}>{seg.pct}% من المحتوى</span>
//                     </div>
//                     {seg.desc && <p style={{ fontSize: ".78rem", color: "#8A8498", marginBottom: ".5rem", lineHeight: 1.6 }}>{seg.desc}</p>}
//                     {seg.examples?.length > 0 && (
//                       <div style={{ display: "flex", flexDirection: "column", gap: ".3rem" }}>
//                         {seg.examples.map((ex: string, j: number) => (
//                           <div key={j} style={{ display: "flex", gap: ".4rem", alignItems: "flex-start" }}>
//                             <span style={{ color: seg.color, fontSize: ".7rem", marginTop: 2 }}>›</span>
//                             <span style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.55 }}>{ex}</span>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {ptab === "posts" && (
//         <div>
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
//                     <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
//                       <span style={{ fontSize: "1rem" }}>{typeIcon[p.type] || "📌"}</span>
//                       <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{p.title}</span>
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: cc + "22", color: cc, border: `1px solid ${cc}44` }}>{p.type}</span>
//                       <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: "#1E1E2E", color: "#8A8498" }}>{p.platform}</span>
//                     </div>
//                     {p.visual && (
//                       <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem", borderRight: `2px solid ${cc}66` }}>
//                         <div style={{ fontSize: ".6rem", color: cc, fontWeight: 700, marginBottom: ".25rem" }}>🎨 المشهد البصري</div>
//                         <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6, margin: 0 }}>{p.visual}</p>
//                       </div>
//                     )}
//                     {p.caption && <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption}</p>}
//                     {p.hashtags && <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags}</p>}
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

//       {ptab === "videos" && (
//         <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//           {videoIdeas.length === 0 ? (
//             <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
//               <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار الفيديوهات</p>
//             </div>
//           ) : videoIdeas.map((v: any, i: number) => (
//             <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".875rem" }}>
//                 <span style={{ fontSize: "1.1rem" }}>🎬</span>
//                 <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{v.concept || `فكرة فيديو ${i + 1}`}</span>
//                 <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#69C9D033", color: "#69C9D0" }}>{v.platform}</span>
//                 <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#1E1E2E", color: "#8A8498" }}>{v.duration}</span>
//               </div>
//               {v.hook && (
//                 <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem" }}>
//                   <div style={{ fontSize: ".6rem", color: "#C9973A", fontWeight: 700, marginBottom: ".2rem" }}>⚡ الجملة الافتتاحية (أول 3 ثواني)</div>
//                   <p style={{ fontSize: ".85rem", fontWeight: 600, color: "#F0EDE6", margin: 0 }}>"{v.hook}"</p>
//                 </div>
//               )}
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

//       {ptab === "ready" && (
//         <div className="card">
//           <div className="clabel">منشورات جاهزة للنسخ والنشر</div>
//           {igPosts.length > 0 && (
//             <div style={{ marginBottom: "1.25rem" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
//                 <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>IG</div>
//                 <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Instagram</span>
//               </div>
//               {igPosts.map((p: any, i: number) => (
//                 <div key={i} style={{ background: "linear-gradient(180deg,#13131E,#0A0A14)", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
//                     <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
//                       {displayName.slice(0, 2).toUpperCase()}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: ".78rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div>
//                       <div style={{ fontSize: ".6rem", color: "#3A3650" }}>حساب رسمي</div>
//                     </div>
//                   </div>
//                   <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.75, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption ?? p.text ?? ""}</p>
//                   <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags ?? ""}</p>
//                   {p.theme && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "rgba(201,151,58,.1)", color: "#C9973A", border: "1px solid rgba(201,151,58,.2)" }}>{p.theme}</span>}
//                 </div>
//               ))}
//             </div>
//           )}
//           {twTweets.length > 0 && (
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".75rem" }}>
//                 <div style={{ width: 22, height: 22, borderRadius: 6, background: "#1D9BF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".65rem", fontWeight: 700, color: "#fff" }}>X</div>
//                 <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#F0EDE6" }}>Twitter / X</span>
//               </div>
//               {twTweets.map((t: any, i: number) => (
//                 <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1rem", marginBottom: ".625rem", borderRight: "3px solid #1D9BF0" }}>
//                   <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 }}>{t.text ?? t.tweet ?? ""}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//           {igPosts.length === 0 && twTweets.length === 0 && (
//             <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لا يوجد منشورات جاهزة</p>
//           )}
//         </div>
//       )}

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
// <div class="intro-band"><div class="intro-text">${intro}</div></div>
// <div class="body">
//   ${services.length > 0 ? `<div class="section-title">خدماتنا</div><div class="services-grid">${services.map((s: any) => `<div class="service-card"><div class="service-icon">${s.icon || "✦"}</div><div class="service-name">${s.name || ""}</div><div class="service-brief">${s.brief || ""}</div></div>`).join("")}</div>` : ""}
//   ${sections.length > 0 ? `<div class="section-title">معلومات عن المشروع</div><div class="sections-grid">${sections.map((s: any) => `<div class="section-block"><h4>${s.title || ""}</h4><p>${s.content || ""}</p></div>`).join("")}</div>` : `<div class="section-title">عن البراند</div><div class="sections-grid">${[["التموضع التسويقي", brand?.strategy?.positioning ?? ""], ["الجمهور المستهدف", brand?.strategy?.audience ?? ""], ["القيمة الفريدة", brand?.strategy?.value ?? ""], ["نبرة الصوت", brand?.voice?.tone ?? ""]].map(([t, c]) => `<div class="section-block"><h4>${t}</h4><p>${c}</p></div>`).join("")}</div>`}
//   ${whyUs.length > 0 ? `<div class="section-title">لماذا تختارنا؟</div><div class="why-grid">${whyUs.map((w: string) => `<div class="why-item"><div class="why-dot"></div><div class="why-text">${w}</div></div>`).join("")}</div>` : ""}
//   ${contact?.tagline ? `<div style="text-align:center;padding:1.5rem;background:#f8f8fc;border-radius:12px;border:1px solid #e8e8f0"><div style="font-size:1rem;font-weight:700;color:#1A1A28;margin-bottom:.75rem">${contact.tagline}</div><div style="display:inline-block;padding:.75rem 2rem;background:${primary};color:${secondary};border-radius:10px;font-weight:700;font-size:.9rem">${contact.cta || "تواصل معنا"}</div></div>` : ""}
// </div>
// <div class="colors-strip">${(brand?.colors || []).map((c: any) => `<div class="color-sw" style="background:${c.hex}"></div>`).join("")}</div>
// <div class="footer-band">
//   <div class="footer-brand">${displayName}</div>
//   <div class="footer-contact">Brand Kit © ${new Date().getFullYear()}</div>
//   <div class="footer-dots">${(brand?.colors || []).map((c: any) => `<div class="footer-dot" style="background:${c.hex}"></div>`).join("")}</div>
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

//       {competitors.competitors?.length > 0 && (
//         <div className="card">
//           <div className="clabel">المنافسون في السوق</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {competitors.competitors.map((c: any, i: number) => (
//               <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 12, padding: "1.125rem" }}>
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".625rem" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//                     <span style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{c.name}</span>
//                     {c.website && <span style={{ fontSize: ".65rem", color: "#60A5FA", fontFamily: "monospace" }}>{c.website}</span>}
//                   </div>
//                   <div style={{ display: "flex", gap: ".375rem" }}>
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: c.type?.includes("مباشر") ? "#F8717115" : "#4ADE8015", color: c.type?.includes("مباشر") ? "#F87171" : "#4ADE80", border: `1px solid ${c.type?.includes("مباشر") ? "#F8717133" : "#4ADE8033"}` }}>{c.type ?? "منافس"}</span>
//                     {c.marketShare && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#C9973A15", color: "#C9973A", border: "1px solid #C9973A33" }}>{c.marketShare}</span>}
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

//       {competitors.recommendation && (
//         <div className="card" style={{ borderColor: `${primary}33` }}>
//           <div className="clabel" style={{ color: primary }}>التوصية الاستراتيجية للدخول للسوق</div>
//           <p style={{ fontSize: ".9rem", color: "#C4BDB5", lineHeight: 1.8 }}>{competitors.recommendation}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ── HELPER: Paid Generate Button ── */
// function PaidGenerateBtn({ onGenerate, loading, label = "توليد بـ 1 كريديت" }: { onGenerate: () => void; loading: boolean; label?: string }) {
//   return (
//     <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
//       <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✦</div>
//       <p style={{ fontSize: ".9rem", color: "#C4BDB5", marginBottom: "1.5rem", lineHeight: 1.7 }}>
//         هذا المحتوى يتم توليده بواسطة الذكاء الاصطناعي خصيصاً لبراندك
//       </p>
//       <button onClick={onGenerate} disabled={loading}
//         style={{ padding: ".875rem 2.5rem", borderRadius: 14, background: loading ? "#1E1E2E" : "#C9973A", color: loading ? "#8A8498" : "#08080F", border: "none", fontFamily: "Tajawal,sans-serif", fontSize: "1rem", fontWeight: 700, cursor: loading ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
//         {loading ? "⏳ جاري التوليد..." : `🚀 ${label}`}
//       </button>
//       <p style={{ fontSize: ".7rem", color: "#3A3650", marginTop: ".75rem" }}>يُخصم 1 كريديت من رصيدك</p>
//     </div>
//   );
// }

// /* ── BUSINESS CARD TAB ── */
// function BusinessCardTab({ brand, displayName, primary, secondary }: { brand: any; displayName: string; primary: string; secondary: string }) {
//   const tagline = brand?.tagline?.ar ?? "";

//   const cardHTML = `<!DOCTYPE html>
// <html lang="ar" dir="rtl">
// <head><meta charset="UTF-8"><title>بطاقة عمل - ${displayName}</title>
// <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
// <style>
// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'Tajawal',sans-serif;background:#1a1a2e;display:flex;align-items:center;justify-content:center;min-height:100vh;gap:2rem;flex-wrap:wrap;padding:2rem}
// .card{width:350px;height:200px;border-radius:16px;position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
// .front{background:linear-gradient(135deg,${secondary} 0%,#17172B 100%);border:1px solid ${primary}33;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem}
// .pattern{position:absolute;inset:0;background-image:radial-gradient(${primary}15 1px,transparent 1px);background-size:20px 20px}
// .rel{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between}
// .brand-name{font-size:1.5rem;font-weight:900;color:${primary};letter-spacing:-0.5px}
// .person-info{display:flex;flex-direction:column;gap:.2rem}
// .person-name{font-size:1rem;font-weight:700;color:#F0EDE6}
// .person-title{font-size:.75rem;color:rgba(240,237,230,.5)}
// .tagline{font-size:.7rem;color:${primary};opacity:.8;font-style:italic}
// .back{background:${primary};display:flex;flex-direction:column;justify-content:center;padding:1.5rem;gap:.75rem}
// .contact-item{display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600}
// .divider{height:1px;background:${secondary}33;margin:.25rem 0}
// .label{font-size:.5rem;font-weight:900;letter-spacing:2px;color:${secondary};opacity:.5;text-transform:uppercase;margin-bottom:.5rem}
// </style></head>
// <body>
// <div>
//   <p style="color:#8A8498;font-size:.75rem;text-align:center;margin-bottom:.75rem;font-family:'Tajawal',sans-serif">الوجه الأمامي</p>
//   <div class="card front">
//     <div class="pattern"></div>
//     <div class="rel">
//       <div class="brand-name">${displayName}</div>
//       <div>
//         <div class="tagline">${tagline}</div>
//         <div class="divider" style="margin:.5rem 0"></div>
//         <div class="person-info">
//           <div class="person-name">[ اسمك هنا ]</div>
//           <div class="person-title">[ مسماك الوظيفي ]</div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// <div>
//   <p style="color:#8A8498;font-size:.75rem;text-align:center;margin-bottom:.75rem;font-family:'Tajawal',sans-serif">الوجه الخلفي</p>
//   <div class="card back">
//     <div class="label">تواصل معنا</div>
//     <div class="contact-item">📞 [ رقم الهاتف ]</div>
//     <div class="contact-item">✉️ [ البريد الإلكتروني ]</div>
//     <div class="contact-item">🌐 [ الموقع الإلكتروني ]</div>
//     <div class="contact-item">📸 @[ حساب الإنستقرام ]</div>
//     <div class="contact-item">📍 [ المدينة، الدولة ]</div>
//   </div>
// </div>
// </body></html>`;

//   const handleDownload = () => {
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(new Blob([cardHTML], { type: "text/html" }));
//     a.download = `${displayName}-business-card.html`;
//     a.click();
//   };

//   const emailSig = `<!-- Email Signature -->
// <table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;direction:rtl">
//   <tr>
//     <td style="padding-left:15px;border-left:3px solid ${primary}">
//       <p style="margin:0;font-size:16px;font-weight:bold;color:#1A1A28">[ اسمك ]</p>
//       <p style="margin:2px 0;font-size:13px;color:#6B6478">[ مسماك ] | ${displayName}</p>
//       <p style="margin:4px 0;font-size:12px;color:${primary};font-style:italic">${tagline}</p>
//       <p style="margin:6px 0 0;font-size:12px;color:#6B6478">
//         📞 [ الهاتف ] &nbsp;|&nbsp; ✉️ [ الإيميل ] &nbsp;|&nbsp; 🌐 [ الموقع ]
//       </p>
//     </td>
//   </tr>
// </table>`;

//   return (
//     <div className="fade-up">
//       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
//         <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تحميل بطاقة العمل HTML</button>
//       </div>
//       <div className="card" style={{ padding: 0, overflow: "hidden" }}>
//         <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "18px 18px 0 0" }}>
//           <div style={{ display: "flex", gap: 5 }}>{["#FF5F56","#FFBD2E","#27C93F"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}</div>
//           <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>business-card.html</span>
//           <div style={{ width: 40 }} />
//         </div>
//         <iframe srcDoc={cardHTML} title="Business Card" style={{ width: "100%", height: "360px", border: "none" }} />
//       </div>

//       <div className="card" style={{ marginTop: "1rem" }}>
//         <div className="clabel">توقيع الإيميل (Email Signature)</div>
//         <p style={{ fontSize: ".78rem", color: "#8A8498", marginBottom: ".75rem" }}>انسخ الكود أدناه وأضفه في إعدادات توقيع بريدك الإلكتروني</p>
//         <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
//           {emailSig}
//         </pre>
//         <button className="outline-btn" style={{ marginTop: ".75rem", fontSize: ".75rem" }}
//           onClick={() => { navigator.clipboard?.writeText(emailSig); }}>
//           📋 نسخ توقيع الإيميل
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ── LAUNCH PLAN TAB ── (FIXED: reads phases[] from DB schema) ── */
// function LaunchPlanTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/regenerate/launchPlan`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
//       else { onGenerated(json.launchPlan); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   if (!data || Object.keys(data).length === 0) return (
//     <div className="card">
//       <div className="clabel">خطة الإطلاق</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد خطة الإطلاق" />
//     </div>
//   );

//   const priorityColor = (p: string) => p?.includes("عالي") ? "#F87171" : p?.includes("متوسط") ? "#FBBF24" : "#4ADE80";

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

//       {/* Overview */}
//       {data.overview && (
//         <div className="card">
//           <div className="clabel">نظرة عامة على خطة الإطلاق</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1rem" }}>
//             {[["المدة الإجمالية", data.overview.totalDuration], ["الميزانية المقترحة", data.overview.budget]].filter(([,v])=>v).map(([label, val]) => (
//               <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
//                 <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".375rem" }}>{label}</div>
//                 <div style={{ fontSize: ".88rem", fontWeight: 700, color: primary }}>{val}</div>
//               </div>
//             ))}
//           </div>
//           {data.overview.mainGoal && (
//             <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginBottom: ".75rem" }}>
//               <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".375rem" }}>الهدف الرئيسي</div>
//               <div style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.6 }}>{data.overview.mainGoal}</div>
//             </div>
//           )}
//           {data.overview.successMetrics?.length > 0 && (
//             <div>
//               <div style={{ fontSize: ".7rem", color: "#8A8498", marginBottom: ".5rem", fontWeight: 700 }}>مقاييس النجاح:</div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//                 {data.overview.successMetrics.map((m: string, i: number) => (
//                   <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem" }}>{m}</span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Phases */}
//       {data.phases?.map((phase: any, pi: number) => (
//         <div key={pi} className="card">
//           <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
//             <div style={{ width: 32, height: 32, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem", fontWeight: 900, color: "#08080F", flexShrink: 0 }}>{phase.phase}</div>
//             <div>
//               <div style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>{phase.name}</div>
//               <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{phase.duration}</div>
//             </div>
//             {phase.budget && <span style={{ marginRight: "auto", padding: ".2rem .6rem", borderRadius: 6, fontSize: ".68rem", background: `${primary}15`, color: primary, border: `1px solid ${primary}33` }}>{phase.budget}</span>}
//           </div>

//           {phase.goal && (
//             <div style={{ background: "#0A0A14", borderRadius: 8, padding: ".75rem", marginBottom: ".75rem", border: "1px solid #1E1E2E" }}>
//               <div style={{ fontSize: ".6rem", color: primary, fontWeight: 700, marginBottom: ".25rem" }}>الهدف</div>
//               <div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{phase.goal}</div>
//             </div>
//           )}

//           {phase.tasks?.length > 0 && (
//             <div style={{ marginBottom: ".75rem" }}>
//               <div style={{ fontSize: ".65rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem" }}>المهام:</div>
//               <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
//                 {phase.tasks.map((t: any, i: number) => (
//                   <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: ".5rem", alignItems: "center", padding: ".625rem", background: "#0A0A14", borderRadius: 8, border: "1px solid #1E1E2E" }}>
//                     <span style={{ fontSize: ".8rem", color: "#C4BDB5" }}>{t.task || t}</span>
//                     {t.owner && <span style={{ fontSize: ".65rem", color: "#8A8498", background: "#1E1E2E", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{t.owner}</span>}
//                     {t.priority && <span style={{ fontSize: ".62rem", color: priorityColor(t.priority), background: priorityColor(t.priority) + "15", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{t.priority}</span>}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {phase.deliverables?.length > 0 && (
//             <div>
//               <div style={{ fontSize: ".65rem", color: "#8A8498", fontWeight: 700, marginBottom: ".4rem" }}>المخرجات:</div>
//               <div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>
//                 {phase.deliverables.map((d: string, i: number) => (
//                   <span key={i} style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".72rem", background: "#4ADE8015", color: "#4ADE80", border: "1px solid #4ADE8033" }}>✓ {d}</span>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ))}

//       {/* Channels */}
//       {data.channels?.length > 0 && (
//         <div className="card">
//           <div className="clabel">القنوات التسويقية</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
//             {data.channels.map((ch: any, i: number) => (
//               <div key={i} style={{ display: "grid", gridTemplateColumns: "100px 1fr auto auto", gap: ".75rem", alignItems: "center", padding: ".75rem", background: "#0A0A14", borderRadius: 9, border: "1px solid #1E1E2E" }}>
//                 <span style={{ fontSize: ".82rem", fontWeight: 700, color: primary }}>{ch.channel}</span>
//                 <span style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{ch.strategy}</span>
//                 {ch.budget && <span style={{ fontSize: ".68rem", color: "#8A8498", background: "#1E1E2E", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{ch.budget}</span>}
//                 {ch.expectedReach && <span style={{ fontSize: ".68rem", color: "#4ADE80", background: "#4ADE8015", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{ch.expectedReach}</span>}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Contingency */}
//       {data.contingency && (
//         <div className="card">
//           <div className="clabel">خطة الطوارئ</div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//             {data.contingency.ifSlowStart && (
//               <div style={{ background: "#F8717108", borderRadius: 10, padding: "1rem", border: "1px solid #F8717122" }}>
//                 <div style={{ fontSize: ".62rem", color: "#F87171", fontWeight: 700, marginBottom: ".375rem" }}>🐌 لو البداية بطيئة</div>
//                 <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6 }}>{data.contingency.ifSlowStart}</p>
//               </div>
//             )}
//             {data.contingency.ifViral && (
//               <div style={{ background: "#4ADE8008", borderRadius: 10, padding: "1rem", border: "1px solid #4ADE8022" }}>
//                 <div style={{ fontSize: ".62rem", color: "#4ADE80", fontWeight: 700, marginBottom: ".375rem" }}>🚀 لو انتشر بشكل كبير</div>
//                 <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6 }}>{data.contingency.ifViral}</p>
//               </div>
//             )}
//           </div>
//           {data.contingency.criticalRisks?.length > 0 && (
//             <div style={{ marginTop: ".75rem" }}>
//               <div style={{ fontSize: ".65rem", color: "#FBBF24", fontWeight: 700, marginBottom: ".5rem" }}>⚠️ المخاطر الحرجة:</div>
//               {data.contingency.criticalRisks.map((r: string, i: number) => (
//                 <div key={i} style={{ fontSize: ".8rem", color: "#C4BDB5", padding: ".3rem 0", borderBottom: i < data.contingency.criticalRisks.length - 1 ? "1px solid #1E1E2E" : "none" }}>• {r}</div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد
//       </button>
//     </div>
//   );
// }

// /* ── SWOT TAB ── (NEW: reads swot from DB) ── */
// function SwotTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/regenerate/swot`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
//       else { onGenerated(json.swot); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   if (!data || Object.keys(data).length === 0) return (
//     <div className="card">
//       <div className="clabel">تحليل SWOT والمخاطر</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد تحليل SWOT" />
//     </div>
//   );

//   const swot = data.swot ?? data;

//   const quadrants = [
//     { key: "strengths",    label: "نقاط القوة",   color: "#4ADE80", icon: "💪", itemKey: "point", subKey: "howToLeverage", subLabel: "كيف تستفيد" },
//     { key: "weaknesses",   label: "نقاط الضعف",   color: "#F87171", icon: "⚠️", itemKey: "point", subKey: "howToAddress",  subLabel: "كيف تعالجها" },
//     { key: "opportunities",label: "الفرص",         color: "#60A5FA", icon: "🚀", itemKey: "point", subKey: "howToCapture",  subLabel: "كيف تستغلها" },
//     { key: "threats",      label: "التهديدات",     color: "#FBBF24", icon: "🛡️", itemKey: "point", subKey: "mitigation",    subLabel: "كيف تتجنبها" },
//   ];

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

//       {/* SWOT Grid */}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1rem" }}>
//         {quadrants.map(({ key, label, color, icon, itemKey, subKey, subLabel }) => {
//           const items = swot?.[key] ?? [];
//           return (
//             <div key={key} style={{ background: "#0A0A14", border: `1px solid ${color}33`, borderRadius: 14, padding: "1rem", borderTop: `3px solid ${color}` }}>
//               <div style={{ display: "flex", alignItems: "center", gap: ".375rem", marginBottom: ".75rem" }}>
//                 <span>{icon}</span>
//                 <span style={{ fontSize: ".82rem", fontWeight: 700, color }}>{label}</span>
//                 <span style={{ marginRight: "auto", fontSize: ".65rem", color: "#3A3650", background: "#1E1E2E", padding: ".1rem .4rem", borderRadius: 4 }}>{items.length}</span>
//               </div>
//               <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
//                 {items.length === 0 ? (
//                   <p style={{ fontSize: ".75rem", color: "#3A3650" }}>—</p>
//                 ) : items.map((item: any, i: number) => (
//                   <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #1E1E2E" : "none", paddingBottom: i < items.length - 1 ? ".5rem" : 0 }}>
//                     <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.55, marginBottom: ".25rem" }}>
//                       {typeof item === "string" ? item : item[itemKey] ?? item.point ?? ""}
//                     </p>
//                     {item[subKey] && (
//                       <p style={{ fontSize: ".7rem", color: color, opacity: 0.8 }}>→ {item[subKey]}</p>
//                     )}
//                     {item.impact && (
//                       <span style={{ fontSize: ".6rem", color: "#8A8498" }}>التأثير: {item.impact}</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Risks */}
//       {data.risks?.length > 0 && (
//         <div className="card">
//           <div className="clabel">تحليل المخاطر التفصيلي</div>
//           <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
//             {data.risks.map((r: any, i: number) => {
//               const scoreNum = parseInt(r.riskScore) || 5;
//               const riskColor = scoreNum >= 8 ? "#F87171" : scoreNum >= 5 ? "#FBBF24" : "#4ADE80";
//               return (
//                 <div key={i} style={{ background: "#0A0A14", border: `1px solid ${riskColor}33`, borderRadius: 12, padding: "1rem" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".625rem" }}>
//                     <span style={{ width: 28, height: 28, borderRadius: "50%", background: riskColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem", fontWeight: 900, color: "#08080F", flexShrink: 0 }}>{r.riskScore}</span>
//                     <span style={{ fontSize: ".85rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{r.risk}</span>
//                     <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#1E1E2E", color: "#8A8498" }}>{r.category}</span>
//                   </div>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginBottom: ".5rem" }}>
//                     {r.probability && <div style={{ fontSize: ".72rem", color: "#8A8498" }}>الاحتمالية: <span style={{ color: riskColor }}>{r.probability}</span></div>}
//                     {r.impact && <div style={{ fontSize: ".72rem", color: "#8A8498" }}>التأثير: <span style={{ color: riskColor }}>{r.impact}</span></div>}
//                   </div>
//                   {r.mitigation && (
//                     <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem", marginBottom: ".375rem" }}>
//                       <div style={{ fontSize: ".6rem", color: "#4ADE80", fontWeight: 700, marginBottom: ".2rem" }}>🛡️ خطة التخفيف</div>
//                       <p style={{ fontSize: ".78rem", color: "#C4BDB5", margin: 0 }}>{r.mitigation}</p>
//                     </div>
//                   )}
//                   {r.contingency && (
//                     <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem" }}>
//                       <div style={{ fontSize: ".6rem", color: "#FBBF24", fontWeight: 700, marginBottom: ".2rem" }}>⚡ خطة الطوارئ</div>
//                       <p style={{ fontSize: ".78rem", color: "#C4BDB5", margin: 0 }}>{r.contingency}</p>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Verdict */}
//       {(data.verdict || data.founderAdvice) && (
//         <div className="card">
//           {data.verdict && (
//             <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", padding: "1rem", background: data.verdict.goOrNoGo === "go" ? "#4ADE8011" : data.verdict.goOrNoGo === "no-go" ? "#F8717111" : "#FBBF2411", borderRadius: 12, border: `1px solid ${data.verdict.goOrNoGo === "go" ? "#4ADE8033" : data.verdict.goOrNoGo === "no-go" ? "#F8717133" : "#FBBF2433"}` }}>
//               <div style={{ textAlign: "center", flexShrink: 0 }}>
//                 <div style={{ fontSize: "2rem" }}>{data.verdict.goOrNoGo === "go" ? "✅" : data.verdict.goOrNoGo === "no-go" ? "❌" : "⚠️"}</div>
//                 <div style={{ fontSize: ".65rem", color: "#8A8498", marginTop: ".2rem" }}>القرار</div>
//               </div>
//               <div>
//                 <div style={{ fontSize: "1rem", fontWeight: 700, color: data.verdict.goOrNoGo === "go" ? "#4ADE80" : data.verdict.goOrNoGo === "no-go" ? "#F87171" : "#FBBF24", marginBottom: ".25rem" }}>
//                   {data.verdict.goOrNoGo === "go" ? "انطلق! 🚀" : data.verdict.goOrNoGo === "no-go" ? "توقف وأعد التقييم" : "تابع بحذر"}
//                 </div>
//                 <div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{data.verdict.mainReason}</div>
//                 {data.verdict.confidence && (
//                   <div style={{ fontSize: ".72rem", color: "#8A8498", marginTop: ".375rem" }}>
//                     نسبة الثقة: <span style={{ color: primary, fontWeight: 700 }}>{data.verdict.confidence}%</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//           {data.founderAdvice && (
//             <>
//               <div className="clabel">نصيحة صريحة لصاحب المشروع</div>
//               <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8 }}>{data.founderAdvice}</p>
//             </>
//           )}
//           {data.criticalSuccessFactors?.length > 0 && (
//             <div style={{ marginTop: "1rem" }}>
//               <div style={{ fontSize: ".7rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem" }}>عوامل النجاح الحاسمة:</div>
//               {data.criticalSuccessFactors.map((f: string, i: number) => (
//                 <div key={i} style={{ display: "flex", gap: ".5rem", padding: ".4rem 0" }}>
//                   <span style={{ color: primary }}>★</span>
//                   <span style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{f}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد
//       </button>
//     </div>
//   );
// }

// /* ── OBJECTIONS TAB ── (NEW: reads objections from DB) ── */
// function ObjectionsTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [openIdx, setOpenIdx] = useState<number | null>(0);

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/regenerate/objections`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
//       else { onGenerated(json.objections); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   if (!data || Object.keys(data).length === 0) return (
//     <div className="card">
//       <div className="clabel">ردود الاعتراضات</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد ردود الاعتراضات" />
//     </div>
//   );

//   const catColor: Record<string, string> = {
//     "السعر": "#F87171",
//     "المنافسة": "#60A5FA",
//     "التردد": "#FBBF24",
//     "الشك": "#A78BFA",
//     "التوقيت": "#4ADE80",
//   };

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

//       {data.salesVoice && (
//         <div className="card" style={{ borderColor: `${primary}33` }}>
//           <div style={{ fontSize: ".65rem", color: primary, fontWeight: 700, marginBottom: ".375rem" }}>🎤 نبرة المبيعات</div>
//           <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.7 }}>{data.salesVoice}</p>
//         </div>
//       )}

//       {data.objections?.map((obj: any, i: number) => {
//         const cc = catColor[obj.category] || primary;
//         const isOpen = openIdx === i;
//         return (
//           <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setOpenIdx(isOpen ? null : i)}>
//             <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
//               <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".62rem", background: cc + "22", color: cc, border: `1px solid ${cc}44`, flexShrink: 0 }}>{obj.category}</span>
//               <span style={{ fontSize: ".88rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>"{obj.objection}"</span>
//               <span style={{ color: "#8A8498", fontSize: ".9rem" }}>{isOpen ? "▲" : "▼"}</span>
//             </div>

//             {isOpen && (
//               <div style={{ marginTop: "1rem" }} onClick={e => e.stopPropagation()}>
//                 {obj.psychologyBehind && (
//                   <div style={{ background: "#08080F", borderRadius: 8, padding: ".75rem", marginBottom: ".625rem", borderRight: `3px solid ${cc}` }}>
//                     <div style={{ fontSize: ".6rem", color: cc, fontWeight: 700, marginBottom: ".25rem" }}>🧠 ما وراء الاعتراض</div>
//                     <p style={{ fontSize: ".78rem", color: "#8A8498", margin: 0 }}>{obj.psychologyBehind}</p>
//                   </div>
//                 )}

//                 {obj.response && (
//                   <div style={{ background: `${primary}08`, borderRadius: 10, padding: "1rem", marginBottom: ".625rem", border: `1px solid ${primary}22` }}>
//                     <div style={{ fontSize: ".65rem", color: primary, fontWeight: 700, marginBottom: ".5rem" }}>💬 الرد المقترح</div>
//                     <p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.75, margin: 0 }}>{obj.response}</p>
//                   </div>
//                 )}

//                 {obj.keyPoints?.filter(Boolean).length > 0 && (
//                   <div style={{ marginBottom: ".625rem" }}>
//                     <div style={{ fontSize: ".65rem", color: "#8A8498", fontWeight: 700, marginBottom: ".4rem" }}>نقاط الإقناع الرئيسية:</div>
//                     {obj.keyPoints.filter(Boolean).map((kp: string, j: number) => (
//                       <div key={j} style={{ display: "flex", gap: ".5rem", padding: ".35rem 0" }}>
//                         <span style={{ color: primary, flexShrink: 0 }}>✦</span>
//                         <span style={{ fontSize: ".8rem", color: "#C4BDB5" }}>{kp}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
//                   {obj.reframe && (
//                     <div style={{ background: "#08080F", borderRadius: 8, padding: ".75rem" }}>
//                       <div style={{ fontSize: ".6rem", color: "#60A5FA", fontWeight: 700, marginBottom: ".25rem" }}>🔄 إعادة الإطار</div>
//                       <p style={{ fontSize: ".78rem", color: "#C4BDB5", margin: 0 }}>{obj.reframe}</p>
//                     </div>
//                   )}
//                   {obj.closingLine && (
//                     <div style={{ background: "#08080F", borderRadius: 8, padding: ".75rem" }}>
//                       <div style={{ fontSize: ".6rem", color: "#4ADE80", fontWeight: 700, marginBottom: ".25rem" }}>🎯 الجملة الختامية</div>
//                       <p style={{ fontSize: ".8rem", color: "#4ADE80", margin: 0, fontWeight: 600 }}>"{obj.closingLine}"</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {data.generalTips?.length > 0 && (
//         <div className="card">
//           <div className="clabel">نصائح عامة للتعامل مع الاعتراضات</div>
//           {data.generalTips.map((tip: string, i: number) => (
//             <div key={i} style={{ display: "flex", gap: ".5rem", padding: ".5rem 0", borderBottom: i < data.generalTips.length - 1 ? "1px solid #1E1E2E" : "none" }}>
//               <span style={{ color: primary }}>💡</span>
//               <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{tip}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد
//       </button>
//     </div>
//   );
// }

// /* ── BUYER PERSONA TAB ── (uses regenerate endpoint) ── */
// function BuyerPersonaTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/generate/buyer-persona`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل"); }
//       else { onGenerated(json.buyerPersona); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ في الاتصال"); } finally { setLoading(false); }
//   };

//   if (!data) return (
//     <div className="card">
//       <div className="clabel">العميل المثالي — Buyer Persona</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد العميل المثالي" />
//     </div>
//   );

//   const PersonaCard = ({ p, isPrimary }: { p: any; isPrimary: boolean }) => (
//     <div style={{ background: isPrimary ? `${primary}08` : "#0A0A14", border: `1px solid ${isPrimary ? primary + "33" : "#1E1E2E"}`, borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
//       <div style={{ display: "flex", alignItems: "center", gap: ".875rem", marginBottom: "1rem" }}>
//         <div style={{ width: 56, height: 56, borderRadius: "50%", background: isPrimary ? primary : "#1E1E2E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", flexShrink: 0 }}>{p.emoji || "👤"}</div>
//         <div>
//           <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
//             <span style={{ fontSize: "1rem", fontWeight: 700, color: "#F0EDE6" }}>{p.name}</span>
//             {isPrimary && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: primary, color: "#08080F", fontWeight: 700 }}>الشريحة الأساسية</span>}
//           </div>
//           <div style={{ fontSize: ".78rem", color: "#8A8498", marginTop: ".2rem" }}>{p.age} · {p.gender} · {p.location}</div>
//           <div style={{ fontSize: ".75rem", color: primary }}>{p.job} · {p.income}</div>
//         </div>
//       </div>
//       {p.bio && <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".875rem", fontStyle: "italic", borderRight: `2px solid ${primary}`, paddingRight: ".75rem" }}>"{p.bio}"</p>}
//       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
//         {p.goals?.length > 0 && (
//           <div>
//             <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#4ADE80", marginBottom: ".375rem" }}>🎯 الأهداف</div>
//             {p.goals.map((g: string, i: number) => <div key={i} style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".2rem" }}>• {g}</div>)}
//           </div>
//         )}
//         {p.pains?.length > 0 && (
//           <div>
//             <div style={{ fontSize: ".6rem", fontWeight: 700, color: "#F87171", marginBottom: ".375rem" }}>😤 المشاكل</div>
//             {p.pains.map((g: string, i: number) => <div key={i} style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".2rem" }}>• {g}</div>)}
//           </div>
//         )}
//       </div>
//       {p.buyingBehavior && (
//         <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem", marginTop: ".75rem" }}>
//           <div style={{ fontSize: ".6rem", color: primary, fontWeight: 700, marginBottom: ".25rem" }}>🛒 سلوك الشراء</div>
//           <p style={{ fontSize: ".78rem", color: "#C4BDB5", margin: 0 }}>{p.buyingBehavior}</p>
//         </div>
//       )}
//       {p.quote && (
//         <div style={{ marginTop: ".75rem", padding: ".625rem .875rem", borderRight: `3px solid ${primary}`, background: `${primary}08` }}>
//           <p style={{ fontSize: ".8rem", color: "#C4BDB5", fontStyle: "italic", margin: 0 }}>"{p.quote}"</p>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
//       {data.primary && <PersonaCard p={data.primary} isPrimary={true} />}
//       {data.secondary?.name && <PersonaCard p={data.secondary} isPrimary={false} />}
//       {data.insights?.length > 0 && (
//         <div className="card">
//           <div className="clabel">رؤى تسويقية مهمة</div>
//           {data.insights.map((ins: string, i: number) => (
//             <div key={i} style={{ display: "flex", gap: ".5rem", padding: ".5rem 0", borderBottom: i < data.insights.length - 1 ? "1px solid #1E1E2E" : "none" }}>
//               <span style={{ color: primary }}>💡</span>
//               <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{ins}</span>
//             </div>
//           ))}
//         </div>
//       )}
//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
//       </button>
//     </div>
//   );
// }

// /* ── AD SCRIPTS TAB ── (uses paid endpoint) ── */
// function AdScriptsTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [openScript, setOpenScript] = useState(0);

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/generate/ad-scripts`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل"); }
//       else { onGenerated(json.adScripts); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ"); } finally { setLoading(false); }
//   };

//   if (!data) return (
//     <div className="card">
//       <div className="clabel">سكريبتات إعلانات الفيديو</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد سكريبتات الإعلانات" />
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

//       {data.scripts?.map((s: any, i: number) => (
//         <div key={i} className="card">
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpenScript(openScript === i ? -1 : i)}>
//             <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
//               <span style={{ fontSize: "1.1rem" }}>🎬</span>
//               <div>
//                 <div style={{ fontSize: ".85rem", fontWeight: 700, color: "#F0EDE6" }}>{s.platform}</div>
//                 <div style={{ fontSize: ".68rem", color: "#8A8498" }}>{s.duration} · {s.type}</div>
//               </div>
//             </div>
//             <span style={{ color: "#8A8498", fontSize: ".9rem" }}>{openScript === i ? "▲" : "▼"}</span>
//           </div>

//           {openScript === i && (
//             <div style={{ marginTop: "1rem" }}>
//               {[["⚡ الجملة الافتتاحية", s.hook, "#C9973A"], ["😤 المشكلة", s.problem, "#F87171"], ["✨ الحل", s.solution, "#4ADE80"], ["📢 نداء الإجراء", s.cta, primary]].map(([label, val, color]) => val ? (
//                 <div key={label} style={{ background: "#08080F", borderRadius: 8, padding: ".75rem", marginBottom: ".5rem", borderRight: `3px solid ${color}` }}>
//                   <div style={{ fontSize: ".6rem", color: color as string, fontWeight: 700, marginBottom: ".25rem" }}>{label}</div>
//                   <p style={{ fontSize: ".82rem", color: "#C4BDB5", margin: 0, lineHeight: 1.65 }}>{val}</p>
//                 </div>
//               ) : null)}
//               {s.voiceover && (
//                 <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}>
//                   <div style={{ fontSize: ".6rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem" }}>📝 النص الكامل (Voiceover)</div>
//                   <p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.8, margin: 0 }}>{s.voiceover}</p>
//                 </div>
//               )}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem", marginTop: ".625rem" }}>
//                 {s.visuals && <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>🎥 المشاهد</div><p style={{ fontSize: ".75rem", color: "#C4BDB5", margin: 0 }}>{s.visuals}</p></div>}
//                 {s.music && <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>🎵 الموسيقى</div><p style={{ fontSize: ".75rem", color: "#C4BDB5", margin: 0 }}>{s.music}</p></div>}
//               </div>
//             </div>
//           )}
//         </div>
//       ))}

//       {data.googleAds && (
//         <div className="card">
//           <div className="clabel">إعلانات Google Ads</div>
//           <div style={{ marginBottom: ".875rem" }}>
//             <p style={{ fontSize: ".72rem", color: "#8A8498", marginBottom: ".5rem", fontWeight: 700 }}>العناوين (Headlines)</p>
//             <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
//               {data.googleAds.headlines?.map((h: string, i: number) => (
//                 <div key={i} style={{ background: "#0A0A14", borderRadius: 7, padding: ".5rem .75rem", fontSize: ".82rem", color: "#60A5FA", border: "1px solid #1E1E2E" }}>{h}</div>
//               ))}
//             </div>
//           </div>
//           <div>
//             <p style={{ fontSize: ".72rem", color: "#8A8498", marginBottom: ".5rem", fontWeight: 700 }}>الأوصاف (Descriptions)</p>
//             <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
//               {data.googleAds.descriptions?.map((d: string, i: number) => (
//                 <div key={i} style={{ background: "#0A0A14", borderRadius: 7, padding: ".5rem .75rem", fontSize: ".82rem", color: "#C4BDB5", border: "1px solid #1E1E2E" }}>{d}</div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
//       </button>
//     </div>
//   );
// }

// /* ── EMAIL CAMPAIGN TAB ── (uses paid endpoint) ── */
// function EmailCampaignTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [openEmail, setOpenEmail] = useState(0);

//   const generate = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/projects/${projectId}/generate/email-campaign`, { method: "POST" });
//       const json = await res.json();
//       if (!res.ok) { setMsg(json.message || "فشل"); }
//       else { onGenerated(json.emailCampaign); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
//     } catch { setMsg("خطأ"); } finally { setLoading(false); }
//   };

//   if (!data) return (
//     <div className="card">
//       <div className="clabel">حملة البريد الإلكتروني</div>
//       {msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}
//       <PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد حملة الإيميل" />
//     </div>
//   );

//   return (
//     <div className="fade-up">
//       {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

//       <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem" }}>
//         {data.sequence?.map((_: any, i: number) => (
//           <button key={i} onClick={() => setOpenEmail(i)}
//             style={{ padding: ".4rem .9rem", borderRadius: 20, border: `1.5px solid ${openEmail === i ? primary : "#1E1E2E"}`, background: openEmail === i ? primary : "transparent", color: openEmail === i ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: openEmail === i ? 700 : 400, cursor: "pointer" }}>
//             إيميل {i + 1}
//           </button>
//         ))}
//       </div>

//       {data.sequence?.map((email: any, i: number) => openEmail === i && (
//         <div key={i} className="card">
//           <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
//             <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".65rem", background: `${primary}15`, color: primary, border: `1px solid ${primary}33` }}>{email.trigger}</span>
//             <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".65rem", background: "#1E1E2E", color: "#8A8498" }}>{email.delay}</span>
//             <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".65rem", background: "#4ADE8015", color: "#4ADE80" }}>{email.goal}</span>
//           </div>

//           <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1rem", border: "1px solid #1E1E2E", marginBottom: ".75rem" }}>
//             <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".25rem" }}>سطر الموضوع</div>
//             <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{email.subject}</div>
//             {email.preview && <div style={{ fontSize: ".72rem", color: "#8A8498", marginTop: ".25rem", fontStyle: "italic" }}>{email.preview}</div>}
//           </div>

//           <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", direction: "rtl" }}>
//             <p style={{ fontSize: ".88rem", color: "#1A1A28", marginBottom: ".75rem" }}>{email.body?.greeting}</p>
//             <p style={{ fontSize: ".9rem", fontWeight: 700, color: "#1A1A28", marginBottom: ".75rem" }}>{email.body?.opening}</p>
//             <p style={{ fontSize: ".85rem", color: "#3A3650", lineHeight: 1.8, marginBottom: "1rem" }}>{email.body?.mainContent}</p>
//             {email.body?.valueProposition && (
//               <div style={{ background: "#f8f8fc", borderRadius: 8, padding: ".875rem", borderRight: `3px solid ${primary}`, marginBottom: "1rem" }}>
//                 <p style={{ fontSize: ".82rem", color: "#1A1A28", margin: 0 }}>{email.body.valueProposition}</p>
//               </div>
//             )}
//             <div style={{ textAlign: "center", margin: "1.25rem 0" }}>
//               <span style={{ display: "inline-block", padding: ".75rem 2rem", background: primary, color: "#08080F", borderRadius: 10, fontWeight: 700, fontSize: ".9rem" }}>{email.body?.cta}</span>
//             </div>
//             <p style={{ fontSize: ".8rem", color: "#8A8498" }}>{email.body?.closing}</p>
//           </div>
//         </div>
//       ))}

//       {data.tips?.length > 0 && (
//         <div className="card">
//           <div className="clabel">نصائح لتحسين معدل الفتح</div>
//           {data.tips.map((tip: string, i: number) => (
//             <div key={i} style={{ display: "flex", gap: ".5rem", padding: ".5rem 0", borderBottom: i < data.tips.length - 1 ? "1px solid #1E1E2E" : "none" }}>
//               <span style={{ color: primary }}>💡</span>
//               <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{tip}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
//         {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
//       </button>
//     </div>
//   );
// }




































// التصميم والديزين كله صح بس مش شغلا 









import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ParticleBackground from "../components/ParticleBackground";
import { apiFetch } from "../lib/api";

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
        const userRes = await apiFetch("/api/auth/me");
        if (!userRes.ok) {
          navigate("/login");
          return;
        }
        const userData = await userRes.json();
        setUser(userData.user);
        const projRes = await apiFetch("/api/projects");
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
      const res = await apiFetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, customBrandName: bname, selectedStyle: style, selectedColors: cols }),
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
        const res = await apiFetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const data = await res.json();
        const { status } = data.project;

        if (status === "completed") {
          stopAllTimers();
          setPct(100);
          setPhase(4);
          setTimeout(async () => {
            try {
              const resultRes = await apiFetch(`/api/projects/${projectId}/result`);
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
      const res = await apiFetch("/api/projects");
      if (res.ok) { const data = await res.json(); setProjects(data.projects || []); }
    } catch (e) { console.error(e); }
  };

  const handleViewResult = async (projId: string) => {
    setLoading(true);
    try {
      const resultRes = await apiFetch(`/api/projects/${projId}/result`);
      if (!resultRes.ok) { alert("فشل تحميل هذا المشروع"); return; }
      const resultData = await resultRes.json();
      const success = safeSetResult(resultData);
      if (success) { setView("result"); setTab("identity"); }
      else alert("بيانات المشروع غير مكتملة");
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  const handleDeleteProject = async (projId: string) => {
    if (deleteConfirmId !== projId) {
      setDeleteConfirmId(projId);
      setTimeout(() => setDeleteConfirmId((cur) => (cur === projId ? null : cur)), 3000);
      return;
    }
    setDeleteConfirmId(null);
    setDeletingId(projId);
    try {
      const res = await apiFetch(`/api/projects/${projId}`, { method: "DELETE" });
      if (res.ok) { setProjects((prev) => prev.filter((p) => p._id !== projId)); }
      else { const data = await res.json(); alert(data.message || "فشل حذف المشروع"); }
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { setDeletingId(null); }
  };

  const handleLogout = async () => {
    try { await apiFetch("/api/auth/logout", { method: "POST" }); navigate("/login"); }
    catch (e) { console.error(e); }
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#08080F" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #C9973A33", borderTop: "3px solid #C9973A", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );

  return (
    <div style={{ fontFamily: "'Tajawal', sans-serif", direction: "rtl", minHeight: "100vh", background: "#08080F", color: "#F0EDE6", paddingTop: 64, position: "relative", overflow: "hidden" }}>
      <ParticleBackground />

      {/* ── Navbar ── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 90,
          height: 64,
          background: "rgba(8,8,15,.92)",
          borderBottom: "1px solid #1E1E2E",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.5rem",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="navHex" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8C46A" />
                <stop offset="100%" stopColor="#C8903A" />
              </linearGradient>
              <filter id="navGlowF">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#D4A847" floodOpacity="0.55" />
              </filter>
            </defs>
          </svg>
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "22px",
              fontWeight: 850,
              letterSpacing: ".5px",
              background: "linear-gradient(135deg, #E8C46A, #D4A847, #C8903A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-flex",
              alignItems: "center",
              direction: "ltr",
            }}
          >
            EG
            <span style={{ WebkitTextFillColor: "transparent", width: "6px" }} />
            B
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36" style={{ marginBottom: "-1px", flexShrink: 0, margin: "0 1px" }}>
              <defs>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8C46A" />
                  <stop offset="50%" stopColor="#D4A847" />
                  <stop offset="100%" stopColor="#C8903A" />
                </linearGradient>
              </defs>
              <polygon points="18,2 32,10 32,26 18,34 4,26 4,10" fill="none" stroke="url(#gold)" strokeWidth="2" />
              <circle cx="18" cy="18" r="9" fill="none" stroke="url(#gold)" strokeWidth="1.5" />
              <polygon points="18,11 23,18 18,25 13,18" fill="url(#gold)" />
              <polygon points="18,14 21,18 18,22 15,18" fill="#0d0d1a" />
            </svg>
            nd
          </span>
        </Link>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Sora, sans-serif",
              fontSize: "15px",
              fontWeight: 800,
              letterSpacing: "0.3px",
              background: "linear-gradient(90deg, #F0C96B, #C9973A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            {/* EG Brand */}
          </span>
          <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "10px", fontWeight: 500, color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}></span>
        </div>

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
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteProject(proj._id); }}
                      disabled={deletingId === proj._id}
                      title={deleteConfirmId === proj._id ? "اضغط مجدداً للتأكيد" : "حذف المشروع"}
                      style={{
                        position: "absolute", top: "10px", left: "10px",
                        width: deleteConfirmId === proj._id ? "auto" : 28, height: 28,
                        padding: deleteConfirmId === proj._id ? "0 .5rem" : "0",
                        borderRadius: deleteConfirmId === proj._id ? 6 : "50%",
                        border: `1px solid ${deleteConfirmId === proj._id ? "#F8717155" : "#1E1E2E"}`,
                        background: deleteConfirmId === proj._id ? "#F8717115" : "transparent",
                        color: deleteConfirmId === proj._id ? "#F87171" : "#3A3650",
                        fontSize: deleteConfirmId === proj._id ? ".62rem" : ".75rem",
                        cursor: deletingId === proj._id ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: ".25rem",
                        transition: "all .2s", zIndex: 2, whiteSpace: "nowrap",
                        fontFamily: "Tajawal, sans-serif", fontWeight: 600,
                        opacity: deletingId === proj._id ? 0.5 : 1,
                      }}
                      onMouseEnter={(e) => { if (deleteConfirmId !== proj._id) { e.currentTarget.style.borderColor = "#F8717155"; e.currentTarget.style.color = "#F87171"; e.currentTarget.style.background = "#F8717110"; } }}
                      onMouseLeave={(e) => { if (deleteConfirmId !== proj._id) { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#3A3650"; e.currentTarget.style.background = "transparent"; } }}
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
                        <span style={{ fontSize: ".65rem", color: "#3A3650" }}>{new Date(proj.createdAt).toLocaleDateString("ar-EG")}</span>
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
                      style={{
                        width: 34, height: 34, borderRadius: "50%", background: c.hex, cursor: "pointer",
                        border: cols.includes(c.id) ? "2px solid #fff" : "2px solid transparent",
                        boxShadow: cols.includes(c.id) ? "0 0 0 2px rgba(255,255,255,.2)" : "none",
                        transform: cols.includes(c.id) ? "scale(1.1)" : "scale(1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: ".85rem", transition: "all .15s",
                      }}
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
        <ResultScreen
          result={result}
          tab={tab}
          setTab={setTab}
          onBack={() => { setView("list"); fetchProjectsList(); }}
        />
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
          <circle cx="55" cy="55" r="48" fill="none" stroke="#C9973A" strokeWidth="4" strokeLinecap="round"
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
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: ".75rem", padding: ".5rem .875rem", borderRadius: 9, fontSize: ".8rem",
            background: i < phase ? "#4ADE8011" : i === phase ? "#C9973A11" : "transparent",
            color: i < phase ? "#4ADE80" : i === phase ? "#C9973A" : "#3A3650",
            transition: "all .3s",
          }}>
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
  { id: "card", label: "💼 بطاقة عمل" },
  { id: "launch", label: "🚀 خطة الإطلاق" },
  { id: "swot", label: "📊 SWOT" },
  { id: "objections", label: "💬 الاعتراضات" },
  { id: "persona", label: "👤 العميل المثالي" },
  { id: "ads", label: "🎬 سكريبت إعلان" },
  { id: "email", label: "📧 حملة إيميل" },
  { id: "competitors", label: "🔍 المنافسون" },
  { id: "businessOverview", label: "🏢 شرح البيزنس" },
  { id: "agePreferences", label: "🎯 تفضيلات الأجيال" },
  { id: "faq", label: "❓ الأسئلة الشائعة" },
];

function ResultScreen({ result, tab, setTab, onBack }: { result: any; tab: string; setTab: (t: string) => void; onBack: () => void; }) {
  const [socialData, setSocialData] = useState<any>(null);
  const [launchPlan, setLaunchPlan] = useState<any>(result?.launchPlan || null);
  const [swotData, setSwotData] = useState<any>(result?.swot || null);
  const [objections, setObjections] = useState<any>(result?.objections || null);
  const [persona, setPersona] = useState<any>(result?.buyerPersona || null);
  const [adScripts, setAdScripts] = useState<any>(result?.adScripts || null);
  const [emailCamp, setEmailCamp] = useState<any>(result?.emailCampaign || null);
  const [businessOverview, setBusinessOverview] = useState<any>(result?.businessOverview || null);
  const [agePreferences, setAgePreferences] = useState<any>(result?.agePreferences || null);
  const [faqData, setFaqData] = useState<any>(result?.faq || null);

  const brand = result?.brandIdentity ?? {};
  const logoRaw = result?.logo ?? {};
  const logoStr = typeof logoRaw === "string" ? logoRaw : (logoRaw?.svg ?? logoRaw?.svgCode ?? logoRaw?.content ?? logoRaw?.code ?? "");
  const logo = sanitizeSVGClient(logoStr);
  const social = socialData ?? result?.socialMedia ?? {};
  const landing = result?.landingPage ?? {};
  const brochureContent = result?.brochureContent ?? result?.brochure ?? {};
  const competitors = result?.competitors ?? {};
  const projectId = result?.projectId ?? result?._id ?? "";

  const namesRaw: any[] = brand?.names ?? [];
  const nameObjects: { name: string; reason?: string; meaning?: string }[] = namesRaw.map((n: any) => (typeof n === "string" ? { name: n } : n));
  const displayName = result?.displayName ?? brand?.recommendedName ?? brand?.name ?? nameObjects[0]?.name ?? "Brand";
  const primary = brand?.primaryColor ?? brand?.colors?.[0]?.hex ?? "#C9973A";
  const secondary = brand?.secondaryColor ?? brand?.colors?.[1]?.hex ?? "#0E0E1A";

  return (
    <div className="page fade-up">
      <div className="wrap" style={{ maxWidth: 800 }}>
        <div className="topbar">
          <button className="icon-btn" onClick={onBack}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: "Sora, sans-serif", fontSize: "14px", fontWeight: 800, background: "linear-gradient(90deg,#F0C96B,#C9973A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>EG Brand</span>
              <span style={{ fontFamily: "Tajawal, sans-serif", fontSize: "9px", color: "#5A5270", letterSpacing: "0.5px", lineHeight: 1 }}></span>
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
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: ".5rem 1.1rem", borderRadius: 20, border: `1.5px solid ${tab === t.id ? primary : "#1E1E2E"}`, background: tab === t.id ? primary : "transparent", color: tab === t.id ? secondary : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".82rem", fontWeight: tab === t.id ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "identity" && <IdentityTab brand={brand} primary={primary} nameObjects={nameObjects} />}
        {tab === "logo" && <LogoTab logo={logo} displayName={displayName} brand={brand} />}
        {tab === "social" && <SocialTab social={social} displayName={displayName} projectId={projectId} onSocialUpdate={(s) => setSocialData(s)} />}
        {tab === "landing" && <LandingTab landing={landing} displayName={displayName} primary={primary} secondary={secondary} />}
        {tab === "brochure" && <BrochureTab brand={brand} brochureContent={brochureContent} displayName={displayName} primary={primary} secondary={secondary} />}
        {tab === "card" && <BusinessCardTab brand={brand} displayName={displayName} primary={primary} secondary={secondary} />}
        {tab === "launch" && <LaunchPlanTab data={launchPlan} projectId={projectId} primary={primary} onGenerated={setLaunchPlan} />}
        {tab === "swot" && <SwotTab data={swotData} projectId={projectId} primary={primary} onGenerated={setSwotData} />}
        {tab === "objections" && <ObjectionsTab data={objections} projectId={projectId} primary={primary} onGenerated={setObjections} />}
        {tab === "persona" && <BuyerPersonaTab data={persona} projectId={projectId} primary={primary} onGenerated={setPersona} />}
        {tab === "ads" && <AdScriptsTab data={adScripts} projectId={projectId} primary={primary} onGenerated={setAdScripts} />}
        {tab === "email" && <EmailCampaignTab data={emailCamp} projectId={projectId} primary={primary} onGenerated={setEmailCamp} />}
        {tab === "competitors" && <CompetitorsTab competitors={competitors} primary={primary} />}
        {tab === "businessOverview" && <BusinessOverviewTab data={businessOverview} projectId={projectId} primary={primary} onGenerated={setBusinessOverview} />}
        {tab === "agePreferences" && <AgePreferencesTab data={agePreferences} projectId={projectId} primary={primary} onGenerated={setAgePreferences} />}
        {tab === "faq" && <FaqTab data={faqData} projectId={projectId} primary={primary} onGenerated={setFaqData} />}

        <button onClick={onBack} style={{ width: "100%", padding: ".875rem", borderRadius: 14, background: "transparent", border: "1.5px solid #1E1E2E", color: "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".95rem", cursor: "pointer", marginTop: "2rem", transition: "all .2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9973A33"; e.currentTarget.style.color = "#C9973A"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.color = "#8A8498"; }}
        >
          ← العودة للبراندات
        </button>
      </div>
    </div>
  );
}

function sanitizeSVGClient(raw: string): string {
  if (!raw || !raw.includes("<svg")) return "";
  let svg = raw.trim();
  if (!svg.includes("xmlns")) svg = svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  if (!svg.includes("viewBox")) svg = svg.replace("<svg", `<svg viewBox="0 0 300 300"`);
  return svg;
}

/* ── IDENTITY TAB ── */
function IdentityTab({ brand, primary, nameObjects }: { brand: any; primary: string; nameObjects: any[]; }) {
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
                  {n.name === brand.recommendedName && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: primary, color: "#08080F", fontWeight: 700 }}>موصى به</span>}
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
        ) : (
          <p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد لوحة الألوان</p>
        )}
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
            <div style={{ fontSize: "1.1rem", color: "rgba(240,237,230,.65)", marginBottom: ".5rem", fontWeight: 300 }}>{brand.typography.arabic}</div>
            <div style={{ fontSize: ".72rem", color: "#8A8498" }}>{brand.typography.style}</div>
          </div>
        </div>
      )}

      {(brand?.voice || brand?.messages) && (
        <div className="card">
          <div className="clabel">نبرة الصوت والرسائل التسويقية</div>
          {brand?.voice?.tone && <p style={{ fontSize: ".85rem", color: "#8A8498", marginBottom: ".75rem" }}>النبرة العامة: <span style={{ color: "#C4BDB5" }}>{brand.voice.tone}</span></p>}
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
function LogoTab({ logo, displayName, brand }: { logo: string; displayName: string; brand: any; }) {
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

  if (!logo) return <div className="card" style={{ textAlign: "center", padding: "3rem" }}><p style={{ color: "#3A3650" }}>⚠️ لم يتم توليد الشعار</p></div>;

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
        <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".7rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.6, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{logo}</pre>
      </div>
    </div>
  );
}

/* ── SOCIAL TAB ── */
function SocialTab({ social, displayName, projectId, onSocialUpdate }: { social: any; displayName: string; projectId?: string; onSocialUpdate?: (s: any) => void; }) {
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

  const categories = ["الكل", ...(Array.from(new Set(postIdeas.map((p: any) => p.category).filter(Boolean))) as string[])];
  const filteredPosts = filterCat === "الكل" ? postIdeas : postIdeas.filter((p: any) => p.category === filterCat);

  const catColor: Record<string, string> = { Lifestyle: "#C9973A", "عرض المنتج/الخدمة": "#60A5FA", "قصص البراند": "#4ADE80", "عروض وتفاعل": "#F87171" };
  const typeIcon: Record<string, string> = { صورة: "🖼", فيديو: "🎬", كاروسيل: "📑", Reel: "🎞" };

  const handleGenerateMore = async () => {
    if (!projectId) return;
    setGenerating(true);
    setGenMsg("جاري توليد محتوى إضافي...");
    try {
      const res = await apiFetch(`/api/projects/${projectId}/extra-social`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setGenMsg(data.message || "فشل التوليد"); }
      else { setGenMsg(`✓ تم التوليد! رصيدك المتبقي: ${data.creditsLeft}`); onSocialUpdate?.(data.social); setTimeout(() => setGenMsg(""), 3000); }
    } catch { setGenMsg("خطأ في الاتصال"); }
    finally { setGenerating(false); }
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
          <button key={id} onClick={() => setPtab(id as any)} style={{ padding: ".4rem .85rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: ptab === id ? "#C9973A" : "transparent", color: ptab === id ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: ptab === id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>{label}</button>
        ))}
        <button onClick={handleGenerateMore} disabled={generating} style={{ marginRight: "auto", padding: ".4rem 1rem", borderRadius: 20, border: "1.5px solid #C9973A44", background: generating ? "#1E1E2E" : "transparent", color: generating ? "#8A8498" : "#C9973A", fontFamily: "Tajawal,sans-serif", fontSize: ".75rem", fontWeight: 600, cursor: generating ? "default" : "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: ".35rem" }}>
          {generating ? "⏳" : "✦"} توليد إضافي <span style={{ padding: ".1rem .4rem", borderRadius: 4, background: "#C9973A22", fontSize: ".65rem" }}>1 كريديت</span>
        </button>
      </div>

      {genMsg && <div style={{ background: genMsg.startsWith("✓") ? "#4ADE8011" : "#F8717111", border: `1px solid ${genMsg.startsWith("✓") ? "#4ADE8033" : "#F8717133"}`, borderRadius: 8, padding: ".6rem 1rem", marginBottom: ".75rem", fontSize: ".8rem", color: genMsg.startsWith("✓") ? "#4ADE80" : "#F87171", textAlign: "center" }}>{genMsg}</div>}

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
                        const el = <circle key={i} cx="18" cy="18" r="15.9" fill="none" stroke={seg.color || "#C9973A"} strokeWidth="3.2" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={(-offset * circ) / 100} />;
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
                <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: ".3rem .7rem", borderRadius: 16, border: `1px solid ${filterCat === cat ? catColor[cat] || "#C9973A" : "#1E1E2E"}`, background: filterCat === cat ? (catColor[cat] || "#C9973A") + "22" : "transparent", color: filterCat === cat ? catColor[cat] || "#C9973A" : "#8A8498", fontSize: ".72rem", cursor: "pointer" }}>{cat}</button>
              ))}
            </div>
          )}
          {filteredPosts.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "2rem" }}><p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار البوستات</p></div>
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
                    {p.visual && <div style={{ background: "#08080F", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem", borderRight: `2px solid ${cc}66` }}><div style={{ fontSize: ".6rem", color: cc, fontWeight: 700, marginBottom: ".25rem" }}>🎨 المشهد البصري</div><p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.6, margin: 0 }}>{p.visual}</p></div>}
                    {p.caption && <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".5rem", whiteSpace: "pre-wrap" }}>{p.caption}</p>}
                    {p.hashtags && <p style={{ fontSize: ".75rem", color: "#60A5FA", lineHeight: 1.7, marginBottom: ".375rem" }}>{p.hashtags}</p>}
                    {p.category && <div style={{ marginTop: ".5rem" }}><span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: cc + "15", color: cc, border: `1px solid ${cc}33` }}>{p.category}</span></div>}
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
            <div className="card" style={{ textAlign: "center", padding: "2rem" }}><p style={{ color: "#3A3650", fontSize: ".82rem" }}>لم يتم توليد أفكار الفيديوهات</p></div>
          ) : videoIdeas.map((v: any, i: number) => (
            <div key={i} style={{ background: "#0A0A14", border: "1px solid #1E1E2E", borderRadius: 14, padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".875rem" }}>
                <span style={{ fontSize: "1.1rem" }}>🎬</span>
                <span style={{ fontSize: ".82rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>{v.concept || `فكرة فيديو ${i + 1}`}</span>
                <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#69C9D033", color: "#69C9D0" }}>{v.platform}</span>
                <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".62rem", background: "#1E1E2E", color: "#8A8498" }}>{v.duration}</span>
              </div>
              {v.hook && <div style={{ background: "#C9973A0D", border: "1px solid #C9973A22", borderRadius: 8, padding: ".625rem .75rem", marginBottom: ".625rem" }}><div style={{ fontSize: ".6rem", color: "#C9973A", fontWeight: 700, marginBottom: ".2rem" }}>⚡ الجملة الافتتاحية (أول 3 ثواني)</div><p style={{ fontSize: ".85rem", fontWeight: 600, color: "#F0EDE6", margin: 0 }}>"{v.hook}"</p></div>}
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
                {v.music && <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>🎵 نوع الموسيقى</div><div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{v.music}</div></div>}
                {v.cta && <div style={{ background: "#08080F", borderRadius: 8, padding: ".5rem .625rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".2rem" }}>📢 نداء الإجراء</div><div style={{ fontSize: ".78rem", color: "#4ADE80" }}>{v.cta}</div></div>}
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
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f9ce34,#ee2a7b,#6228d7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".6rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{displayName.slice(0, 2).toUpperCase()}</div>
                    <div><div style={{ fontSize: ".78rem", fontWeight: 700, color: "#F0EDE6" }}>{displayName}</div><div style={{ fontSize: ".6rem", color: "#3A3650" }}>حساب رسمي</div></div>
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
          {igPosts.length === 0 && twTweets.length === 0 && <p style={{ color: "#3A3650", fontSize: ".82rem", textAlign: "center", padding: "1.5rem" }}>لا يوجد منشورات جاهزة</p>}
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
            ) : <p style={{ color: "#3A3650", fontSize: ".82rem", marginBottom: "1rem" }}>لم يتم توليد الخطة الأسبوعية</p>}
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
function LandingTab({ landing, displayName, primary, secondary }: { landing: any; displayName: string; primary: string; secondary: string; }) {
  const [view, setView] = useState("preview");
  const stats = landing?.stats ?? [{ value: "100+", label: "عميل راضٍ" }, { value: "98%", label: "معدل الرضا" }, { value: "24/7", label: "دعم مستمر" }];

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
.cta-sec{padding:5rem 2rem;text-align:center;background:linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border-top:1px solid rgba(255,255,255,.07)}
.cta-sec h2{font-size:2.25rem;font-weight:900;margin-bottom:.875rem;color:#fff}
.cta-sec p{color:rgba(240,237,230,.6);margin-bottom:2rem;font-size:1rem}
footer{padding:1.5rem 2rem;border-top:1px solid rgba(255,255,255,.07);text-align:center;font-size:.78rem;color:rgba(240,237,230,.25)}
</style>
</head>
<body>
<nav><div class="logo">${displayName}</div><button class="nav-cta">${landing?.hero?.cta || "تواصل معنا"}</button></nav>
<div class="hero">
  <h1>${landing?.hero?.headline || landing?.headline || "نحن هنا لخدمتك"}</h1>
  <p>${landing?.hero?.subheadline || landing?.subheadline || ""}</p>
  <button class="hero-btn">${landing?.hero?.cta || "ابدأ الآن"}</button>
</div>
<div class="stats">${stats.map((s: any) => `<div class="stat"><div class="stat-val">${s.value}</div><div class="stat-lbl">${s.label}</div></div>`).join("")}</div>
<div class="feats">${(landing?.features || landing?.sections || []).map((f: any) => `<div class="feat"><div class="feat-icon">${f.emoji || "✦"}</div><h3>${f.title || ""}</h3><p>${f.desc || f.description || ""}</p></div>`).join("")}</div>
<div class="cta-sec"><h2>${landing?.cta?.headline || "انضم إلينا اليوم"}</h2><p>${landing?.cta?.subheadline || ""}</p><button class="hero-btn">${landing?.cta?.button || "ابدأ الآن"}</button></div>
<footer>© ${new Date().getFullYear()} ${displayName} — جميع الحقوق محفوظة</footer>
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
        {[["preview", "👁 معاينة"], ["code", "{ } الكود"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{ padding: ".45rem .9rem", borderRadius: 20, border: "1.5px solid #1E1E2E", background: view === k ? "#1E1E2E" : "transparent", color: view === k ? "#F0EDE6" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", cursor: "pointer" }}>{l}</button>
        ))}
        <button className="gold-btn" style={{ marginRight: "auto", padding: ".45rem 1.1rem", fontSize: ".78rem" }} onClick={handleDownload}>⬇ تحميل HTML</button>
      </div>
      {view === "preview" ? (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 5 }}>{["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
            <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>{displayName.toLowerCase().replace(/\s+/g, "-")}.html</span>
            <div style={{ width: 40 }} />
          </div>
          <iframe title="Landing Page Preview" srcDoc={htmlCode} style={{ width: "100%", height: "600px", border: "none" }} />
        </div>
      ) : (
        <div className="card">
          <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", maxHeight: "450px", overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{htmlCode}</pre>
        </div>
      )}
    </div>
  );
}

/* ── BROCHURE TAB ── */
function BrochureTab({ brand, brochureContent, displayName, primary, secondary }: { brand: any; brochureContent: any; displayName: string; primary: string; secondary: string; }) {
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
.intro-band{background:${primary};padding:1.25rem 3rem;display:flex;align-items:center;justify-content:center}
.intro-text{color:${secondary};font-size:.95rem;line-height:1.75;text-align:center;font-weight:500}
.body{background:#fff;padding:2.5rem 3rem;border-left:1px solid #e8e8f0;border-right:1px solid #e8e8f0}
.section-title{font-size:.65rem;font-weight:900;letter-spacing:2px;color:${primary};text-transform:uppercase;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:2px solid ${primary}22}
.services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem}
.service-card{background:#f8f8fc;border-radius:12px;padding:1.25rem;border:1px solid #e8e8f0;text-align:center}
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:2rem}
.why-item{display:flex;align-items:flex-start;gap:.625rem;padding:.875rem;background:#f8f8fc;border-radius:10px;border-right:3px solid ${primary}}
.sections-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:2rem}
.section-block{padding:1.25rem;border-radius:12px;background:#f8f8fc;border:1px solid #e8e8f0;border-top:3px solid ${primary}}
.footer-band{background:${secondary};padding:1.5rem 3rem;border-radius:0 0 18px 18px;display:flex;justify-content:space-between;align-items:center}
.footer-brand{font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:${primary}}
</style>
</head>
<body>
<div class="cover"><div class="cover-pattern"></div><div class="cover-rel"><div class="cover-name">${brocheureHeadline}</div><div class="cover-tagline">${taglineAr}</div><div class="cover-tagline-en">${taglineEn}</div></div></div>
<div class="intro-band"><div class="intro-text">${intro}</div></div>
<div class="body">
  ${services.length > 0 ? `<div class="section-title">خدماتنا</div><div class="services-grid">${services.map((s: any) => `<div class="service-card"><div style="font-size:1.75rem;margin-bottom:.5rem">${s.icon || "✦"}</div><div style="font-size:.88rem;font-weight:700;color:#1A1A28;margin-bottom:.25rem">${s.name || ""}</div><div style="font-size:.75rem;color:#6B6478;line-height:1.5">${s.brief || ""}</div></div>`).join("")}</div>` : ""}
  ${whyUs.length > 0 ? `<div class="section-title">لماذا تختارنا؟</div><div class="why-grid">${whyUs.map((w: string) => `<div class="why-item"><div style="width:8px;height:8px;border-radius:50%;background:${primary};margin-top:.375rem;flex-shrink:0"></div><div style="font-size:.82rem;color:#3A3650;line-height:1.6">${w}</div></div>`).join("")}</div>` : ""}
</div>
<div class="colors-strip" style="display:flex;height:10px">${(brand?.colors || []).map((c: any) => `<div style="flex:1;background:${c.hex}"></div>`).join("")}</div>
<div class="footer-band"><div class="footer-brand">${displayName}</div><div style="font-size:.82rem;color:rgba(240,237,230,.5)">Brand Kit © ${new Date().getFullYear()}</div></div>
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
        <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تنزيل بروشور HTML</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", borderRadius: "18px 18px 0 0", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 5 }}>{["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
          <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>brochure-preview.html</span>
          <div style={{ width: 40 }} />
        </div>
        <iframe title="Brochure Preview" srcDoc={htmlBrochure} style={{ width: "100%", height: "600px", border: "none", background: "#f4f4f8" }} />
      </div>
    </div>
  );
}

/* ── COMPETITORS TAB ── */
function CompetitorsTab({ competitors, primary }: { competitors: any; primary: string; }) {
  if (!competitors || Object.keys(competitors).length === 0) {
    return <div className="card" style={{ textAlign: "center", padding: "3rem" }}><p style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</p><p style={{ color: "#3A3650", fontSize: ".85rem" }}>لم يتم توليد تحليل المنافسين</p></div>;
  }

  const levelColor = (level: string) => level?.includes("شرس") || level?.includes("عالي") ? "#F87171" : level?.includes("متوسط") ? "#FBBF24" : "#4ADE80";
  const sizeColor = (size: string) => size?.includes("ضخم") ? "#A78BFA" : size?.includes("كبير") ? "#60A5FA" : size?.includes("متوسط") ? "#FBBF24" : "#4ADE80";

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
                  <div><div style={{ fontSize: ".6rem", color: "#4ADE80", marginBottom: ".25rem", fontWeight: 700 }}>✓ نقاط القوة</div><p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.strengths ?? "—"}</p></div>
                  <div><div style={{ fontSize: ".6rem", color: "#F87171", marginBottom: ".25rem", fontWeight: 700 }}>✗ نقاط الضعف</div><p style={{ fontSize: ".78rem", color: "#8A8498", lineHeight: 1.55 }}>{c.weaknesses ?? "—"}</p></div>
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

/* ── HELPER: Paid Generate Button ── */
function PaidGenerateBtn({ onGenerate, loading, label = "توليد بـ 1 كريديت" }: { onGenerate: () => void; loading: boolean; label?: string; }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 2rem" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✦</div>
      <p style={{ fontSize: ".9rem", color: "#C4BDB5", marginBottom: "1.5rem", lineHeight: 1.7 }}>هذا المحتوى يتم توليده بواسطة الذكاء الاصطناعي خصيصاً لبراندك</p>
      <button onClick={onGenerate} disabled={loading} style={{ padding: ".875rem 2.5rem", borderRadius: 14, background: loading ? "#1E1E2E" : "#C9973A", color: loading ? "#8A8498" : "#08080F", border: "none", fontFamily: "Tajawal,sans-serif", fontSize: "1rem", fontWeight: 700, cursor: loading ? "default" : "pointer", display: "inline-flex", alignItems: "center", gap: ".5rem" }}>
        {loading ? "⏳ جاري التوليد..." : `🚀 ${label}`}
      </button>
      <p style={{ fontSize: ".7rem", color: "#3A3650", marginTop: ".75rem" }}>يُخصم 1 كريديت من رصيدك</p>
    </div>
  );
}

/* ── BUSINESS CARD TAB ── */
function BusinessCardTab({ brand, displayName, primary, secondary }: { brand: any; displayName: string; primary: string; secondary: string; }) {
  const tagline = brand?.tagline?.ar ?? "";

  const cardHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><title>بطاقة عمل - ${displayName}</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Tajawal',sans-serif;background:#1a1a2e;display:flex;align-items:center;justify-content:center;min-height:100vh;gap:2rem;flex-wrap:wrap;padding:2rem}
.card{width:350px;height:200px;border-radius:16px;position:relative;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.front{background:linear-gradient(135deg,${secondary} 0%,#17172B 100%);border:1px solid ${primary}33;display:flex;flex-direction:column;justify-content:space-between;padding:1.5rem}
.pattern{position:absolute;inset:0;background-image:radial-gradient(${primary}15 1px,transparent 1px);background-size:20px 20px}
.rel{position:relative;height:100%;display:flex;flex-direction:column;justify-content:space-between}
.brand-name{font-size:1.5rem;font-weight:900;color:${primary};letter-spacing:-0.5px}
.back{background:${primary};display:flex;flex-direction:column;justify-content:center;padding:1.5rem;gap:.75rem}
</style></head>
<body>
<div>
  <p style="color:#8A8498;font-size:.75rem;text-align:center;margin-bottom:.75rem;font-family:'Tajawal',sans-serif">الوجه الأمامي</p>
  <div class="card front">
    <div class="pattern"></div>
    <div class="rel">
      <div class="brand-name">${displayName}</div>
      <div>
        <div style="font-size:.7rem;color:${primary};opacity:.8;font-style:italic">${tagline}</div>
        <div style="height:1px;background:rgba(255,255,255,.1);margin:.5rem 0"></div>
        <div style="font-size:1rem;font-weight:700;color:#F0EDE6">[ اسمك هنا ]</div>
        <div style="font-size:.75rem;color:rgba(240,237,230,.5)">[ مسماك الوظيفي ]</div>
      </div>
    </div>
  </div>
</div>
<div>
  <p style="color:#8A8498;font-size:.75rem;text-align:center;margin-bottom:.75rem;font-family:'Tajawal',sans-serif">الوجه الخلفي</p>
  <div class="card back">
    <div style="font-size:.5rem;font-weight:900;letter-spacing:2px;color:${secondary};opacity:.5;text-transform:uppercase;margin-bottom:.5rem">تواصل معنا</div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600">📞 [ رقم الهاتف ]</div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600">✉️ [ البريد الإلكتروني ]</div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600">🌐 [ الموقع الإلكتروني ]</div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600">📸 @[ حساب الإنستقرام ]</div>
    <div style="display:flex;align-items:center;gap:.5rem;font-size:.78rem;color:${secondary};font-weight:600">📍 [ المدينة، الدولة ]</div>
  </div>
</div>
</body></html>`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([cardHTML], { type: "text/html" }));
    a.download = `${displayName}-business-card.html`;
    a.click();
  };

  const emailSig = `<!-- Email Signature -->
<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;direction:rtl">
  <tr>
    <td style="padding-left:15px;border-left:3px solid ${primary}">
      <p style="margin:0;font-size:16px;font-weight:bold;color:#1A1A28">[ اسمك ]</p>
      <p style="margin:2px 0;font-size:13px;color:#6B6478">[ مسماك ] | ${displayName}</p>
      <p style="margin:4px 0;font-size:12px;color:${primary};font-style:italic">${tagline}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#6B6478">📞 [ الهاتف ] &nbsp;|&nbsp; ✉️ [ الإيميل ] &nbsp;|&nbsp; 🌐 [ الموقع ]</p>
    </td>
  </tr>
</table>`;

  return (
    <div className="fade-up">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button className="gold-btn" style={{ padding: ".5rem 1.25rem", fontSize: ".8rem" }} onClick={handleDownload}>⬇ تحميل بطاقة العمل HTML</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#0B0B12", borderBottom: "1px solid #1E1E2E", padding: ".5rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: "18px 18px 0 0" }}>
          <div style={{ display: "flex", gap: 5 }}>{["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}</div>
          <span style={{ fontSize: ".7rem", color: "#3A3650", fontFamily: "monospace" }}>business-card.html</span>
          <div style={{ width: 40 }} />
        </div>
        <iframe srcDoc={cardHTML} title="Business Card" style={{ width: "100%", height: "360px", border: "none" }} />
      </div>
      <div className="card" style={{ marginTop: "1rem" }}>
        <div className="clabel">توقيع الإيميل (Email Signature)</div>
        <p style={{ fontSize: ".78rem", color: "#8A8498", marginBottom: ".75rem" }}>انسخ الكود أدناه وأضفه في إعدادات توقيع بريدك الإلكتروني</p>
        <pre style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", fontFamily: "monospace", fontSize: ".68rem", color: "#4ADE80", overflowX: "auto", lineHeight: 1.65, border: "1px solid #1E1E2E", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{emailSig}</pre>
        <button className="outline-btn" style={{ marginTop: ".75rem", fontSize: ".75rem" }} onClick={() => navigator.clipboard?.writeText(emailSig)}>📋 نسخ توقيع الإيميل</button>
      </div>
    </div>
  );
}

/* ── LAUNCH PLAN TAB ── */
function LaunchPlanTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/launchPlan`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.launchPlan); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">خطة الإطلاق</div>{msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}<PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد خطة الإطلاق" /></div>;

  const priorityColor = (p: string) => p?.includes("عالي") ? "#F87171" : p?.includes("متوسط") ? "#FBBF24" : "#4ADE80";

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}

      {data.overview && (
        <div className="card">
          <div className="clabel">نظرة عامة على خطة الإطلاق</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1rem" }}>
            {[["المدة الإجمالية", data.overview.totalDuration], ["الميزانية المقترحة", data.overview.budget]].filter(([, v]) => v).map(([label, val]) => (
              <div key={label} style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E" }}>
                <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".375rem" }}>{label}</div>
                <div style={{ fontSize: ".88rem", fontWeight: 700, color: primary }}>{val}</div>
              </div>
            ))}
          </div>
          {data.overview.mainGoal && <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginBottom: ".75rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".375rem" }}>الهدف الرئيسي</div><div style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.6 }}>{data.overview.mainGoal}</div></div>}
          {data.overview.successMetrics?.length > 0 && <div><div style={{ fontSize: ".7rem", color: "#8A8498", marginBottom: ".5rem", fontWeight: 700 }}>مقاييس النجاح:</div><div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>{data.overview.successMetrics.map((m: string, i: number) => <span key={i} style={{ padding: ".25rem .65rem", borderRadius: 6, background: `${primary}15`, color: primary, border: `1px solid ${primary}33`, fontSize: ".72rem" }}>{m}</span>)}</div></div>}
        </div>
      )}

      {data.phases?.map((phase: any, pi: number) => (
        <div key={pi} className="card">
          <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".85rem", fontWeight: 900, color: "#08080F", flexShrink: 0 }}>{phase.phase}</div>
            <div><div style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>{phase.name}</div><div style={{ fontSize: ".72rem", color: "#8A8498" }}>{phase.duration}</div></div>
            {phase.budget && <span style={{ marginRight: "auto", padding: ".2rem .6rem", borderRadius: 6, fontSize: ".68rem", background: `${primary}15`, color: primary, border: `1px solid ${primary}33` }}>{phase.budget}</span>}
          </div>
          {phase.goal && <div style={{ background: "#0A0A14", borderRadius: 8, padding: ".75rem", marginBottom: ".75rem", border: "1px solid #1E1E2E" }}><div style={{ fontSize: ".6rem", color: primary, fontWeight: 700, marginBottom: ".25rem" }}>الهدف</div><div style={{ fontSize: ".82rem", color: "#C4BDB5" }}>{phase.goal}</div></div>}
          {phase.tasks?.length > 0 && (
            <div style={{ marginBottom: ".75rem" }}>
              <div style={{ fontSize: ".65rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem" }}>المهام:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                {phase.tasks.map((t: any, i: number) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: ".5rem", alignItems: "center", padding: ".625rem", background: "#0A0A14", borderRadius: 8, border: "1px solid #1E1E2E" }}>
                    <span style={{ fontSize: ".8rem", color: "#C4BDB5" }}>{t.task || t}</span>
                    {t.owner && <span style={{ fontSize: ".65rem", color: "#8A8498", background: "#1E1E2E", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{t.owner}</span>}
                    {t.priority && <span style={{ fontSize: ".62rem", color: priorityColor(t.priority), background: priorityColor(t.priority) + "15", padding: ".15rem .4rem", borderRadius: 4, whiteSpace: "nowrap" }}>{t.priority}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {phase.deliverables?.length > 0 && <div><div style={{ fontSize: ".65rem", color: "#8A8498", fontWeight: 700, marginBottom: ".4rem" }}>المخرجات:</div><div style={{ display: "flex", flexWrap: "wrap", gap: ".375rem" }}>{phase.deliverables.map((d: string, i: number) => <span key={i} style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".72rem", background: "#4ADE8015", color: "#4ADE80", border: "1px solid #4ADE8033" }}>✓ {d}</span>)}</div></div>}
        </div>
      ))}

      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}

/* ── SWOT TAB ── */
function SwotTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/swot`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.swot); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">تحليل SWOT والمخاطر</div>{msg && <div style={{ background: "#F8717111", border: "1px solid #F8717133", borderRadius: 8, padding: ".6rem", marginBottom: "1rem", fontSize: ".8rem", color: "#F87171", textAlign: "center" }}>{msg}</div>}<PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد تحليل SWOT" /></div>;

  const swot = data.swot ?? data;
  const quadrants = [
    { key: "strengths", label: "نقاط القوة", color: "#4ADE80", icon: "💪", itemKey: "point", subKey: "howToLeverage" },
    { key: "weaknesses", label: "نقاط الضعف", color: "#F87171", icon: "⚠️", itemKey: "point", subKey: "howToAddress" },
    { key: "opportunities", label: "الفرص", color: "#60A5FA", icon: "🚀", itemKey: "point", subKey: "howToCapture" },
    { key: "threats", label: "التهديدات", color: "#FBBF24", icon: "🛡️", itemKey: "point", subKey: "mitigation" },
  ];

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: "1rem" }}>
        {quadrants.map(({ key, label, color, icon, itemKey, subKey }) => {
          const items = swot?.[key] ?? [];
          return (
            <div key={key} style={{ background: "#0A0A14", border: `1px solid ${color}33`, borderRadius: 14, padding: "1rem", borderTop: `3px solid ${color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".375rem", marginBottom: ".75rem" }}>
                <span>{icon}</span>
                <span style={{ fontSize: ".82rem", fontWeight: 700, color }}>{label}</span>
                <span style={{ marginRight: "auto", fontSize: ".65rem", color: "#3A3650", background: "#1E1E2E", padding: ".1rem .4rem", borderRadius: 4 }}>{items.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                {items.length === 0 ? <p style={{ fontSize: ".75rem", color: "#3A3650" }}>—</p> : items.map((item: any, i: number) => (
                  <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid #1E1E2E" : "none", paddingBottom: i < items.length - 1 ? ".5rem" : 0 }}>
                    <p style={{ fontSize: ".78rem", color: "#C4BDB5", lineHeight: 1.55, marginBottom: ".25rem" }}>{typeof item === "string" ? item : (item[itemKey] ?? item.point ?? "")}</p>
                    {item[subKey] && <p style={{ fontSize: ".7rem", color: color, opacity: 0.8 }}>→ {item[subKey]}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(data.verdict || data.founderAdvice) && (
        <div className="card">
          {data.verdict && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem", padding: "1rem", background: data.verdict.goOrNoGo === "go" ? "#4ADE8011" : data.verdict.goOrNoGo === "no-go" ? "#F8717111" : "#FBBF2411", borderRadius: 12, border: `1px solid ${data.verdict.goOrNoGo === "go" ? "#4ADE8033" : data.verdict.goOrNoGo === "no-go" ? "#F8717133" : "#FBBF2433"}` }}>
              <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontSize: "2rem" }}>{data.verdict.goOrNoGo === "go" ? "✅" : data.verdict.goOrNoGo === "no-go" ? "❌" : "⚠️"}</div>
              </div>
              <div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: data.verdict.goOrNoGo === "go" ? "#4ADE80" : data.verdict.goOrNoGo === "no-go" ? "#F87171" : "#FBBF24", marginBottom: ".25rem" }}>
                  {data.verdict.goOrNoGo === "go" ? "انطلق! 🚀" : data.verdict.goOrNoGo === "no-go" ? "توقف وأعد التقييم" : "تابع بحذر"}
                </div>
                <div style={{ fontSize: ".78rem", color: "#C4BDB5" }}>{data.verdict.mainReason}</div>
              </div>
            </div>
          )}
          {data.founderAdvice && <><div className="clabel">نصيحة صريحة لصاحب المشروع</div><p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8 }}>{data.founderAdvice}</p></>}
        </div>
      )}

      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}

/* ── OBJECTIONS TAB ── */
function ObjectionsTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/objections`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.objections); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">ردود الاعتراضات</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد ردود الاعتراضات" /></div>;

  const catColor: Record<string, string> = { السعر: "#F87171", المنافسة: "#60A5FA", التردد: "#FBBF24", الشك: "#A78BFA", التوقيت: "#4ADE80" };

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {data.salesVoice && <div className="card" style={{ borderColor: `${primary}33` }}><div style={{ fontSize: ".65rem", color: primary, fontWeight: 700, marginBottom: ".375rem" }}>🎤 نبرة المبيعات</div><p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.7 }}>{data.salesVoice}</p></div>}

      {data.objections?.map((obj: any, i: number) => {
        const cc = catColor[obj.category] || primary;
        const isOpen = openIdx === i;
        return (
          <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setOpenIdx(isOpen ? null : i)}>
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
              <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".62rem", background: cc + "22", color: cc, border: `1px solid ${cc}44`, flexShrink: 0 }}>{obj.category}</span>
              <span style={{ fontSize: ".88rem", fontWeight: 700, color: "#F0EDE6", flex: 1 }}>"{obj.objection}"</span>
              <span style={{ color: "#8A8498", fontSize: ".9rem" }}>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop: "1rem" }} onClick={(e) => e.stopPropagation()}>
                {obj.response && <div style={{ background: `${primary}08`, borderRadius: 10, padding: "1rem", border: `1px solid ${primary}22`, marginBottom: ".625rem" }}><div style={{ fontSize: ".65rem", color: primary, fontWeight: 700, marginBottom: ".5rem" }}>💬 الرد المقترح</div><p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.75, margin: 0 }}>{obj.response}</p></div>}
                {obj.closingLine && <div style={{ background: "#08080F", borderRadius: 8, padding: ".75rem" }}><div style={{ fontSize: ".6rem", color: "#4ADE80", fontWeight: 700, marginBottom: ".25rem" }}>🎯 الجملة الختامية</div><p style={{ fontSize: ".8rem", color: "#4ADE80", margin: 0, fontWeight: 600 }}>"{obj.closingLine}"</p></div>}
              </div>
            )}
          </div>
        );
      })}

      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}

/* ── BUYER PERSONA TAB ── */
function BuyerPersonaTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/generate/buyer-persona`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل"); }
      else { onGenerated(json.buyerPersona); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data) return <div className="card"><div className="clabel">العميل المثالي — Buyer Persona</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد العميل المثالي" /></div>;

  const PersonaCard = ({ p, isPrimary }: { p: any; isPrimary: boolean }) => (
    <div style={{ background: isPrimary ? `${primary}08` : "#0A0A14", border: `1px solid ${isPrimary ? primary + "33" : "#1E1E2E"}`, borderRadius: 16, padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".875rem", marginBottom: "1rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: isPrimary ? primary : "#1E1E2E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", flexShrink: 0 }}>{p.emoji || "👤"}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "#F0EDE6" }}>{p.name}</span>
            {isPrimary && <span style={{ padding: ".15rem .5rem", borderRadius: 5, fontSize: ".6rem", background: primary, color: "#08080F", fontWeight: 700 }}>الشريحة الأساسية</span>}
          </div>
          <div style={{ fontSize: ".78rem", color: "#8A8498", marginTop: ".2rem" }}>{p.age} · {p.gender} · {p.location}</div>
          <div style={{ fontSize: ".75rem", color: primary }}>{p.job} · {p.income}</div>
        </div>
      </div>
      {p.bio && <p style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.7, marginBottom: ".875rem", fontStyle: "italic", borderRight: `2px solid ${primary}`, paddingRight: ".75rem" }}>"{p.bio}"</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
        {p.goals?.length > 0 && <div><div style={{ fontSize: ".6rem", fontWeight: 700, color: "#4ADE80", marginBottom: ".375rem" }}>🎯 الأهداف</div>{p.goals.map((g: string, i: number) => <div key={i} style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".2rem" }}>• {g}</div>)}</div>}
        {p.pains?.length > 0 && <div><div style={{ fontSize: ".6rem", fontWeight: 700, color: "#F87171", marginBottom: ".375rem" }}>😤 المشاكل</div>{p.pains.map((g: string, i: number) => <div key={i} style={{ fontSize: ".75rem", color: "#8A8498", marginBottom: ".2rem" }}>• {g}</div>)}</div>}
      </div>
      {p.quote && <div style={{ marginTop: ".75rem", padding: ".625rem .875rem", borderRight: `3px solid ${primary}`, background: `${primary}08` }}><p style={{ fontSize: ".8rem", color: "#C4BDB5", fontStyle: "italic", margin: 0 }}>"{p.quote}"</p></div>}
    </div>
  );

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {data.primary && <PersonaCard p={data.primary} isPrimary={true} />}
      {data.secondary?.name && <PersonaCard p={data.secondary} isPrimary={false} />}
      {data.insights?.length > 0 && (
        <div className="card">
          <div className="clabel">رؤى تسويقية مهمة</div>
          {data.insights.map((ins: string, i: number) => (
            <div key={i} style={{ display: "flex", gap: ".5rem", padding: ".5rem 0", borderBottom: i < data.insights.length - 1 ? "1px solid #1E1E2E" : "none" }}>
              <span style={{ color: primary }}>💡</span>
              <span style={{ fontSize: ".82rem", color: "#C4BDB5", lineHeight: 1.6 }}>{ins}</span>
            </div>
          ))}
        </div>
      )}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
      </button>
    </div>
  );
}

/* ── AD SCRIPTS TAB ── */
function AdScriptsTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openScript, setOpenScript] = useState(0);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/generate/ad-scripts`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل"); }
      else { onGenerated(json.adScripts); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ"); }
    finally { setLoading(false); }
  };

  if (!data) return <div className="card"><div className="clabel">سكريبتات إعلانات الفيديو</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد سكريبتات الإعلانات" /></div>;

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {data.scripts?.map((s: any, i: number) => (
        <div key={i} className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpenScript(openScript === i ? -1 : i)}>
            <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
              <span style={{ fontSize: "1.1rem" }}>🎬</span>
              <div><div style={{ fontSize: ".85rem", fontWeight: 700, color: "#F0EDE6" }}>{s.platform}</div><div style={{ fontSize: ".68rem", color: "#8A8498" }}>{s.duration} · {s.type}</div></div>
            </div>
            <span style={{ color: "#8A8498", fontSize: ".9rem" }}>{openScript === i ? "▲" : "▼"}</span>
          </div>
          {openScript === i && (
            <div style={{ marginTop: "1rem" }}>
              {[["⚡ الجملة الافتتاحية", s.hook, "#C9973A"], ["😤 المشكلة", s.problem, "#F87171"], ["✨ الحل", s.solution, "#4ADE80"], ["📢 نداء الإجراء", s.cta, primary]].map(([label, val, color]) =>
                val ? <div key={label} style={{ background: "#08080F", borderRadius: 8, padding: ".75rem", marginBottom: ".5rem", borderRight: `3px solid ${color}` }}><div style={{ fontSize: ".6rem", color: color as string, fontWeight: 700, marginBottom: ".25rem" }}>{label}</div><p style={{ fontSize: ".82rem", color: "#C4BDB5", margin: 0, lineHeight: 1.65 }}>{val}</p></div> : null
              )}
              {s.voiceover && <div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: "1px solid #1E1E2E", marginTop: ".75rem" }}><div style={{ fontSize: ".6rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem" }}>📝 النص الكامل</div><p style={{ fontSize: ".85rem", color: "#C4BDB5", lineHeight: 1.8, margin: 0 }}>{s.voiceover}</p></div>}
            </div>
          )}
        </div>
      ))}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
      </button>
    </div>
  );
}

/* ── EMAIL CAMPAIGN TAB ── */
function EmailCampaignTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openEmail, setOpenEmail] = useState(0);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/generate/email-campaign`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل"); }
      else { onGenerated(json.emailCampaign); setMsg(`✓ تم! رصيدك: ${json.creditsLeft}`); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ"); }
    finally { setLoading(false); }
  };

  if (!data) return <div className="card"><div className="clabel">حملة البريد الإلكتروني</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد حملة الإيميل" /></div>;

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      <div style={{ display: "flex", gap: ".375rem", marginBottom: "1rem" }}>
        {data.sequence?.map((_: any, i: number) => (
          <button key={i} onClick={() => setOpenEmail(i)} style={{ padding: ".4rem .9rem", borderRadius: 20, border: `1.5px solid ${openEmail === i ? primary : "#1E1E2E"}`, background: openEmail === i ? primary : "transparent", color: openEmail === i ? "#08080F" : "#8A8498", fontFamily: "Tajawal,sans-serif", fontSize: ".78rem", fontWeight: openEmail === i ? 700 : 400, cursor: "pointer" }}>إيميل {i + 1}</button>
        ))}
      </div>
      {data.sequence?.map((email: any, i: number) => openEmail === i && (
        <div key={i} className="card">
          <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".65rem", background: `${primary}15`, color: primary, border: `1px solid ${primary}33` }}>{email.trigger}</span>
            <span style={{ padding: ".2rem .6rem", borderRadius: 5, fontSize: ".65rem", background: "#1E1E2E", color: "#8A8498" }}>{email.delay}</span>
          </div>
          <div style={{ background: "#0A0A14", borderRadius: 12, padding: "1rem", border: "1px solid #1E1E2E", marginBottom: ".75rem" }}>
            <div style={{ fontSize: ".6rem", color: "#8A8498", marginBottom: ".25rem" }}>سطر الموضوع</div>
            <div style={{ fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>{email.subject}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "1.5rem", direction: "rtl" }}>
            <p style={{ fontSize: ".88rem", color: "#1A1A28", marginBottom: ".75rem" }}>{email.body?.greeting}</p>
            <p style={{ fontSize: ".9rem", fontWeight: 700, color: "#1A1A28", marginBottom: ".75rem" }}>{email.body?.opening}</p>
            <p style={{ fontSize: ".85rem", color: "#3A3650", lineHeight: 1.8, marginBottom: "1rem" }}>{email.body?.mainContent}</p>
            <div style={{ textAlign: "center", margin: "1.25rem 0" }}><span style={{ display: "inline-block", padding: ".75rem 2rem", background: primary, color: "#08080F", borderRadius: 10, fontWeight: 700, fontSize: ".9rem" }}>{email.body?.cta}</span></div>
          </div>
        </div>
      ))}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد (1 كريديت)
      </button>
    </div>
  );
}

/* ── BUSINESS OVERVIEW TAB ── */
function BusinessOverviewTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/businessOverview`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.businessOverview); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">شرح البيزنس الاحترافي</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد شرح البيزنس" /></div>;

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {data.elevator_pitch && <div className="card" style={{ borderColor: `${primary}44`, background: `linear-gradient(135deg, ${primary}08, #0E0E1A)` }}><div style={{ fontSize: ".65rem", color: primary, fontWeight: 700, marginBottom: ".5rem", letterSpacing: 1 }}>🎤 ELEVATOR PITCH — 30 ثانية</div><p style={{ fontSize: "1rem", color: "#F0EDE6", lineHeight: 1.8, fontWeight: 500 }}>{data.elevator_pitch}</p></div>}
      {data.one_liner && <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}><div style={{ fontSize: ".62rem", color: "#8A8498", fontWeight: 700, marginBottom: ".5rem", letterSpacing: 1 }}>جملة التعريف الوحيدة</div><p style={{ fontSize: "1.1rem", color: primary, fontWeight: 700, lineHeight: 1.7, fontStyle: "italic" }}>"{data.one_liner}"</p></div>}
      {data.what_we_do && <div className="card"><div className="clabel">ماذا نفعل بالضبط؟</div><div style={{ background: "#0A0A14", borderRadius: 10, padding: "1rem", border: `1px solid ${primary}22`, marginBottom: ".75rem" }}><p style={{ fontSize: ".95rem", fontWeight: 600, color: "#F0EDE6", lineHeight: 1.7, margin: 0 }}>{data.what_we_do.summary}</p></div></div>}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}

/* ── AGE PREFERENCES TAB ── */
function AgePreferencesTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openGroup, setOpenGroup] = useState<number | null>(0);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/agePreferences`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.agePreferences); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">تفضيلات الأجيال وتوصيات التسويق</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد تحليل الأجيال" /></div>;

  const groupColors = ["#C9973A", "#60A5FA", "#4ADE80", "#A78BFA", "#F87171"];

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {data.ageGroups?.map((group: any, i: number) => {
        const gc = groupColors[i % groupColors.length];
        const isOpen = openGroup === i;
        return (
          <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setOpenGroup(isOpen ? null : i)}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${gc}18`, border: `2px solid ${gc}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: ".75rem", fontWeight: 900, color: gc }}>{group.range}</span>
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: ".9rem", fontWeight: 700, color: "#F0EDE6" }}>{group.label}</span>
                <div style={{ fontSize: ".68rem", color: "#8A8498", marginTop: ".2rem" }}>{group.generationName} · {group.marketSize}</div>
              </div>
              <span style={{ color: "#8A8498", fontSize: ".9rem" }}>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop: "1rem" }} onClick={(e) => e.stopPropagation()}>
                {group.recommendations?.length > 0 && group.recommendations.map((rec: any, j: number) => (
                  <div key={j} style={{ background: `${gc}08`, borderRadius: 10, padding: ".875rem", border: `1px solid ${gc}22`, marginBottom: ".5rem" }}>
                    <div style={{ fontSize: ".82rem", fontWeight: 700, color: gc, marginBottom: ".25rem" }}>→ {rec.action}</div>
                    {rec.why && <p style={{ fontSize: ".75rem", color: "#8A8498", lineHeight: 1.5, margin: 0 }}>{rec.why}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}

/* ── FAQ TAB ── */
function FaqTab({ data, projectId, primary, onGenerated }: { data: any; projectId: string; primary: string; onGenerated: (d: any) => void; }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [filterCat, setFilterCat] = useState("الكل");

  const generate = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/projects/${projectId}/regenerate/faq`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) { setMsg(json.message || "فشل التوليد"); }
      else { onGenerated(json.faq); setMsg("✓ تم إعادة التوليد"); setTimeout(() => setMsg(""), 3000); }
    } catch { setMsg("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  if (!data || Object.keys(data).length === 0)
    return <div className="card"><div className="clabel">الأسئلة الشائعة</div><PaidGenerateBtn onGenerate={generate} loading={loading} label="توليد الأسئلة الشائعة" /></div>;

  const faqs: any[] = data.faqs ?? [];
  const categories: string[] = ["الكل", ...(data.categories ?? Array.from(new Set(faqs.map((f: any) => f.category).filter(Boolean))))];
  const filtered = filterCat === "الكل" ? faqs : faqs.filter((f: any) => f.category === filterCat);

  return (
    <div className="fade-up">
      {msg && <div style={{ background: "#4ADE8011", border: "1px solid #4ADE8033", borderRadius: 8, padding: ".6rem", marginBottom: ".75rem", fontSize: ".8rem", color: "#4ADE80", textAlign: "center" }}>{msg}</div>}
      {categories.length > 1 && (
        <div style={{ display: "flex", gap: ".35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {categories.map((cat: string) => (
            <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: ".3rem .7rem", borderRadius: 16, border: `1px solid ${filterCat === cat ? primary : "#1E1E2E"}`, background: filterCat === cat ? `${primary}22` : "transparent", color: filterCat === cat ? primary : "#8A8498", fontSize: ".72rem", cursor: "pointer" }}>{cat}</button>
          ))}
        </div>
      )}
      {filtered.map((faq: any, i: number) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} className="card" style={{ cursor: "pointer" }} onClick={() => setOpenIdx(isOpen ? null : i)}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: ".625rem" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${primary}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".72rem", fontWeight: 900, color: primary, flexShrink: 0 }}>{faq.id || i + 1}</div>
              <p style={{ fontSize: ".88rem", fontWeight: 600, color: "#F0EDE6", margin: 0, lineHeight: 1.5, flex: 1 }}>{faq.question}</p>
              <span style={{ color: "#8A8498", fontSize: ".85rem", flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
            </div>
            {isOpen && (
              <div style={{ marginTop: "1rem" }} onClick={(e) => e.stopPropagation()}>
                {faq.fullAnswer && <div style={{ background: `${primary}08`, borderRadius: 10, padding: "1rem", border: `1px solid ${primary}22` }}><p style={{ fontSize: ".88rem", color: "#C4BDB5", lineHeight: 1.8, margin: 0 }}>{faq.fullAnswer}</p></div>}
              </div>
            )}
          </div>
        );
      })}
      {filtered.length === 0 && <div className="card" style={{ textAlign: "center", padding: "2rem" }}><p style={{ color: "#3A3650", fontSize: ".82rem" }}>لا توجد أسئلة في هذه الفئة</p></div>}
      <button onClick={generate} disabled={loading} style={{ width: "100%", padding: ".625rem", borderRadius: 10, background: "transparent", border: `1px solid ${primary}33`, color: primary, fontSize: ".8rem", cursor: "pointer", marginTop: ".5rem", fontFamily: "Tajawal,sans-serif" }}>
        {loading ? "⏳" : "🔄"} إعادة التوليد
      </button>
    </div>
  );
}
