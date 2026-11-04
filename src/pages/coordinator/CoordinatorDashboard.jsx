import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Timer from '../../components/Timer'
import { useAuth } from '../../context/AuthContext'
import { useEMSStore } from '../../store/emsStore'

export default function CoordinatorDashboard() {
  const { user } = useAuth()
  const { teams, venues, updateCredits } = useEMSStore()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [timerMinutes, setTimerMinutes] = useState(10)
  const [alerts, setAlerts] = useState([])

  // ── Derived data ────────────────────────────────────────
  const coordinatorVenue = venues.find((v) => v.block === (user?.allocatedVenue || 'Block A'))
  const venueTeams = teams.filter((t) => t.venue === coordinatorVenue?.block)

  const teamsInRoom = (roomName) => teams.filter((t) => t.room === roomName && t.venue === coordinatorVenue?.block)

  const totalRooms = coordinatorVenue?.rooms.length || 0
  const totalTeams = venueTeams.length
  const activeEvaluations = coordinatorVenue?.rooms.filter((r) => r.juryAssigned).length || 0

  // ── Credit helpers ──────────────────────────────────────
  const handleReduceCredits = async (team) => {
    const newCred = Math.max(0, (team.credits ?? 100) - 10)
    await updateCredits(team.id, newCred, 'reduced')
  }

  const handleNotAward = async (team) => {
    await updateCredits(team.id, 0, 'not-awarded')
  }

  const handleRestoreCredits = async (team) => {
    await updateCredits(team.id, 100, 'awarded')
  }

  // ── Credit summary ─────────────────────────────────────
  const creditsSummary = useMemo(() => {
    return {
      full: teams.filter((t) => (t.creditStatus || 'awarded') === 'awarded').length,
      reduced: teams.filter((t) => t.creditStatus === 'reduced').length,
      notAwarded: teams.filter((t) => t.creditStatus === 'not-awarded').length,
    }
  }, [teams])

  // ── Timer / Alert helpers ──────────────────────────────
  const timestamp = () =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const handleTimeUp = () => {
    setAlerts((prev) => [...prev, { text: '⚠️ Presentation time is over!', time: timestamp(), type: 'warning' }])
  }

  const sendAlertToJury = () => {
    setAlerts((prev) => [
      ...prev,
      { text: '📢 Alert sent to jury panel', time: timestamp(), type: 'info' },
    ])
  }

  const clearAlerts = () => setAlerts([])

  const statusBadge = (status) => {
    const map = {
      awarded: 'badge-success',
      reduced: 'badge-warning',
      'not-awarded': 'badge-danger',
    }
    const label = {
      awarded: 'Awarded',
      reduced: 'Reduced',
      'not-awarded': 'Not Awarded',
    }
    return <span className={`badge ${map[status] || 'badge-success'}`}>{label[status] || status}</span>
  }

  // ── Tab Renderers ──────────────────────────────────────
  const renderDashboard = () => (
    <>
      {/* Welcome */}
      <div className="welcome-banner">
        <h2>Welcome back, {user?.name || 'Coordinator'} 👋</h2>
        <p>Allocated Venue: <strong>{user?.allocatedVenue || 'Block A'}</strong> | ID: {user?.coordinatorId || 'C-001'}</p>
      </div>

      {/* Stats */}
      <div className="cards-row">
        <div className="stat-card">
          <span className="stat-icon">🚪</span>
          <span className="stat-value">{totalRooms}</span>
          <span className="stat-label">Total Rooms</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{totalTeams}</span>
          <span className="stat-label">Total Teams</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚖️</span>
          <span className="stat-value">{activeEvaluations}</span>
          <span className="stat-label">Active Juries</span>
        </div>
      </div>

      {/* Venue Overview */}
      <div className="venue-overview-card">
        <div className="card-header">
          <h3>📍 Venue Allocation — {coordinatorVenue?.block || 'Block A'}</h3>
        </div>
        <div className="card-body">
          <div className="room-status-grid">
            {coordinatorVenue?.rooms.map((room) => {
              const roomTeams = teamsInRoom(room.name)
              return (
                <div className="room-status-card" key={room.id}>
                  <div className={`room-status-indicator ${room.juryAssigned ? 'active' : 'idle'}`} />
                  <h4>{room.name}</h4>
                  <p><strong>Capacity:</strong> {room.capacity}</p>
                  <p><strong>Tables:</strong> {room.tables}</p>
                  <p>
                    <strong>Jury:</strong>{' '}
                    {room.juryAssigned || <em style={{ opacity: 0.5 }}>Unassigned</em>}
                  </p>
                  <p><strong>Teams:</strong> {roomTeams.length}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )

  const renderTimer = () => (
    <>
      <div className="timer-section">
        <div className="info-card">
          <div className="card-header">
            <h3>⏱️ Timer Control</h3>
          </div>
          <div className="card-body">
            <label style={{ marginRight: 12, fontWeight: 600 }}>
              Duration (minutes):
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.95rem' }}
              >
                {[5, 10, 15, 20].map((m) => (
                  <option key={m} value={m}>{m} min</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <Timer
          key={timerMinutes}
          initialMinutes={timerMinutes}
          onTimeUp={handleTimeUp}
        />

        <div className="info-card" style={{ marginTop: 24 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>🔔 Alerts</h3>
            <div>
              <button className="btn btn-warning btn-sm" onClick={sendAlertToJury} style={{ marginRight: 8 }}>
                Send Alert to Jury
              </button>
              <button className="btn btn-outline btn-sm" onClick={clearAlerts}>
                Clear Alerts
              </button>
            </div>
          </div>
          <div className="card-body">
            {alerts.length === 0 ? (
              <p style={{ opacity: 0.5 }}>No alerts yet.</p>
            ) : (
              <ul className="alert-list">
                {alerts.map((a, i) => (
                  <li key={i} className={`alert-item ${a.type === 'warning' ? 'warning' : ''}`}>
                    <span>{a.text}</span>
                    <span style={{ opacity: 0.55, fontSize: '0.85rem' }}>{a.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )

  const renderCredits = () => (
    <>
      {/* Summary */}
      <div className="credits-summary cards-row">
        <div className="stat-card">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{creditsSummary.full}</span>
          <span className="stat-label">Full Credits</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚠️</span>
          <span className="stat-value">{creditsSummary.reduced}</span>
          <span className="stat-label">Reduced</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">❌</span>
          <span className="stat-value">{creditsSummary.notAwarded}</span>
          <span className="stat-label">Not Awarded</span>
        </div>
      </div>

      {/* Credits table */}
      <div className="info-card">
        <div className="card-header">
          <h3>💰 Credit Management</h3>
        </div>
        <div className="card-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team ID</th>
                <th>Team Name</th>
                <th>Credits</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const creds = team.credits ?? 100
                const status = team.creditStatus ?? 'awarded'
                return (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>{team.name}</td>
                    <td><strong>{creds}</strong></td>
                    <td>{statusBadge(status)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleReduceCredits(team)}
                        disabled={creds === 0}
                        style={{ marginRight: 6 }}
                      >
                        Reduce
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleNotAward(team)}
                        disabled={status === 'not-awarded'}
                        style={{ marginRight: 6 }}
                      >
                        Not Award
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleRestoreCredits(team)}
                        disabled={status === 'awarded' && creds === 100}
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <h1 className="page-title">Coordinator Dashboard</h1>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'timer' && renderTimer()}
      {activeTab === 'credits' && renderCredits()}
    </DashboardLayout>
  )
}
