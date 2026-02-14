import { Navigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'

const RequireAdmin = ({ children }) => {
  const { token } = useAdminAuth()
  return token ? children : <Navigate to="/admin/login" />
}

export default RequireAdmin