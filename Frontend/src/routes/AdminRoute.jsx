import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

export default function AdminRoute() {
  const { isAuthed, role } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/courses" replace />;
  return <Outlet />;
}

