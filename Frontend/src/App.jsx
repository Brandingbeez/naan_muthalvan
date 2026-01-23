import { Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import CourseListPage from "./pages/Courses/CourseList";
import CourseDetailsPage from "./pages/Courses/CourseDetails";
import SessionLearningPage from "./pages/Learning/SessionLearning";
import SessionMaterialPage from "./pages/Learning/SessionMaterial";
import SessionPptPage from "./pages/Learning/SessionPpt";
import SessionVideoPage from "./pages/Learning/SessionVideo";

import AdminDashboardPage from "./pages/Admin/AdminDashboard";
import AddCoursePage from "./pages/Admin/AddCourse";
import AddSectionPage from "./pages/Admin/AddSection";
import AddSessionPage from "./pages/Admin/AddSession";

import "./App.css";

export default function App() {
  return (
    <>
      <AppNavbar />
      <main className="app-page">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/courses" element={<CourseListPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailsPage />} />
            <Route path="/courses/:courseId/:subCourseId" element={<CourseDetailsPage />} />
            <Route path="/learn/:sessionId" element={<SessionLearningPage />} />
            <Route path="/learn/:sessionId/material/:materialIndex?" element={<SessionMaterialPage />} />
            <Route path="/learn/:sessionId/ppt/:pptIndex?" element={<SessionPptPage />} />
            <Route path="/learn/:sessionId/video" element={<SessionVideoPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/courses/new" element={<AddCoursePage />} />
            <Route path="/admin/sections/new" element={<AddSectionPage />} />
            <Route path="/admin/sessions/new" element={<AddSessionPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/courses" replace />} />
        </Routes>
      </main>
    </>
  );
}
