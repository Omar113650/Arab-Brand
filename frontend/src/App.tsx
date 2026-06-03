import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar       from "./components/Navbar";
import LandingPage  from "./pages/LandingPage";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard    from "./pages/Dashboard";
import ForgetPasswordPage from "./pages/ForgetPasswordPage"
import OtpPage from "./pages/OtpPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import "./styles/globals.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<LandingPage />}  />
        <Route path="/login"    element={<LoginPage />}    />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />}    />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
<Route path="/reset-password/:userId/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}
