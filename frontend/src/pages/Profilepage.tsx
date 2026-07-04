import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface User {
  _id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider: "local" | "google" | "firebase" | "phone";
  role: "user" | "admin";
  isVerified: boolean;
  credits: number;
  plan: "free" | "pro";
  createdAt: string;
}

/* ─────────────────────────────────────────────
   PARTICLE CANVAS (same as landing)
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      r: Math.random() * 2 + 0.3,
      dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
      o: Math.random() * 0.35 + 0.05,
      pulse: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.6,
    }));

    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * W(), y: Math.random() * H(),
      r: Math.random() * 1.2 + 0.15,
      o: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinkleOffset: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.75,
      dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.35,
    }));

    const orbs = [
      { x: 0.25, y: 0.2,  r: 160, color: "212,168,71", speed: 0.0008 },
      { x: 0.75, y: 0.7,  r: 120, color: "139,92,246", speed: 0.0012 },
      { x: 0.5,  y: 0.85, r: 90,  color: "212,168,71", speed: 0.001 },
    ];

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, W(), H());

      // orbs
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

      // waves
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const amp = 16 + w * 7, freq = 0.006 + w * 0.002;
        const phase = t * 0.4 + w * 1.2;
        const yBase = H() * (0.25 + w * 0.25);
        for (let x = 0; x <= W(); x += 4) {
          const y = yBase + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 0.5 + phase * 0.7) * amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = w % 2 === 0
          ? `rgba(212,168,71,${0.035 - w * 0.008})`
          : `rgba(139,92,246,${0.035 - w * 0.008})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // lines between particles
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

      // stars
      stars.forEach(s => {
        s.x += s.dx; s.y += s.dy;
        if (s.x < 0) s.x = W(); if (s.x > W()) s.x = 0;
        if (s.y < 0) s.y = H(); if (s.y > H()) s.y = 0;
        const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
        const alpha = s.o * twinkle;
        ctx.beginPath();
        ctx.arc(s.x, s.y, Math.max(0, s.r), 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(232,196,106,${alpha})`
          : `rgba(255,255,255,${alpha * 0.8})`;
        ctx.fill();
      });

      // particles
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        p.pulse += 0.03;
        if (p.x < 0) p.x = W(); if (p.x > W()) p.x = 0;
        if (p.y < 0) p.y = H(); if (p.y > H()) p.y = 0;
        const pR = p.r + Math.sin(p.pulse) * 0.5;
        const pO = p.o + Math.sin(p.pulse * 0.7) * 0.08;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0, pR), 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(212,168,71,${pO})`
          : `rgba(139,92,246,${pO * 0.6})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({
  value, label, color = "#C9973A", icon,
}: {
  value: string | number; label: string; color?: string; icon: string;
}) {
  return (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}30`,
      borderRadius: 16,
      padding: "1.25rem",
      textAlign: "center",
      flex: 1,
      minWidth: 100,
    }}>
      <div style={{ fontSize: "1.5rem", marginBottom: ".375rem" }}>{icon}</div>
      <div style={{
        fontFamily: "Sora,sans-serif",
        fontSize: "1.75rem",
        fontWeight: 800,
        color,
        lineHeight: 1,
        marginBottom: ".375rem",
      }}>
        {value}
      </div>
      <div style={{ fontSize: ".72rem", color: "#6B6480" }}>{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INFO ROW
───────────────────────────────────────────── */
function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: ".875rem 1rem",
      background: "rgba(255,255,255,.02)",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.05)",
    }}>
      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: ".65rem", color: "#6B6480", fontWeight: 700,
          letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".2rem" }}>
          {label}
        </div>
        <div style={{ fontSize: ".9rem", color: "#EAE6DE", fontWeight: 500,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────────── */
function EditModal({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (data: { fullName: string }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSave = async () => {
    if (!fullName.trim()) return setErr(t("txt_548"));
    setLoading(true);
    setErr("");
    try {
      await onSave({ fullName });
      onClose();
    } catch {
      setErr(t("txt_547"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem",
      background: "rgba(0,0,0,.75)",
      backdropFilter: "blur(8px)",
    }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 420,
          background: "linear-gradient(145deg,#0D0D1C,#111128)",
          border: "1px solid rgba(212,168,71,.2)",
          borderRadius: 22,
          padding: "2rem",
          boxShadow: "0 40px 100px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)",
          animation: "modalIn .3s cubic-bezier(.16,1,.3,1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{
          fontFamily: "Sora,sans-serif", fontSize: "1.2rem",
          fontWeight: 700, color: "#EAE6DE", marginBottom: "1.5rem",
        }}>
          {t("txt_514")}
                          </h3>

        <label style={{
          display: "block", fontSize: ".72rem", fontWeight: 700,
          color: "#6B6480", letterSpacing: "1px", textTransform: "uppercase",
          marginBottom: ".5rem",
        }}>
          {t("txt_513")}
                          </label>
        <input
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder={t("txt_546")}
          style={{
            width: "100%", padding: ".875rem 1rem",
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 10, color: "#EAE6DE",
            fontFamily: "Tajawal,sans-serif", fontSize: ".9rem",
            outline: "none", marginBottom: "1rem",
            transition: "all .25s",
          }}
          onFocus={e => {
            e.target.style.borderColor = "rgba(212,168,71,.4)";
            e.target.style.boxShadow = "0 0 0 3px rgba(212,168,71,.06)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(255,255,255,.08)";
            e.target.style.boxShadow = "none";
          }}
        />

        {err && (
          <div style={{
            background: "rgba(248,113,113,.08)",
            border: "1px solid rgba(248,113,113,.2)",
            color: "#F87171", padding: ".625rem 1rem",
            borderRadius: 8, fontSize: ".8rem",
            textAlign: "center", marginBottom: "1rem",
          }}>
            {err}
          </div>
        )}

        <div style={{ display: "flex", gap: ".75rem" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: ".875rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 12, color: "#6B6480",
            fontFamily: "Tajawal,sans-serif",
            fontSize: ".9rem", fontWeight: 600,
            cursor: "pointer", transition: "all .2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.2)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.08)")}
          >
            {t("txt_512")}
                                </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 1, padding: ".875rem",
              background: loading
                ? "#8A6A28"
                : "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
              border: "none", borderRadius: 12,
              color: "#08080F",
              fontFamily: "Tajawal,sans-serif",
              fontSize: ".9rem", fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .25s",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: ".5rem",
            }}
          >
            {loading
              ? <><div style={{
                  width: 14, height: 14,
                  border: "2px solid #08080F44",
                  borderTop: "2px solid #08080F",
                  borderRadius: "50%",
                  animation: "spin .8s linear infinite",
                }} /> {t("txt_511")}</>
              : t("txt_545")
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CHANGE PASSWORD MODAL
───────────────────────────────────────────── */
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent]       = useState("");
  const [next, setNext]             = useState("");
  const [confirm, setConfirm]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [err, setErr]               = useState("");
  const [success, setSuccess]       = useState(false);

  const handleSave = async () => {
    if (!current || !next || !confirm) return setErr(t("txt_544"));
    if (next !== confirm) return setErr(t("txt_543"));
    if (next.length < 6) return setErr(t("txt_542"));
    setLoading(true); setErr("");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || t("txt_541")); return; }
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch {
      setErr(t("txt_540"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: ".875rem 1rem",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 10, color: "#EAE6DE",
    fontFamily: "Tajawal,sans-serif", fontSize: ".9rem",
    outline: "none", marginBottom: ".875rem",
    transition: "all .25s", direction: "ltr",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1rem", background: "rgba(0,0,0,.75)",
      backdropFilter: "blur(8px)",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 420,
        background: "linear-gradient(145deg,#0D0D1C,#111128)",
        border: "1px solid rgba(212,168,71,.2)",
        borderRadius: 22, padding: "2rem",
        boxShadow: "0 40px 100px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.04)",
        animation: "modalIn .3s cubic-bezier(.16,1,.3,1)",
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{
          fontFamily: "Sora,sans-serif", fontSize: "1.2rem",
          fontWeight: 700, color: "#EAE6DE", marginBottom: "1.5rem",
        }}>
          {t("txt_510")}
                          </h3>

        {[t("txt_539"), t("txt_538"), t("txt_537")].map((ph, i) => (
          <input
            key={i} type="password" placeholder={ph}
            value={[current, next, confirm][i]}
            onChange={e => [setCurrent, setNext, setConfirm][i](e.target.value)}
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = "rgba(212,168,71,.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,168,71,.06)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,.08)"; e.target.style.boxShadow = "none"; }}
          />
        ))}

        {err && (
          <div style={{
            background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)",
            color: "#F87171", padding: ".625rem 1rem", borderRadius: 8,
            fontSize: ".8rem", textAlign: "center", marginBottom: "1rem",
          }}>{err}</div>
        )}
        {success && (
          <div style={{
            background: "rgba(74,222,128,.08)", border: "1px solid rgba(74,222,128,.2)",
            color: "#4ADE80", padding: ".625rem 1rem", borderRadius: 8,
            fontSize: ".8rem", textAlign: "center", marginBottom: "1rem",
          }}>{t("txt_509")}</div>
        )}

        <div style={{ display: "flex", gap: ".75rem" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: ".875rem", background: "transparent",
            border: "1px solid rgba(255,255,255,.08)", borderRadius: 12,
            color: "#6B6480", fontFamily: "Tajawal,sans-serif",
            fontSize: ".9rem", fontWeight: 600, cursor: "pointer", transition: "all .2s",
          }}>{t("txt_508")}</button>
          <button onClick={handleSave} disabled={loading} style={{
            flex: 1, padding: ".875rem",
            background: loading ? "#8A6A28" : "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
            border: "none", borderRadius: 12, color: "#08080F",
            fontFamily: "Tajawal,sans-serif", fontSize: ".9rem", fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem",
          }}>
            {loading
              ? <><div style={{ width: 14, height: 14, border: "2px solid #08080F44", borderTop: "2px solid #08080F", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> {t("txt_507")}</>
              : t("txt_536")
            }
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProfilePage() {
    const { t } = useTranslation();
  const [user, setUser]               = useState<User | null>(null);
  const [projects, setProjects]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showEdit, setShowEdit]       = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [saveMsg, setSaveMsg]         = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  /* ── fetch user + projects ── */
  useEffect(() => {
    const init = async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          fetch("/api/auth/me", { credentials: "include" }),
          fetch("/api/projects",  { credentials: "include" }),
        ]);
        if (!uRes.ok) { navigate("/login"); return; }
        const uData = await uRes.json();
        setUser(uData.user);
        if (pRes.ok) {
          const pData = await pRes.json();
          setProjects(pData.projects || []);
        }
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  /* ── save profile ── */
  const handleSave = async (data: { fullName: string }) => {
    const res = await fetch("/api/auth/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    setUser(prev => prev ? { ...prev, ...json.user } : prev);
    setSaveMsg(t("txt_535"));
    setTimeout(() => setSaveMsg(""), 3000);
  };

  /* ── logout ── */
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      navigate("/login");
    } catch {
      setLogoutLoading(false);
    }
  };

  /* ── computed ── */
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ar-EG", { month: "long", year: "numeric" })
    : "—";

  const providerLabel: Record<string, string> = {
    google: "Google",
    local: t("txt_534"),
    firebase: "Firebase",
    phone: t("txt_533"),
  };

  /* ── loading ── */
  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#07070F",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 44, height: 44,
        border: "3px solid rgba(201,151,58,.2)",
        borderTop: "3px solid #C9973A",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <div dir="rtl" style={{
      minHeight: "100vh",
      background: "#07070F",
      color: "#EAE6DE",
      fontFamily: "Tajawal, sans-serif",
      paddingTop: 64,
      position: "relative",
      overflow: "hidden",
    }}>
      <ParticleCanvas />

      {/* grid overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(212,168,71,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,168,71,.025) 1px,transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)",
        zIndex: 0,
      }} />





















      {/* ── Content ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "2.5rem 1.25rem 5rem" }}>

        {/* ── Page Title ── */}
        <div style={{ marginBottom: "2rem", animation: "fadeUp .6s cubic-bezier(.16,1,.3,1) both" }}>
          <p style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#D4A847", marginBottom: ".5rem" }}>
            {t("txt_506")}
                                </p>
          <h1 style={{
            fontFamily: "Sora,sans-serif", fontSize: "clamp(1.6rem,4vw,2.2rem)",
            fontWeight: 800, color: "#EAE6DE", letterSpacing: "-1.5px",
          }}>
            {t("txt_505")}
                                </h1>
        </div>

        {/* ── Hero Card ── */}
        <div style={{
          background: "linear-gradient(145deg,#0D0D1C,#111128)",
          border: "1px solid rgba(212,168,71,.18)",
          borderRadius: 24, padding: "2rem",
          marginBottom: "1.25rem",
          position: "relative", overflow: "hidden",
          animation: "fadeUp .65s .05s cubic-bezier(.16,1,.3,1) both",
          boxShadow: "0 30px 80px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.04)",
        }}>
          {/* glow */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 220, height: 220,
            background: "radial-gradient(circle,rgba(212,168,71,.12),transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 160, height: 160,
            background: "radial-gradient(circle,rgba(139,92,246,.08),transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", position: "relative" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {user?.avatar ? (
                <img
                  src={user.avatar} alt={user?.fullName}
                  style={{
                    width: 88, height: 88, borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid rgba(212,168,71,.4)",
                    boxShadow: "0 0 30px rgba(212,168,71,.2)",
                  }}
                />
              ) : (
                <div style={{
                  width: 88, height: 88, borderRadius: "50%",
                  background: "linear-gradient(135deg,#E8C46A,#C9973A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "28px", fontWeight: 700, color: "#08080F",
                  border: "3px solid rgba(212,168,71,.4)",
                  boxShadow: "0 0 30px rgba(212,168,71,.2)",
                  fontFamily: "Tajawal,sans-serif",
                }}>
                  {user?.fullName?.slice(0, 2) || t("txt_532")}
                </div>
              )}
              {/* verified badge */}
              {user?.isVerified && (
                <div style={{
                  position: "absolute", bottom: 2, right: 2,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#4ADE80",
                  border: "2px solid #07070F",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px",
                }}>
                  ✓
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".75rem", flexWrap: "wrap", marginBottom: ".4rem" }}>
                <h2 style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: "1.5rem", fontWeight: 800,
                  color: "#EAE6DE", letterSpacing: "-.5px",
                }}>
                  {user?.fullName || t("txt_531")}
                </h2>
                <span style={{
                  padding: "3px 12px", borderRadius: 20,
                  fontSize: "11px", fontWeight: 700,
                  fontFamily: "Sora,sans-serif",
                  background: user?.plan === "pro"
                    ? "linear-gradient(135deg,#E8C46A,#C9973A)"
                    : "rgba(255,255,255,.06)",
                  color: user?.plan === "pro" ? "#08080F" : "#6B6480",
                  border: user?.plan === "pro" ? "none" : "1px solid rgba(255,255,255,.08)",
                }}>
                  {user?.plan === "pro" ? "Pro ✦" : "Free"}
                </span>
                {user?.role === "admin" && (
                  <span style={{
                    padding: "3px 12px", borderRadius: 20,
                    fontSize: "11px", fontWeight: 700,
                    background: "rgba(139,92,246,.15)",
                    color: "#A78BFA",
                    border: "1px solid rgba(139,92,246,.3)",
                  }}>Admin</span>
                )}
              </div>
              <p style={{ fontSize: ".85rem", color: "#6B6480", marginBottom: ".75rem" }}>
                {user?.email || user?.phone || "—"}
              </p>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                <button
                  onClick={() => setShowEdit(true)}
                  style={{
                    padding: ".5rem 1.1rem", borderRadius: 10,
                    background: "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
                    border: "none", color: "#08080F",
                    fontFamily: "Tajawal,sans-serif",
                    fontSize: ".8rem", fontWeight: 700,
                    cursor: "pointer", transition: "all .25s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = ".85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {t("txt_504")}
                                                  </button>
                {user?.provider === "local" && (
                  <button
                    onClick={() => setShowPass(true)}
                    style={{
                      padding: ".5rem 1.1rem", borderRadius: 10,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,.08)",
                      color: "#C4BDB5",
                      fontFamily: "Tajawal,sans-serif",
                      fontSize: ".8rem", fontWeight: 600,
                      cursor: "pointer", transition: "all .2s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "rgba(212,168,71,.3)";
                      e.currentTarget.style.color = "#D4A847";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,.08)";
                      e.currentTarget.style.color = "#C4BDB5";
                    }}
                  >
                    {t("txt_503")}
                                                        </button>
                )}
              </div>
            </div>
          </div>

          {/* save success msg */}
          {saveMsg && (
            <div style={{
              marginTop: "1rem",
              background: "rgba(74,222,128,.08)",
              border: "1px solid rgba(74,222,128,.2)",
              color: "#4ADE80", padding: ".625rem 1rem",
              borderRadius: 10, fontSize: ".82rem", textAlign: "center",
            }}>
              {saveMsg}
            </div>
          )}
        </div>

        {/* ── Stats Row ── */}
        <div style={{
          display: "flex", gap: "1rem", flexWrap: "wrap",
          marginBottom: "1.25rem",
          animation: "fadeUp .65s .1s cubic-bezier(.16,1,.3,1) both",
        }}>
          <StatCard
            value={user?.credits ?? 0}
            label={t("txt_530")}
            color="#C9973A"
            icon="✦"
          />
          <StatCard
            value={projects.length}
            label={t("txt_529")}
            color="#60A5FA"
            icon="📁"
          />
          <StatCard
            value={completedProjects}
            label={t("txt_528")}
            color="#4ADE80"
            icon="✅"
          />
        </div>

        {/* ── Account Info ── */}
        <div style={{
          background: "linear-gradient(145deg,#0D0D1C,#111128)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 22, padding: "1.75rem",
          marginBottom: "1.25rem",
          animation: "fadeUp .65s .15s cubic-bezier(.16,1,.3,1) both",
        }}>
          <p style={{
            fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: "#D4A847", marginBottom: "1.25rem",
          }}>
            {t("txt_502")}
                                </p>
          <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
            <InfoRow icon="👤" label={t("txt_527")} value={user?.fullName || "—"} />
            {user?.email && <InfoRow icon="📧" label={t("txt_526")} value={user.email} />}
            {user?.phone && <InfoRow icon="📱" label={t("txt_525")} value={user.phone} />}
            <InfoRow icon="🔗" label={t("txt_524")} value={providerLabel[user?.provider || "local"]} />
            <InfoRow icon="🛡️" label={t("txt_523")} value={user?.isVerified ? t("txt_522") : t("txt_521")} />
            <InfoRow icon="📅" label={t("txt_520")} value={memberSince} />
          </div>
        </div>

        {/* ── Recent Projects ── */}
        <div style={{
          background: "linear-gradient(145deg,#0D0D1C,#111128)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 22, padding: "1.75rem",
          marginBottom: "1.25rem",
          animation: "fadeUp .65s .2s cubic-bezier(.16,1,.3,1) both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <p style={{
              fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px",
              textTransform: "uppercase", color: "#D4A847",
            }}>
              {t("txt_501")}
                                      </p>
            <Link to="/dashboard" style={{
              fontSize: ".75rem", color: "#C9973A", textDecoration: "none",
              padding: ".25rem .625rem", borderRadius: 6,
              border: "1px solid rgba(201,151,58,.25)",
              transition: "all .2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,151,58,.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {t("txt_500")}
                                      </Link>
          </div>

          {projects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>🎨</div>
              <p style={{ fontSize: ".85rem", color: "#6B6480", marginBottom: "1rem" }}>
                {t("txt_499")}
                                            </p>
              <Link to="/dashboard" style={{
                padding: ".625rem 1.5rem", borderRadius: 10,
                background: "linear-gradient(135deg,#E8C46A,#D4A847,#C8903A)",
                color: "#08080F", fontWeight: 700, fontFamily: "Tajawal,sans-serif",
                fontSize: ".85rem", textDecoration: "none",
              }}>
                {t("txt_498")}
                                            </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: ".625rem" }}>
              {projects.slice(0, 5).map(proj => (
                <div key={proj._id} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto",
                  alignItems: "center",
                  gap: "1rem",
                  padding: ".875rem 1rem",
                  background: "rgba(255,255,255,.02)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.05)",
                  transition: "all .2s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,71,.2)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,.05)")}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: ".9rem", fontWeight: 700, color: "#EAE6DE",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      marginBottom: ".2rem",
                    }}>
                      {proj.projectTitle || proj.customBrandName || t("txt_519")}
                    </div>
                    <div style={{ fontSize: ".72rem", color: "#6B6480" }}>
                      {new Date(proj.createdAt).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                  <span style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: ".65rem", fontWeight: 700,
                    whiteSpace: "nowrap",
                    background: proj.status === "completed"
                      ? "rgba(74,222,128,.1)"
                      : proj.status === "failed"
                      ? "rgba(248,113,113,.1)"
                      : "rgba(201,151,58,.1)",
                    color: proj.status === "completed"
                      ? "#4ADE80"
                      : proj.status === "failed"
                      ? "#F87171"
                      : "#C9973A",
                    border: `1px solid ${proj.status === "completed" ? "rgba(74,222,128,.2)" : proj.status === "failed" ? "rgba(248,113,113,.2)" : "rgba(201,151,58,.2)"}`,
                  }}>
                    {proj.status === "completed" ? t("txt_518") : proj.status === "failed" ? t("txt_517") : t("txt_516")}
                  </span>
                  <div style={{ fontSize: ".72rem", color: "#6B6480", whiteSpace: "nowrap" }}>
                    {proj.selectedStyle || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Danger Zone ── */}
        <div style={{
          background: "rgba(248,113,113,.04)",
          border: "1px solid rgba(248,113,113,.12)",
          borderRadius: 22, padding: "1.75rem",
          animation: "fadeUp .65s .25s cubic-bezier(.16,1,.3,1) both",
        }}>
          <p style={{
            fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px",
            textTransform: "uppercase", color: "#F87171", marginBottom: "1rem",
          }}>
            {t("txt_497")}
                                </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: ".9rem", fontWeight: 600, color: "#EAE6DE", marginBottom: ".25rem" }}>
                {t("txt_496")}
                                            </div>
              <div style={{ fontSize: ".78rem", color: "#6B6480" }}>
                {t("txt_495")}
                                            </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              style={{
                padding: ".625rem 1.5rem", borderRadius: 10,
                background: "transparent",
                border: "1px solid rgba(248,113,113,.3)",
                color: "#F87171",
                fontFamily: "Tajawal,sans-serif",
                fontSize: ".85rem", fontWeight: 700,
                cursor: logoutLoading ? "not-allowed" : "pointer",
                transition: "all .2s",
                display: "flex", alignItems: "center", gap: ".5rem",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {logoutLoading
                ? <><div style={{ width: 12, height: 12, border: "2px solid #F8717133", borderTop: "2px solid #F87171", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> {t("txt_494")}</>
                : t("txt_515")
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showEdit && user && (
        <EditModal user={user} onClose={() => setShowEdit(false)} onSave={handleSave} />
      )}
      {showPass && (
        <ChangePasswordModal onClose={() => setShowPass(false)} />
      )}

      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;700;800&family=Tajawal:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: #D4A84733; }

        @keyframes spin     { to { transform: rotate(360deg) } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        @keyframes modalIn  { from { opacity:0; transform:translateY(20px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes dropdownIn { from { opacity:0; transform:translateY(-8px) scale(.97) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}

function t(key: string): string {
  return key;
}
