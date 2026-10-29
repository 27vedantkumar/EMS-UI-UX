import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import Timer from '../../components/Timer'
import { useAuth } from '../../context/AuthContext'
import { teams, venues } from '../../data/mockData'

export default function CoordinatorDashboard() {
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [teamCredits, setTeamCredits] = useState(() => {
    const initial = {}
    teams.forEach((t) => {
      initial[t.id] = { credits: 100, status: 'awarded' }
    })
    return initial
  })
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
  const reduceCredits = (teamId) => {
    setTeamCredits((prev) => ({
      ...prev,
      [teamId]: {
        credits: Math.max(0, prev[teamId].credits - 10),
        status: 'reduced',
      },
    }))
  }

  const notAward = (teamId) => {
    setTeamCredits((prev) => ({
      ...prev,
      [teamId]: { credits: 0, status: 'not-awarded' },
    }))
  }

  const restoreCredits = (teamId) => {
    setTeamCredits((prev) => ({
      ...prev,
      [teamId]: { credits: 100, status: 'awarded' },
    }))
  }

  // ── Credit summary ─────────────────────────────────────
  const creditsSummary = useMemo(() => {
    const values = Object.values(teamCredits)
    return {
      full: values.filter((v) => v.status === 'awarded').length,
      reduced: values.filter((v) => v.status === 'reduced').length,
      notAwarded: values.filter((v) => v.status === 'not-awarded').length,
    }
  }, [teamCredits])

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

  // ── Badge helper ───────────────────────────────────────
  const statusBadge = (status) => {
    const map = {
      awarded: 'badge badge-success',
      reduced: 'badge badge-warning',
      'not-awarded': 'badge badge-danger',
    }
    const labelMap = {
      awarded: 'Awarded',
      reduced: 'Reduced',
      'not-awarded': 'Not Awarded',
    }
    return <span className={map[status]}>{labelMap[status]}</span>
  }

  // ── Render tabs ────────────────────────────────────────
  const renderDashboard = () => (
    <>
      {/* Welcome card */}
      <div className="info-card">
        <div className="card-header">
          <h2>👋 Welcome, {user?.name || 'Coordinator'}</h2>
        </div>
        <div className="card-body">
          <p><strong>Coordinator ID:</strong> {user?.coordinatorId || 'C-001'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Allocated Venue:</strong> {coordinatorVenue?.block}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="cards-row">
        <div className="stat-card">
          <span className="stat-icon">🏫</span>
          <span className="stat-value">{totalRooms}</span>
          <span className="stat-label">Total Rooms</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{totalTeams}</span>
          <span className="stat-label">Total Teams</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <span className="stat-value">{activeEvaluations}</span>
          <span className="stat-label">Active Evaluations</span>
        </div>
      </div>

      {/* Venue allocation overview */}
      <div className="venue-overview-card">
        <div className="card-header">
          <h2>🏢 Venue Allocation — {coordinatorVenue?.block}</h2>
        </div>
        <div className="card-body">
          <div className="cards-row">
            {coordinatorVenue?.rooms.map((room) => {
              const roomTeams = teamsInRoom(room.name)
              return (
                <div className="room-status-card" key={room.id}>
                  <div className="room-status-indicator" />
                  <h3>{room.name}</h3>
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
            <h2>⏱️ Timer Control</h2>
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
            <h2>🔔 Alerts</h2>
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
          <h2>💰 Credit Management</h2>
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
                const tc = teamCredits[team.id]
                return (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>{team.name}</td>
                    <td><strong>{tc.credits}</strong></td>
                    <td>{statusBadge(tc.status)}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => reduceCredits(team.id)}
                        disabled={tc.credits === 0}
                        style={{ marginRight: 6 }}
                      >
                        Reduce
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => notAward(team.id)}
                        disabled={tc.status === 'not-awarded'}
                        style={{ marginRight: 6 }}
                      >
                        Not Award
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => restoreCredits(team.id)}
                        disabled={tc.status === 'awarded' && tc.credits === 100}
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
