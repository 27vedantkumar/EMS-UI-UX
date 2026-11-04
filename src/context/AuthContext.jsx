import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'
import { useEMSStore } from '../store/emsStore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ems_user')
    return saved ? JSON.parse(saved) : null
  })

  const fetchInitialData = useEMSStore((state) => state.fetchInitialData)

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const login = async (username, password) => {
    try {
      const userData = await api.login(username, password)
      setUser(userData)
      localStorage.setItem('ems_user', JSON.stringify(userData))
      return { success: true, role: userData.role }
    } catch (err) {
      return { success: false, message: err.message || 'Invalid username or password' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ems_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
