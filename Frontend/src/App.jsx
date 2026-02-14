import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AdminAuthContextProvider } from './auth/AdminAuthContext'
import RequireAdmin from './auth/RequireAdmin'
import Home from './pages/Public/Home'
import CenterCourses from './pages/Public/CenterCourses'
import CourseSubjects from './pages/Public/CourseSubjects'
import SubjectDetail from './pages/Public/SubjectDetail'
import SessionDetail from './pages/Public/SessionDetail'
import Login from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'
import Centers from './pages/Admin/Centers'
import Courses from './pages/Admin/Courses'
import Subjects from './pages/Admin/Subjects'
import Sessions from './pages/Admin/Sessions'
import Resources from './pages/Admin/Resources'
import NmPublish from './pages/Admin/NmPublish'
import AuditLogs from './pages/Admin/AuditLogs'
import LaunchHandler from './pages/Nm/LaunchHandler'

const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorTextBase: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 6,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: 14,
    lineHeight: 1.5715,
    lineType: 'solid',
    boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    controlHeight: 32,
    controlHeightLg: 40,
    controlHeightSm: 24,
  },
  algorithm: undefined, // Can switch to dark theme with 'darkAlgorithm'
}

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AdminAuthContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/centers/:centerId" element={<CenterCourses />} />
            <Route path="/courses/:courseCode" element={<CourseSubjects />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetail />} />
            <Route path="/sessions/:sessionId" element={<SessionDetail />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
            <Route path="/admin/centers" element={<RequireAdmin><Centers /></RequireAdmin>} />
            <Route path="/admin/courses" element={<RequireAdmin><Courses /></RequireAdmin>} />
            <Route path="/admin/subjects" element={<RequireAdmin><Subjects /></RequireAdmin>} />
            <Route path="/admin/sessions" element={<RequireAdmin><Sessions /></RequireAdmin>} />
            <Route path="/admin/resources" element={<RequireAdmin><Resources /></RequireAdmin>} />
            <Route path="/admin/nm" element={<RequireAdmin><NmPublish /></RequireAdmin>} />
            <Route path="/admin/audit" element={<RequireAdmin><AuditLogs /></RequireAdmin>} />
            <Route path="/nm/launch" element={<LaunchHandler />} />
          </Routes>
        </AdminAuthContextProvider>
      </Router>
    </ConfigProvider>
  )
}

export default App