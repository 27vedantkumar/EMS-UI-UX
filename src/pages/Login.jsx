import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { key: 'participant', label: 'Participant', icon: '👤' },
  { key: 'jury', label: 'Jury', icon: '⚖️' },
  { key: 'coordinator', label: 'Coordinator', icon: '📋' },
  { key: 'organizer', label: 'Organizer', icon: '🎯' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [selectedRole, setSelectedRole] = useState('participant')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(username, password)
      if (result.success) {
        navigate(`/${result.role}`)
      } else {
        setError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername(selectedRole)
    setPassword('demo')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🎪</span>
            <h1>Event Management System</h1>
          </div>
          <p className="login-subtitle">Sign in to manage your events</p>
        </div>

        <div className="role-selector">
          {roles.map((role) => (
            <button
              key={role.key}
              type="button"
              className={`role-btn${selectedRole === role.key ? ' active' : ''}`}
              onClick={() => {
                setSelectedRole(role.key)
                setError('')
              }}
            >
              <span className="role-icon">{role.icon}</span>
              <span className="role-label">{role.label}</span>
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="login-btn"
            disabled={loading || !username || !password}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="demo-hint">
          <button type="button" className="demo-btn" onClick={fillDemoCredentials}>
            Use demo credentials
          </button>
        </div>
      </div>
    </div>
  )
}
