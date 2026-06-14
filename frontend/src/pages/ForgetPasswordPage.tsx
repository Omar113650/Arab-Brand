import { useState } from "react";
import { Link } from "react-router-dom";

type Step = "email" | "sent";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState<Step>("email");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setErr("يرجاء إدخال البريد الإلكتروني");
    setLoading(true);
    setErr("");
    try {;
      console.log("📤 بيبعت request على:", "/api/auth/forget-password");

      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("📥 Response status:", res.status);
      const data = await res.json();
      console.log("📦 Response data:", data);
      if (!res.ok) return setErr(data.message || "حدث خطأ، حاول مرة أخرى");
      setStep("sent");
    } catch (error) {
      console.error("❌ Error:", error);
      setErr("خطأ في الاتصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg — same as Login/Register */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 400,
            background: "radial-gradient(ellipse,#C9973A09,transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#1E1E2E22 1px,transparent 1px),linear-gradient(90deg,#1E1E2E22 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div
        className="fade-up"
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 34 34" fill="none">
              <polygon
                points="17,2 30,9 30,25 17,32 4,25 4,9"
                fill="url(#fpHex)"
              />
              <text
                x="17"
                y="21"
                textAnchor="middle"
                fontFamily="sans-serif"
                fontSize="10"
                fontWeight="800"
                fill="#0A0800"
              >
                EG
              </text>
              <defs>
                <linearGradient id="fpHex" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F0C96B" />
                  <stop offset="100%" stopColor="#C9973A" />
                </linearGradient>
              </defs>
            </svg>
            <span
              style={{
                fontFamily: "Sora, sans-serif",
                fontSize: "15px",
                fontWeight: 800,
                letterSpacing: "0.5px",
                background: "linear-gradient(90deg,#F0C96B,#C9973A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EG Brand
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#0E0E1A",
            border: "1px solid #1E1E2E",
            borderRadius: 22,
            padding: "2.25rem",
            boxShadow: "0 24px 80px rgba(0,0,0,.4)",
          }}
        >
          {step === "email" ? (
            <>
              {/* icon */}
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: "#C9973A12",
                  border: "1px solid #C9973A22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9973A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h1
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#F0EDE6",
                  marginBottom: ".375rem",
                }}
              >
                نسيت كلمة المرور؟
              </h1>
              <p
                style={{
                  fontSize: ".82rem",
                  color: "#8A8498",
                  marginBottom: "1.75rem",
                  lineHeight: 1.6,
                }}
              >
                أدخل إيميلك وهنبعتلك رابط لإعادة تعيين كلمة المرور
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color: "#6B6478",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: ".5rem",
                    }}
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
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
                      textAlign: "right",
                      transition: "border .2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#C9973A44")}
                    onBlur={(e) => (e.target.style.borderColor = "#1E1E2E")}
                  />
                </div>

                {err && (
                  <div
                    style={{
                      background: "#F8717115",
                      border: "1px solid #F8717133",
                      borderRadius: 10,
                      color: "#F87171",
                      fontSize: ".82rem",
                      padding: ".75rem 1rem",
                      marginBottom: "1rem",
                      textAlign: "center",
                    }}
                  >
                    {err}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background: loading ? "#8A6A28" : "#C9973A",
                    color: "#08080F",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "Tajawal,sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 24px #C9973A28",
                    transition: "all .2s",
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
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      جاري الإرسال...
                    </>
                  ) : (
                    "إرسال رابط الاستعادة ←"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ── Step: sent ── */
            <div style={{ textAlign: "center" }}>
              {/* success icon */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#C9973A12",
                  border: "1px solid #C9973A33",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9973A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>

              <h2
                style={{
                  fontFamily: "Sora,sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "#F0EDE6",
                  marginBottom: ".5rem",
                }}
              >
                تم الإرسال ✅
              </h2>
              <p
                style={{
                  fontSize: ".85rem",
                  color: "#8A8498",
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                }}
              >
                بعتنالك رابط إعادة التعيين على
                <br />
                <span style={{ color: "#C9973A", fontWeight: 600 }}>
                  {email}
                </span>
                <br />
                افتح الإيميل واضغط على الرابط
              </p>

              <button
                onClick={() => setStep("email")}
                style={{
                  background: "transparent",
                  border: "1.5px solid #1E1E2E",
                  borderRadius: 10,
                  color: "#8A8498",
                  fontFamily: "Tajawal,sans-serif",
                  fontSize: ".85rem",
                  padding: ".625rem 1.25rem",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#C9973A33";
                  e.currentTarget.style.color = "#C4BDB5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1E1E2E";
                  e.currentTarget.style.color = "#8A8498";
                }}
              >
                إرسال مرة أخرى
              </button>
            </div>
          )}

          {/* back to login */}
          <p
            style={{
              textAlign: "center",
              fontSize: ".82rem",
              color: "#3A3650",
              marginTop: "1.5rem",
            }}
          >
            <Link
              to="/login"
              style={{
                color: "#C9973A",
                textDecoration: "none",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: ".3rem",
              }}
            >
              ← رجوع لتسجيل الدخول
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
