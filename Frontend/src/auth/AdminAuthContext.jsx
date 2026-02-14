import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext()

export const AdminAuthContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('adminToken'))

  useEffect(() => {
    if (token) {
      // Decode or fetch admin info
      setAdmin({})
    }
  }, [token])

  const login = (token, admin) => {
    localStorage.setItem('adminToken', token)
    setToken(token)
    setAdmin(admin)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)