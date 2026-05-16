import { useState } from "react";
import AuthScreen from "./AuthScreen";
import AdminDashboard from "./AdminDashboard";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("sh_admin") === "1");
  const login  = () => { sessionStorage.setItem("sh_admin", "1"); setAuthed(true); };
  const logout = () => { sessionStorage.removeItem("sh_admin");   setAuthed(false); };
  return authed ? <AdminDashboard onLogout={logout} /> : <AuthScreen onLogin={login} />;
}