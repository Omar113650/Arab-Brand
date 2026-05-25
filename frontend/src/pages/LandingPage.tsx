import { Link } from "react-router-dom";

const FEATURES = [
  { emoji:"🏷️", title:"لوجو SVG احترافي",   desc:"لوجو مخصص قابل للتعديل والتكبير بدون فقدان جودة" },
  { emoji:"🎨", title:"هوية بصرية كاملة",   desc:"لوحة ألوان وخطوط واستراتيجية بصرية متكاملة" },
  { emoji:"📱", title:"محتوى سوشيال ميديا", desc:"منشورات Instagram و TikTok و Twitter جاهزة للنشر" },
  { emoji:"🌐", title:"Landing Page",        desc:"صفحة هبوط HTML كاملة جاهزة للرفع فوراً" },
  { emoji:"📄", title:"بوشير احترافي",       desc:"بروشور البراند جاهز للطباعة والمشاركة" },
  { emoji:"📊", title:"Brand Score",         desc:"تقييم شامل لقوة البراند في السوق العربي" },
];

const STEPS = [
  { n:"01", title:"أدخل فكرتك",      desc:"صف مشروعك أو براندك بكلماتك العادية" },
  { n:"02", title:"اختر أسلوبك",     desc:"اختر الألوان والأسلوب البصري المناسب" },
  { n:"03", title:"الـ AI يعمل",     desc:"Claude AI يولّد هويتك الكاملة خلال دقيقة" },
  { n:"04", title:"حمّل وابدأ",      desc:"حمّل كل ملفاتك وابدأ براندك فوراً" },
];

const PLANS = [
  {
    name: "مجاني", price: "0", period: "دائماً",
    color: "#1E1E2E",
    features: ["3 براندات شهرياً","لوجو SVG","هوية بصرية","Brand Score"],
    missing: ["محتوى سوشيال","Landing Page","بوشير","Export ZIP"],
    cta: "ابدأ مجاناً",
  },
  {
    name: "Pro", price: "29", period: "شهرياً",
    color: "#C9973A",
    badge: "الأشهر",
    features: ["براندات غير محدودة","لوجو SVG","هوية بصرية","Brand Score","محتوى سوشيال","Landing Page","بوشير احترافي","Export ZIP"],
    missing: [],
    cta: "جرّب Pro",
  },
];

