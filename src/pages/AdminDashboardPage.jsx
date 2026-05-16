import { useNavigate } from "react-router-dom";
import AdminDashboard from "../admin/AdminDashboard";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
 localStorage.removeItem('adminToken')
    navigate("/admin");
  };

  return <AdminDashboard onLogout={handleLogout} />;
}