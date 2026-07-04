import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { useTranslation } from "react-i18next";

export default function OtpPage() {
    const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return setErr(t("txt_493"));
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || t("txt_492"));
      navigate("/dashboard");
    } catch {
      setErr(t("txt_491"));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setErr("");
    setSuccess("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setErr(data.message || t("txt_490"));
      setSuccess(t("txt_489"));
    } catch {
      setErr(t("txt_488"));
    } finally {
      setResendLoading(false);
    }
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
              <polygon points="17,2 30,9 30,25 17,32 4,25 4,9" fill="url(#otpHex)" />
              <text x="17" y="21" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="800" fill="#0A0800">EG</text>
              <defs>
                <linearGradient id="otpHex" x1="0" y1="0" x2="1" y2="1">
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
          {/* icon */}
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#C9973A12", border: "1px solid #C9973A22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9973A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
            </svg>
          </div>

          <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "1.5rem", fontWeight: 700, color: "#F0EDE6", marginBottom: ".375rem" }}>
            {t("txt_484")}
                                </h1>
          <p style={{ fontSize: ".82rem", color: "#8A8498", marginBottom: "1.75rem", lineHeight: 1.6 }}>
            {t("txt_483")}
                                  <br />
            <span style={{ color: "#C9973A", fontWeight: 600 }}>{email}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: ".75rem", fontWeight: 700, color: "#6B6478", letterSpacing: "1px", textTransform: "uppercase", marginBottom: ".5rem" }}>
                {t("txt_482")}
                                            </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                style={{ width: "100%", padding: ".875rem 1rem", background: "#08080F", border: "1.5px solid #1E1E2E", borderRadius: 10, color: "#F0EDE6", fontFamily: "monospace", fontSize: "1.5rem", outline: "none", direction: "ltr", textAlign: "center", transition: "border .2s", letterSpacing: "8px", boxSizing: "border-box" }}
                onFocus={(e) => (e.target.style.borderColor = "#C9973A44")}
                onBlur={(e) => (e.target.style.borderColor = "#1E1E2E")}
              />
            </div>

            {err && (
              <div style={{ background: "#F8717115", border: "1px solid #F8717133", borderRadius: 10, color: "#F87171", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
                {err}
              </div>
            )}

            {success && (
              <div style={{ background: "#22c55e15", border: "1px solid #22c55e33", borderRadius: 10, color: "#22c55e", fontSize: ".82rem", padding: ".75rem 1rem", marginBottom: "1rem", textAlign: "center" }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: "1rem", background: loading ? "#8A6A28" : "#C9973A", color: "#08080F", border: "none", borderRadius: 12, fontFamily: "Tajawal,sans-serif", fontWeight: 700, fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px #C9973A28", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}
            >
              {loading ? (
                <><div style={{ width: 16, height: 16, border: "2px solid #08080F44", borderTop: "2px solid #08080F", borderRadius: "50%", animation: "spin 1s linear infinite" }} />{t("txt_481")}</>
              ) : t("txt_487")}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: ".82rem", color: "#3A3650", marginTop: "1.25rem" }}>
            {t("txt_480")}{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading}
              style={{ background: "none", border: "none", color: "#C9973A", fontWeight: 700, fontSize: ".82rem", cursor: resendLoading ? "not-allowed" : "pointer", fontFamily: "Tajawal,sans-serif", padding: 0 }}
            >
              {resendLoading ? t("txt_486") : t("txt_485")}
            </button>
          </p>

          <p style={{ textAlign: "center", fontSize: ".82rem", color: "#3A3650", marginTop: ".75rem" }}>
            <Link to="/login" style={{ color: "#C9973A", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: ".3rem" }}>
              {t("txt_479")}
                                      </Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}