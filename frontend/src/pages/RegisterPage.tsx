import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return setErr("يرجاء ملء جميع الحقول");
    if (password.length < 8) return setErr("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    setLoading(true); setErr("");
    try {
      const res  = await fetch("/api/auth/register", {
        method:"POST", credentials:"include",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || "خطأ في إنشاء الحساب");
      navigate("/dashboard");
    } catch {
      setErr("خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", padding:".875rem 1rem",
    background:"#08080F", border:"1.5px solid #1E1E2E",
    borderRadius:10, color:"#F0EDE6",
    fontFamily:"Tajawal,sans-serif", fontSize:".9rem",
    outline:"none", transition:"border .2s",
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      padding:"1.5rem", position:"relative", overflow:"hidden",
    }}>
      {/* bg */}
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:500, height:400, background:"radial-gradient(ellipse,#C9973A09,transparent 70%)" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(#1E1E2E22 1px,transparent 1px),linear-gradient(90deg,#1E1E2E22 1px,transparent 1px)", backgroundSize:"48px 48px" }}/>
      </div>

      <div className="fade-up" style={{ width:"100%", maxWidth:420, position:"relative", zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"2rem" }}>
          <Link to="/" style={{ textDecoration:"none", display:"inline-flex", alignItems:"center", gap:".5rem" }}>
            <div style={{ width:40, height:40, borderRadius:11, background:"linear-gradient(135deg,#1A1A28,#252535)", border:"1px solid #C9973A44", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Sora,sans-serif", fontSize:"1.1rem", fontWeight:700, color:"#C9973A" }}>ع</div>
            <span style={{ fontFamily:"Sora,sans-serif", fontSize:"1rem", fontWeight:700, color:"#F0EDE6" }}>ArabBrand <span style={{color:"#C9973A"}}>Studio</span></span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background:"#0E0E1A", border:"1px solid #1E1E2E", borderRadius:22, padding:"2.25rem", boxShadow:"0 24px 80px rgba(0,0,0,.4)" }}>
          <h1 style={{ fontFamily:"Sora,sans-serif", fontSize:"1.5rem", fontWeight:700, color:"#F0EDE6", marginBottom:".375rem" }}>أنشئ حسابك</h1>
          <p style={{ fontSize:".82rem", color:"#8A8498", marginBottom:"1.75rem" }}>ابدأ رحلتك في بناء براندك العربي</p>

          {/* Google */}
          <a href="/api/auth/google" style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:".75rem",
            padding:".875rem", borderRadius:12, border:"1.5px solid #1E1E2E",
            background:"transparent", color:"#C4BDB5",
            fontSize:".875rem", fontFamily:"Tajawal,sans-serif", fontWeight:600,
            textDecoration:"none", transition:"all .2s", marginBottom:"1.25rem",
          }}
          onMouseEnter={e=>{ const el=e.currentTarget; el.style.borderColor="#C9973A33"; el.style.background="#13131E"; }}
          onMouseLeave={e=>{ const el=e.currentTarget; el.style.borderColor="#1E1E2E"; el.style.background="transparent"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            التسجيل بـ Google
          </a>

          {/* divider */}
          <div style={{ display:"flex", alignItems:"center", gap:".75rem", marginBottom:"1.25rem" }}>
            <div style={{ flex:1, height:1, background:"#1E1E2E" }}/>
            <span style={{ fontSize:".72rem", color:"#3A3650" }}>أو بالإيميل</span>
            <div style={{ flex:1, height:1, background:"#1E1E2E" }}/>
          </div>

          <form onSubmit={handleSubmit}>
            {[
              { label:"الاسم الكامل", type:"text",     val:fullName, set:setFullName, ph:"محمد أحمد" },
              { label:"البريد الإلكتروني", type:"email", val:email,    set:setEmail,    ph:"you@example.com", ltr:true },
              { label:"كلمة المرور",   type:"password", val:password, set:setPassword, ph:"8 أحرف على الأقل" },
            ].map(({ label, type, val, set, ph, ltr }) => (
              <div key={label} style={{ marginBottom:"1rem" }}>
                <label style={{ display:"block", fontSize:".75rem", fontWeight:700, color:"#6B6478", letterSpacing:"1px", textTransform:"uppercase", marginBottom:".5rem" }}>{label}</label>
                <input
                  type={type} value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={ph}
                  style={{ ...inputStyle, direction: ltr ? "ltr" : "rtl", textAlign: ltr ? "right" : "right" }}
                  onFocus={e=>e.target.style.borderColor="#C9973A44"}
                  onBlur={e=>e.target.style.borderColor="#1E1E2E"}
                />
              </div>
            ))}

            {err && (
              <div style={{ background:"#F8717115", border:"1px solid #F8717133", borderRadius:10, color:"#F87171", fontSize:".82rem", padding:".75rem 1rem", marginBottom:"1rem", textAlign:"center" }}>{err}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"1rem", marginTop:".25rem",
              background: loading ? "#8A6A28" : "#C9973A",
              color:"#08080F", border:"none", borderRadius:12,
              fontFamily:"Tajawal,sans-serif", fontWeight:700, fontSize:"1rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow:"0 6px 24px #C9973A28", transition:"all .2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:".5rem",
            }}>
              {loading ? (
                <>
                  <div style={{ width:16, height:16, border:"2px solid #08080F44", borderTop:"2px solid #08080F", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
                  جاري إنشاء الحساب...
                </>
              ) : "إنشاء الحساب ✦"}
            </button>

            <p style={{ fontSize:".72rem", color:"#3A3650", textAlign:"center", marginTop:".875rem", lineHeight:1.6 }}>
              بالتسجيل أنت توافق على{" "}
              <a href="#" style={{ color:"#C9973A44", textDecoration:"none" }}>شروط الاستخدام</a>
              {" "}و{" "}
              <a href="#" style={{ color:"#C9973A44", textDecoration:"none" }}>سياسة الخصوصية</a>
            </p>
          </form>

          <p style={{ textAlign:"center", fontSize:".82rem", color:"#3A3650", marginTop:"1.25rem" }}>
            عندك حساب بالفعل؟{" "}
            <Link to="/login" style={{ color:"#C9973A", textDecoration:"none", fontWeight:700 }}>سجّل الدخول</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
