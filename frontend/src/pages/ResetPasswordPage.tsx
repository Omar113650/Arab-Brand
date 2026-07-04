import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
    const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { userId, token } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirm) return setErr(t("txt_588"));
    if (newPassword.length < 6) return setErr(t("txt_587"));
    if (newPassword !== confirm) return setErr(t("txt_586"));
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, resetPasswordToken: token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || t("txt_585"));
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setErr(t("txt_584"));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: ".875rem 1rem",
    background: "#08080F",
    border: "1.5px solid #1E1E2E",
    borderRadius: 10,
    color: "#F0EDE6",
    fontFamily: "Tajawal,sans-serif",
    fontSize: ".9rem",
    outline: "none",
    direction: "ltr",
    transition: "border .2s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem", position: "relative", overflow: "hidden", background: "#07070F", color: "#EAE6DE", fontFamily: "Tajawal,sans-serif" }}>
      {/* bg */}
      <ParticleBackground />

      <div className="fade-up" style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
              <polygon points="17,2 30,9 30,25 17,32 4,25 4,9" fill="url(#rpHex)" />
              <text x="17" y="21" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="800" fill="#0A0800">EG</text>
              <defs>
                <linearGradient id="rpHex" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F0C96B" />
                  <stop offset="100%" stopColor="#C9973A" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontFamily: "Sora, sans-serif", fontSize: "15px", fontWeight: 800, letterSpacing: "0.5px", background: "linear-gradient(90deg,#F0C96B,#C9973A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              EG Brand
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: "#0E0E1A", border: "1px solid #1E1E2E", borderRadius: 22, padding: "2.25rem", boxShadow: "0 24px 80px rgba(0,0,0,.4)" }}>
          {!done ? (
            <>
              {/* icon */}
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#C9973A12", border: "1px solid #C9973A22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>
                {t("txt_582")}
                                            </h1>
              <p style={{ fontSize: ".82rem", color: "#8A8498", marginBottom: "1.75rem", lineHeight: 1.6 }}>
                {t("txt_581")}
                                            </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, color: "#6B6478", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".5rem" }}>
                    {t("txt_580")}
                                                        </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#C9973A44")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E2E")}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, color: "#6B6478", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".5rem" }}>
                    {t("txt_579")}
                                                        </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#C9973A44")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E2E")}
                  />
                </div>

                {err && (
                  <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: "100%", padding: "1rem", background: loading ? "#8A6A28" : "#C9973A", color: "#08080F", border: "none", borderRadius: 12, fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px #C9973A28", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}
                >
                  {loading ? (
                    <><div style={{ width: 16, height: 16, border: "2px solid #08080F44", borderTop: "2px solid #08080F", borderRadius: "50%", animation: "spin 1s linear infinite" }} />{t("txt_578")}</>
                  ) : t("txt_583")}
                </button>
              </form>
            </>
          ) : (
            /* ── Done ── */
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#22c55e12", border: "1px solid #22c55e33", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontFamily: "Sora,sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".5rem" }}>
                {t("txt_577")}
                                                </h2>
              <p style={{ fontSize: ".85rem", color: "#8A8498", lineHeight: 1.7 }}>
                {t("txt_576")}
                                                  <br />
                {t("txt_575")}
                                                </p>
            </div>
          )}

          <p style={{ textAlign: "center", fontSize: ".82rem", color: "#3A3650", marginTop: "1.5rem" }}>
            <Link to="/login" style={{ color: "#C9973A", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
              {t("txt_574")}
                                      </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}