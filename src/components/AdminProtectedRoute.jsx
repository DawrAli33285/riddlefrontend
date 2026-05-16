import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const authed = localStorage.getItem('adminToken')?true:false;
  if (!authed) return <Navigate to="/admin" replace />;
  return children;
}