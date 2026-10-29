import { createContext, useContext, useState } from 'react'
import { users } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    )
    if (found) {
      setUser(found)
      return { success: true, role: found.role }
    }
    return { success: false, message: 'Invalid username or password' }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

