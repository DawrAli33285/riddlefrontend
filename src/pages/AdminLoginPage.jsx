import { useNavigate } from "react-router-dom";
import AuthScreen from "../admin/AuthScreen";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    sessionStorage.setItem("sh_admin", "1");
    navigate("/admin/dashboard");
  };

  return <AuthScreen onLogin={handleLogin} />;
}