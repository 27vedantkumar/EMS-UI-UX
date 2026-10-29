import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const roleBadgeColor = {
    participant: 'var(--info)',
    jury: 'var(--secondary)',
    coordinator: 'var(--warning)',
    organizer: 'var(--success)',
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">Dashboard</h2>
      </div>
      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">
            {user?.name?.charAt(0)}
          </div>
          <div className="header-user-info">
            <span className="header-user-name">{user?.name}</span>
            <span
              className="header-role-badge"
              style={{ background: roleBadgeColor[user?.role] }}
            >
              {user?.role}
            </span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          ⏻ Logout
        </button>
      </div>
    </header>
  )
}

