import { useAuth } from '../context/AuthContext'

const navItems = {
  participant: [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  ],
  jury: [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'evaluate',  label: 'Evaluate',  icon: '📝' },
    { key: 'history',   label: 'History',    icon: '📊' },
  ],
  coordinator: [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'timer',     label: 'Timer',     icon: '⏱️' },
    { key: 'credits',   label: 'Credits',   icon: '🏅' },
  ],
  organizer: [
    { key: 'overview',  label: 'Overview',  icon: '📊' },
    { key: 'venues',    label: 'Venues',    icon: '🏛️' },
    { key: 'events',    label: 'Events',    icon: '🎯' },
    { key: 'results',   label: 'Results',   icon: '🏆' },
    { key: 'rally',     label: 'Evaluator Rally', icon: '🔄' },
  ],
}

export default function Sidebar({ activeTab, onTabChange }) {
  const { user } = useAuth()
  const items = navItems[user?.role] || []

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">⚡</span>
        <span className="sidebar-name">EMS</span>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Navigation</span>
        {items.map((item) => (
          <button
            key={item.key}
            className={`sidebar-item ${activeTab === item.key ? 'active' : ''}`}
            onClick={() => onTabChange(item.key)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          <small>EMS v1.0</small>
          <small>Event Management System</small>
        </div>
      </div>
    </aside>
  )
}