export default function LandingPage() {
  return (
    <div style={{ paddingTop: 64 }}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "4rem 1.5rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* bg glows */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          <div style={{ position:"absolute", top:"-20%", left:"50%", transform:"translateX(-50%)", width:700, height:500, background:"radial-gradient(ellipse,#C9973A0D,transparent 70%)" }}/>
          <div style={{ position:"absolute", bottom:0, right:"10%", width:300, height:300, background:"radial-gradient(circle,#7C3AED08,transparent 70%)" }}/>
          {/* grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(#1E1E2E33 1px,transparent 1px),linear-gradient(90deg,#1E1E2E33 1px,transparent 1px)", backgroundSize:"48px 48px", opacity:.4 }}/>
        </div>

        <div style={{ maxWidth:620, position:"relative", zIndex:1 }}>
          {/* badge */}
          <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:".5rem", padding:".375rem 1rem", borderRadius:20, border:"1px solid #C9973A33", background:"#C9973A0D", marginBottom:"1.75rem" }}>
            <span style={{ fontSize:".72rem", color:"#C9973A", fontWeight:700, letterSpacing:"1.5px", textTransform:"uppercase" }}>مدعوم بـ Gemini AI</span>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#C9973A", animation:"glow 1.5s ease infinite" }}/>
          </div>

          <h1 className="fade-up fade-up-1" style={{
            fontFamily:"Sora,sans-serif",
            fontSize:"clamp(2.25rem,6vw,3.75rem)",
            fontWeight:800, lineHeight:1.1,
            letterSpacing:"-2px",
            color:"#F0EDE6",
            marginBottom:"1.25rem",
          }}>
            براندك الاحترافي<br/>
            <span style={{ color:"#C9973A" }}>في دقيقة واحدة</span>
          </h1>

          <p className="fade-up fade-up-2" style={{ fontSize:"1.05rem", color:"#8A8498", lineHeight:1.85, marginBottom:"2.5rem", maxWidth:480, margin:"0 auto 2.5rem" }}>
            من فكرة في دماغك إلى براند كامل بلوجو وهوية ومحتوى وصفحة هبوط — كل ده بالذكاء الاصطناعي خصيصاً للسوق العربي
          </p>

          <div className="fade-up fade-up-3" style={{ display:"flex", gap:".75rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"3rem" }}>
            <Link to="/register" style={{
              padding:"1rem 2.25rem", borderRadius:14,
              background:"#C9973A", color:"#08080F",
              fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1.05rem",
              textDecoration:"none", boxShadow:"0 8px 32px #C9973A30",
              transition:"all .2s", display:"inline-block",
            }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.transform="translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 12px 40px #C9973A40"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 32px #C9973A30"; }}
            >ابدأ مجاناً ✦</Link>

            <a href="#how" style={{
              padding:"1rem 2.25rem", borderRadius:14,
              border:"1.5px solid #1E1E2E", background:"transparent",
              color:"#8A8498", fontFamily:"Tajawal,sans-serif",
              fontWeight:600, fontSize:"1rem",
              textDecoration:"none", transition:"all .2s", display:"inline-block",
            }}
            onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.borderColor="#C9973A44"; (e.currentTarget as HTMLElement).style.color="#C9973A"; }}
            onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.borderColor="#1E1E2E"; (e.currentTarget as HTMLElement).style.color="#8A8498"; }}
            >كيف يعمل؟</a>
          </div>

          {/* stats */}
          <div className="fade-up fade-up-4" style={{ display:"flex", gap:"2rem", justifyContent:"center", flexWrap:"wrap" }}>
            {[["500+","براند اتولّد"],["4","مخرجات بالـ AI"],["دقيقة","وقت التوليد"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Sora,sans-serif", fontSize:"1.75rem", fontWeight:800, color:"#C9973A" }}>{n}</div>
                <div style={{ fontSize:".75rem", color:"#3A3650", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:"5rem 1.5rem", maxWidth:900, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={{ fontSize:".72rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:"#C9973A", marginBottom:".75rem" }}>المميزات</p>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, color:"#F0EDE6", letterSpacing:"-1px" }}>كل اللي براندك محتاجه</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1rem" }}>
          {FEATURES.map((f,i)=>(
            <div key={i} style={{
              background:"#0E0E1A", border:"1px solid #1E1E2E", borderRadius:18,
              padding:"1.5rem", transition:"all .25s", cursor:"default",
            }}
            onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="#C9973A33"; el.style.transform="translateY(-3px)"; el.style.boxShadow="0 12px 40px #C9973A0A"; }}
            onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="#1E1E2E"; el.style.transform="translateY(0)"; el.style.boxShadow="none"; }}
            >
              <div style={{ fontSize:"1.75rem", marginBottom:".875rem" }}>{f.emoji}</div>
              <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#F0EDE6", marginBottom:".5rem" }}>{f.title}</h3>
              <p style={{ fontSize:".82rem", color:"#8A8498", lineHeight:1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding:"5rem 1.5rem", maxWidth:700, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={{ fontSize:".72rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:"#C9973A", marginBottom:".75rem" }}>كيف يعمل</p>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, color:"#F0EDE6", letterSpacing:"-1px" }}>4 خطوات بس</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"1px" }}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:"1.25rem", alignItems:"flex-start", padding:"1.5rem", background:"#0E0E1A", border:"1px solid #1E1E2E", borderRadius:16, marginBottom:".625rem", transition:"all .25s" }}
            onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="#C9973A33"; el.style.background="#13131E"; }}
            onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="#1E1E2E"; el.style.background="#0E0E1A"; }}
            >
              <div style={{ fontFamily:"Sora,sans-serif", fontSize:"2rem", fontWeight:800, color:"#C9973A22", flexShrink:0, lineHeight:1, minWidth:52 }}>{s.n}</div>
              <div>
                <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#F0EDE6", marginBottom:".375rem" }}>{s.title}</h3>
                <p style={{ fontSize:".82rem", color:"#8A8498", lineHeight:1.65 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:"5rem 1.5rem", maxWidth:700, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <p style={{ fontSize:".72rem", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", color:"#C9973A", marginBottom:".75rem" }}>الأسعار</p>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(1.75rem,4vw,2.5rem)", fontWeight:700, color:"#F0EDE6", letterSpacing:"-1px" }}>بسيط وواضح</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1rem" }}>
          {PLANS.map((p,i)=>(
            <div key={i} style={{
              background: i===1 ? "linear-gradient(135deg,#1A1508,#1E1A0A)" : "#0E0E1A",
              border: `1.5px solid ${i===1?"#C9973A55":"#1E1E2E"}`,
              borderRadius:20, padding:"2rem", position:"relative",
              boxShadow: i===1 ? "0 20px 60px #C9973A18" : "none",
            }}>
              {p.badge && (
                <div style={{ position:"absolute", top:-12, right:20, padding:".25rem .875rem", borderRadius:20, background:"#C9973A", color:"#08080F", fontSize:".68rem", fontWeight:700, letterSpacing:"1px" }}>{p.badge}</div>
              )}
              <div style={{ marginBottom:"1.5rem" }}>
                <p style={{ fontSize:".8rem", color:"#8A8498", marginBottom:".5rem" }}>{p.name}</p>
                <div style={{ display:"flex", alignItems:"baseline", gap:".25rem" }}>
                  <span style={{ fontFamily:"Sora,sans-serif", fontSize:"2.75rem", fontWeight:800, color: i===1?"#C9973A":"#F0EDE6" }}>${p.price}</span>
                  <span style={{ fontSize:".8rem", color:"#3A3650" }}>/{p.period}</span>
                </div>
              </div>
              <div style={{ marginBottom:"1.75rem" }}>
                {p.features.map((f,j)=>(
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:".625rem", padding:".375rem 0", borderBottom:"1px solid #1E1E2E" }}>
                    <span style={{ color:"#4ADE80", fontSize:".85rem" }}>✓</span>
                    <span style={{ fontSize:".82rem", color:"#C4BDB5" }}>{f}</span>
                  </div>
                ))}
                {p.missing.map((f,j)=>(
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:".625rem", padding:".375rem 0", borderBottom:"1px solid #1E1E2E", opacity:.35 }}>
                    <span style={{ color:"#3A3650", fontSize:".85rem" }}>✗</span>
                    <span style={{ fontSize:".82rem", color:"#3A3650" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" style={{
                display:"block", textAlign:"center",
                padding:".875rem", borderRadius:12,
                background: i===1?"#C9973A":"transparent",
                border: i===1?"none":"1.5px solid #1E1E2E",
                color: i===1?"#08080F":"#8A8498",
                fontFamily:"Tajawal,sans-serif", fontWeight:700,
                fontSize:".9rem", textDecoration:"none",
                transition:"all .2s",
              }}
              onMouseEnter={e=>{ const el=e.currentTarget; el.style.opacity=".85"; el.style.transform="translateY(-1px)"; }}
              onMouseLeave={e=>{ const el=e.currentTarget; el.style.opacity="1"; el.style.transform="translateY(0)"; }}
              >{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"5rem 1.5rem", textAlign:"center", maxWidth:560, margin:"0 auto" }}>
        <div style={{ background:"linear-gradient(135deg,#0E0E1A,#13131E)", border:"1px solid #C9973A22", borderRadius:24, padding:"3rem 2rem" }}>
          <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>✦</div>
          <h2 style={{ fontFamily:"Sora,sans-serif", fontSize:"clamp(1.5rem,4vw,2rem)", fontWeight:700, color:"#F0EDE6", letterSpacing:"-1px", marginBottom:"1rem" }}>جاهز تبني براندك؟</h2>
          <p style={{ fontSize:".9rem", color:"#8A8498", lineHeight:1.8, marginBottom:"1.75rem" }}>انضم لمئات المشاريع العربية اللي بنت هويتها بـ ArabBrand Studio</p>
          <Link to="/register" style={{
            display:"inline-block", padding:"1rem 2.5rem", borderRadius:14,
            background:"#C9973A", color:"#08080F",
            fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1rem",
            textDecoration:"none", boxShadow:"0 8px 32px #C9973A30",
          }}>ابدأ مجاناً الآن ✦</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding:"2rem 1.5rem", borderTop:"1px solid #1E1E2E", textAlign:"center" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem", marginBottom:".75rem" }}>
          <div style={{ width:26, height:26, borderRadius:7, background:"linear-gradient(135deg,#1A1A28,#252535)", border:"1px solid #C9973A33", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Sora,sans-serif", fontSize:".8rem", fontWeight:700, color:"#C9973A" }}>ع</div>
          <span style={{ fontFamily:"Sora,sans-serif", fontSize:".85rem", fontWeight:700, color:"#F0EDE6" }}>ArabBrand Studio</span>
        </div>
        <p style={{ fontSize:".75rem", color:"#3A3650" }}>© {new Date().getFullYear()} — صُنع بـ ❤️ للسوق العربي</p>
      </footer>
    </div>
  );
}
