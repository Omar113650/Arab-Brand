import { useState } from "react";
// import SplashScreen from "./components/SplashScreen";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import OtpPage from "./pages/OtpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ProfilePage from "./pages/Profilepage";
import "./styles/globals.css";

export default function App() {
  // const [showSplash, setShowSplash] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <>
      {/* {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />} */}

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route
            path="/reset-password/:userId/:token"
            element={<ResetPasswordPage />}
          />

          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
