import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (location.pathname === "/dashboard") return null;

  return (
    <nav style={{
      position: "fixed", top: 0, right: 0, left: 0, zIndex: 100,
      padding: "0 1.5rem",
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(8,8,15,.92)" : "transparent",
      borderBottom: scrolled ? "1px solid #1E1E2E" : "1px solid transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "all .35s ease",
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: ".625rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "linear-gradient(135deg,#1A1A28,#252535)",
          border: "1px solid #C9973A44",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Sora,sans-serif", fontSize: "1rem", fontWeight: 700, color: "#C9973A",
        }}>ع</div>
        <span style={{ fontFamily: "Sora,sans-serif", fontSize: ".95rem", fontWeight: 700, color: "#F0EDE6" }}>
          ArabBrand <span style={{ color: "#C9973A" }}>Studio</span>
        </span>
      </Link>

      {/* Desktop Links */}
      {isLanding && (
        <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
          {[["#features","المميزات"],["#pricing","الأسعار"],["#how","كيف يعمل"]].map(([href,label]) => (
            <a key={href} href={href} style={{
              fontSize: ".85rem", color: "#8A8498", textDecoration: "none",
              transition: "color .2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#C9973A")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8A8498")}
            >{label}</a>
          ))}
        </div>
      )}

      {/* Auth Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: ".625rem" }}>
        <Link to="/login" style={{
          padding: ".45rem 1.1rem", borderRadius: 10,
          border: "1.5px solid #1E1E2E", background: "transparent",
          color: "#8A8498", fontSize: ".82rem", fontFamily: "Tajawal,sans-serif",
          fontWeight: 600, textDecoration: "none", transition: "all .2s",
          display: "inline-block",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C9973A44"; (e.currentTarget as HTMLElement).style.color = "#C9973A"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1E1E2E"; (e.currentTarget as HTMLElement).style.color = "#8A8498"; }}
        >تسجيل الدخول</Link>

        <Link to="/register" style={{
          padding: ".45rem 1.1rem", borderRadius: 10,
          background: "#C9973A", color: "#08080F",
          fontSize: ".82rem", fontFamily: "Tajawal,sans-serif",
          fontWeight: 700, textDecoration: "none",
          boxShadow: "0 4px 16px #C9973A28", transition: "all .2s",
          display: "inline-block",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#D4A84A"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#C9973A"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
        >ابدأ مجاناً</Link>
      </div>
    </nav>
  );
}
