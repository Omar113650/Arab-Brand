import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";


export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();
  const isLanding = location.pathname === "/";

  /* scroll state */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active section detection */
  useEffect(() => {
    if (!isLanding) return;
    const ids = [
      "features",
      "how",
      "clients",
      "news",
      "about",
      "contact",
      "pricing",
    ];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [isLanding]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname === "/dashboard") return null;

  const NAV_LINKS = [
    ["features", "#features", "المميزات"],
    ["how", "#how", "كيف يعمل"],
    ["clients", "#clients", "العملاء"],
    ["news", "#news", "الأخبار"],
    ["about", "#about", "عن الشركة"],
    ["contact", "#contact", "اتصل بنا"],
    ["pricing", "#pricing", "الأسعار"],
  ] as const;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Tajawal:wght@400;500;700&display=swap');

        @keyframes menuSlide {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes navGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,168,71,0); }
          50%      { box-shadow: 0 0 12px 2px rgba(212,168,71,.15); }
        }

        /* NAV LINK with animated underline */
        .nav-lnk {
          position: relative;
          font-size: .9rem;
          font-family: 'Tajawal', sans-serif;
          font-weight: 600;
          color: #6B6480;
          text-decoration: none;
          transition: color .25s ease;
          white-space: nowrap;
          padding-bottom: 5px;
          padding-top: 5px;
        }
        .nav-lnk::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          right: 50%;
          height: 2px;
          background: linear-gradient(90deg, #E8C46A, #D4A847, #C8903A);
          border-radius: 2px;
          transition: left .35s cubic-bezier(.34,1.2,.64,1), right .35s cubic-bezier(.34,1.2,.64,1);
        }
        .nav-lnk:hover,
        .nav-lnk.active { color: #D4A847 !important; }
        .nav-lnk:hover::after,
        .nav-lnk.active::after { left: 0; right: 0; }

        /* mobile menu links */
        .mobile-lnk {
          display: block;
          padding: .9rem 1.5rem;
          font-family: 'Tajawal', sans-serif;
          font-size: .95rem;
          font-weight: 600;
          color: #6B6480;
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: all .2s ease;
          position: relative;
        }
        .mobile-lnk::before {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #E8C46A, #C8903A);
          border-radius: 0 2px 2px 0;
          transform: scaleY(0);
          transition: transform .25s ease;
        }
        .mobile-lnk:hover,
        .mobile-lnk.active { color: #D4A847; background: rgba(212,168,71,.05); }
        .mobile-lnk:hover::before,
        .mobile-lnk.active::before { transform: scaleY(1); }

        /* hamburger */
        .ham-line {
          display: block;
          height: 1.5px;
          background: #6B6480;
          transition: all .3s cubic-bezier(.34,1.56,.64,1);
          border-radius: 2px;
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          zIndex: 100,
          padding: "0 2rem",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(7,7,15,.94)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(212,168,71,.18)"
            : "1px solid transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "all .4s cubic-bezier(.16,1,.3,1)",
          animation: scrolled ? "navGlow 4s ease-in-out infinite" : "none",
        }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="navHex" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8C46A" />
                <stop offset="100%" stopColor="#C8903A" />
              </linearGradient>
              <filter id="navGlowF">
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="2.5"
                  floodColor="#D4A847"
                  floodOpacity="0.55"
                />
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
            <span
              style={{ WebkitTextFillColor: "transparent", width: "6px" }}
            />
            B
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 36 36"
              style={{ marginBottom: "-1px", flexShrink: 0, margin: "0 1px" }}
            >
              <defs>
                <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8C46A" />
                  <stop offset="50%" stopColor="#D4A847" />
                  <stop offset="100%" stopColor="#C8903A" />
                </linearGradient>
              </defs>
              <polygon
                points="18,2 32,10 32,26 18,34 4,26 4,10"
                fill="none"
                stroke="url(#gold)"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="9"
                fill="none"
                stroke="url(#gold)"
                strokeWidth="1.5"
              />
              <polygon points="18,11 23,18 18,25 13,18" fill="url(#gold)" />
              <polygon points="18,14 21,18 18,22 15,18" fill="#0d0d1a" />
            </svg>
            nd
          </span>
        </Link>

        {/* ── Desktop Nav Links — wider spacing ── */}
        {isLanding && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2rem",
              flexWrap: "nowrap",
            }}
          >
            {NAV_LINKS.map(([id, href, label]) => (
              <a
                key={href}
                href={href}
                className={`nav-lnk${activeSection === id ? " active" : ""}`}
              >
                {label}
              </a>
            ))}
          </div>
        )}

        {/* ── Auth + Hamburger ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            flexShrink: 0,
          }}
        >
          <Link
            to="/login"
            style={{
              padding: ".48rem 1.15rem",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,.09)",
              background: "transparent",
              color: "#6B6480",
              fontSize: ".83rem",
              fontFamily: "Tajawal,sans-serif",
              fontWeight: 600,
              textDecoration: "none",
              transition: "all .25s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(212,168,71,.4)";
              (e.currentTarget as HTMLElement).style.color = "#D4A847";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(212,168,71,.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,.09)";
              (e.currentTarget as HTMLElement).style.color = "#6B6480";
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            تسجيل الدخول
          </Link>

          <Link
            to="/register"
            style={{
              padding: ".48rem 1.15rem",
              borderRadius: 10,
              background: "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
              border: "none",
              color: "#08080F",
              fontSize: ".83rem",
              fontFamily: "Tajawal,sans-serif",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all .25s cubic-bezier(.34,1.56,.64,1)",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = ".88";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 8px 24px rgba(212,168,71,.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            ابدأ مجاناً
          </Link>

          {/* hamburger */}
          {isLanding && (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: "none",
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "transparent",
                border: "1px solid rgba(255,255,255,.09)",
                cursor: "pointer",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
              aria-label="القائمة"
            >
              <span
                className="ham-line"
                style={{
                  width: 16,
                  transform: menuOpen
                    ? "rotate(45deg) translate(4px,4px)"
                    : "none",
                }}
              />
              <span
                className="ham-line"
                style={{ width: 12, opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="ham-line"
                style={{
                  width: 16,
                  transform: menuOpen
                    ? "rotate(-45deg) translate(4px,-4px)"
                    : "none",
                }}
              />
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {menuOpen && isLanding && (
        <div
          style={{
            position: "fixed",
            top: 64,
            right: 0,
            left: 0,
            zIndex: 99,
            background: "rgba(7,7,15,.97)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(212,168,71,.15)",
            animation: "menuSlide .2s ease both",
          }}
        >
          {NAV_LINKS.map(([id, href, label]) => (
            <a
              key={href}
              href={href}
              className={`mobile-lnk${activeSection === id ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div
            style={{ padding: "1rem 1.5rem", display: "flex", gap: ".75rem" }}
          >
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                flex: 1,
                padding: ".65rem",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.09)",
                background: "transparent",
                color: "#6B6480",
                fontSize: ".87rem",
                fontFamily: "Tajawal,sans-serif",
                fontWeight: 600,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              تسجيل الدخول
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              style={{
                flex: 1,
                padding: ".65rem",
                borderRadius: 10,
                background: "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
                color: "#08080F",
                fontSize: ".87rem",
                fontFamily: "Tajawal,sans-serif",
                fontWeight: 700,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
