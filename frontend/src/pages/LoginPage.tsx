import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* ── ADVANCED CANVAS: particles + glowing lines + waves + orbs + stars ── */
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
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 2 + 0.3,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.35 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.6,
    }));

    /* glowing connection lines between nearby particles */
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.1;
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

    /* wave lines */
    const drawWaves = () => {
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amp = 16 + w * 7;
        const freq = 0.006 + w * 0.002;
        const phase = t * 0.4 + w * 1.2;
        const yBase = H() * (0.25 + w * 0.25);
        for (let x = 0; x <= W(); x += 4) {
          const y =
            yBase +
            Math.sin(x * freq + phase) * amp +
            Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const alpha = 0.035 - w * 0.008;
        ctx.strokeStyle =
          w % 2 === 0
            ? `rgba(212,168,71,${alpha})`
            : `rgba(139,92,246,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    /* stars */
    const stars = Array.from({ length: 350 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 1.3 + 0.15,
      o: Math.random() * 0.8 + 0.15,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.75,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.4,
    }));

    /* sparkle star (4-ray) */
    const drawSparkle = (
      x: number,
      y: number,
      size: number,
      alpha: number,
      gold: boolean
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = gold ? "#E8C46A" : "#ffffff";
      ctx.lineWidth = size * 0.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.4;
      ctx.lineWidth = size * 0.25;
      const d = size * 0.55;
      ctx.beginPath();
      ctx.moveTo(x - d, y - d);
      ctx.lineTo(x + d, y + d);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + d, y - d);
      ctx.lineTo(x - d, y + d);
      ctx.stroke();
      ctx.restore();
    };

    const drawStars = () => {
      stars.forEach((s) => {
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < 0) s.x = W();
        if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H();
        if (s.y > H()) s.y = 0;

        const twinkle =
          0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.o * twinkle;

        if (s.r > 0.7) {
          drawSparkle(s.x, s.y, s.r * 2.5, alpha, s.gold);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.gold
            ? `rgba(232,196,106,${alpha})`
            : `rgba(255,255,255,${alpha * 0.8})`;
          ctx.fill();
        }
      });
    };

    /* floating orbs */
    const orbs = [
      { x: 0.3, y: 0.25, r: 180, color: "212,168,71", speed: 0.0008 },
      { x: 0.7, y: 0.65, r: 130, color: "139,92,246", speed: 0.0012 },
      { x: 0.5, y: 0.85, r: 100, color: "212,168,71", speed: 0.001 },
    ];

    const drawOrbs = () => {
      orbs.forEach((orb, i) => {
        const cx = (orb.x + Math.sin(t * orb.speed + i) * 0.08) * W();
        const cy = (orb.y + Math.cos(t * orb.speed * 1.3 + i) * 0.06) * H();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.r);
        grad.addColorStop(0, `rgba(${orb.color},0.07)`);
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

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += 0.03;
        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H();
        if (p.y > H()) p.y = 0;
        const pulsedR = p.r + Math.sin(p.pulse) * 0.5;
        const pulsedO = p.o + Math.sin(p.pulse * 0.7) * 0.08;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212,168,71,${pulsedO})`
          : `rgba(139,92,246,${pulsedO * 0.6})`;
        ctx.fill();
        if (p.gold && p.r > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulsedR * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,168,71,${pulsedO * 0.06})`;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setErr("يرجاء ملء جميع الحقول");
      return;
    }

    setLoading(true);
    setErr("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "خطأ في تسجيل الدخول");
        return;
      }

      navigate("/dashboard");
    } catch {
      setErr("خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
        background: "#07070F",
        fontFamily: "Tajawal, sans-serif",
        color: "#EAE6DE",
      }}
    >
      {/* ── ANIMATED CANVAS BACKGROUND ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── GRID OVERLAY ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(212,168,71,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,71,.03) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)",
          zIndex: 0,
        }}
      />

      {/* ── FLOATING ORBS (CSS) ── */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 550,
          height: 500,
          background:
            "radial-gradient(ellipse,rgba(212,168,71,.10),transparent 65%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          animation: "orbFloat 9s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          right: "5%",
          width: 280,
          height: 280,
          background:
            "radial-gradient(circle,rgba(139,92,246,.08),transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
          animation: "orbFloat2 11s ease-in-out infinite",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "8%",
          width: 180,
          height: 180,
          background:
            "radial-gradient(circle,rgba(212,168,71,.06),transparent 70%)",
          filter: "blur(25px)",
          pointerEvents: "none",
          animation: "orbFloat3 13s ease-in-out infinite",
          zIndex: 0,
        }}
      />

      {/* ── CARD ── */}
      <div
        className="login-card-enter"
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
          background: "linear-gradient(145deg,#0D0D1C,#101024)",
          border: "1px solid rgba(212,168,71,.15)",
          borderRadius: 22,
          padding: "2.4rem",
          boxShadow:
            "0 30px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.03), inset 0 1px 0 rgba(255,255,255,.04)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* LOGO */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            {/* <svg width="28" height="28" viewBox="0 0 34 34">
              <defs>
                <linearGradient id="loginGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E8C46A" />
                  <stop offset="100%" stopColor="#C9973A" />
                </linearGradient>
              </defs>
              <polygon
                points="17,2 30,9 30,25 17,32 4,25 4,9"
                fill="url(#loginGold)"
              />
              <text
                x="17"
                y="21"
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#0A0800"
              >
                EG
              </text>
            </svg> */}

            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: 15,
                fontWeight: 800,
                background: "linear-gradient(90deg,#E8C46A,#C9973A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EG Brand
            </span>
          </Link>
        </div>

        {/* TITLE */}
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            fontFamily: "Sora, sans-serif",
            marginBottom: ".375rem",
          }}
        >
          مرحباً بعودتك
        </h1>

        <p style={{ fontSize: ".85rem", color: "#6B6480", marginBottom: 18 }}>
          سجّل دخولك وكمّل بناء براندك
        </p>

        {/* GOOGLE LOGIN */}
        <a
          href="/api/auth/google"
          className="google-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: ".9rem",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,.08)",
            background: "rgba(255,255,255,.03)",
            color: "#C4BDB5",
            textDecoration: "none",
            marginBottom: 18,
            fontSize: ".87rem",
            fontFamily: "Tajawal, sans-serif",
            fontWeight: 600,
            transition: "all .25s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          الدخول بـ Google
        </a>
EG Brand
        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: ".75rem",
            marginBottom: "1.25rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,168,71,.15), transparent)",
            }}
          />
          <span
            style={{
              fontSize: ".72rem",
              color: "#3A3650",
              whiteSpace: "nowrap",
            }}
          >
            أو بالإيميل
          </span>
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(212,168,71,.15), transparent)",
            }}
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label className="input-label">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="login-input"
              style={{
                width: "100%",
                padding: ".875rem 1rem",
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 10,
                color: "#EAE6DE",
                fontFamily: "Tajawal, sans-serif",
                fontSize: ".9rem",
                outline: "none",
                direction: "ltr",
                textAlign: "right",
                transition: "all .25s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(212,168,71,.4)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(212,168,71,.06)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,.08)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: ".5rem",
              }}
            >
              <label className="input-label">كلمة المرور</label>
              <Link
                to="/forget-password"
                style={{
                  color: "#C9973A",
                  fontSize: ".72rem",
                  textDecoration: "none",
                  transition: "opacity .2s",
                }}
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="login-input"
              style={{
                width: "100%",
                padding: ".875rem 1rem",
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 10,
                color: "#EAE6DE",
                fontFamily: "Tajawal, sans-serif",
                fontSize: ".9rem",
                outline: "none",
                direction: "ltr",
                textAlign: "right",
                transition: "all .25s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(212,168,71,.4)";
                e.target.style.boxShadow =
                  "0 0 0 3px rgba(212,168,71,.06)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,.08)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {err && (
            <div
              style={{
                background: "rgba(248,113,113,.08)",
                border: "1px solid rgba(248,113,113,.2)",
                color: "#F87171",
                padding: ".75rem 1rem",
                borderRadius: 10,
                marginBottom: 12,
                marginTop: 8,
                fontSize: ".82rem",
                textAlign: "center",
              }}
            >
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
            style={{
              width: "100%",
              padding: "1rem",
              marginTop: 8,
              borderRadius: 12,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontFamily: "Tajawal, sans-serif",
              fontSize: "1rem",
              color: "#08080F",
              background: loading
                ? "#8A6A28"
                : "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
              backgroundSize: "200% auto",
              boxShadow: "0 10px 30px rgba(212,168,71,.25)",
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: ".5rem",
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid #08080F44",
                    borderTop: "2px solid #08080F",
                    borderRadius: "50%",
                    animation: "spin .8s linear infinite",
                  }}
                />
                جاري الدخول...
              </>
            ) : (
              "تسجيل الدخول ✦"
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontSize: ".82rem",
            color: "#6B6480",
            marginTop: 16,
          }}
        >
          مش عندك حساب؟{" "}
          <Link
            to="/register"
            style={{
              color: "#C9973A",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            سجّل دلوقتي
          </Link>
        </p>
      </div>

      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Tajawal:wght@400;500;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #D4A84733; }

        @keyframes orbFloat {
          0%,100% { transform: translateX(-50%) translateY(0) }
          50% { transform: translateX(-50%) translateY(-24px) }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translateY(0) rotate(0deg) }
          50% { transform: translateY(-18px) rotate(5deg) }
        }
        @keyframes orbFloat3 {
          0%,100% { transform: translate(0,0) }
          50% { transform: translate(-12px,-20px) }
        }
        @keyframes spin {
          to { transform: rotate(360deg) }
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(32px) scale(.97) }
          to { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes ctaBreathe {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,168,71,0), 0 8px 32px rgba(212,168,71,.25) }
          50% { box-shadow: 0 0 0 6px rgba(212,168,71,.06), 0 14px 44px rgba(212,168,71,.35) }
        }

        .login-card-enter {
          animation: cardEnter .7s cubic-bezier(.16,1,.3,1) both;
        }

        .input-label {
          display: block;
          font-size: .75rem;
          font-weight: 700;
          color: #6B6480;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: .5rem;
        }

        .google-btn:hover {
          border-color: rgba(212,168,71,.3) !important;
          background: rgba(212,168,71,.05) !important;
          color: #EAE6DE !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,.2);
        }

        .login-submit-btn {
          animation: ctaBreathe 3s ease-in-out infinite;
        }
        .login-submit-btn:hover:not(:disabled) {
          animation: none !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 16px 48px rgba(212,168,71,.4) !important;
        }
      `}</style>
    </div>
  );
}