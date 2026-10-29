import React, { useState, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Timer from '../../components/Timer';
import { useAuth } from '../../context/AuthContext';
import { teams, evaluationCriteria, venues } from '../../data/mockData';

const JuryDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [scores, setScores] = useState({});
  const [remarks, setRemarks] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [filterText, setFilterText] = useState('');

  // Derive the jury's allocated venue (first venue or based on user assignment)
  const allocatedVenue = venues && venues.length > 0 ? venues[0] : null;
  const allocatedRooms = allocatedVenue?.rooms || [];

  // Get teams for the selected room
  const teamsInRoom = selectedRoom
    ? teams.filter(
        (t) =>
          t.roomId === selectedRoom.id ||
          t.room === selectedRoom.name ||
          t.roomNumber === selectedRoom.number
      )
    : [];

  // If no room-based filtering matches, show all teams as fallback
  const displayTeams = teamsInRoom.length > 0 ? teamsInRoom : selectedRoom ? teams : [];

  const handleRoomSelect = useCallback((room) => {
    setSelectedRoom(room);
    setSelectedTeam(null);
    setScores({});
    setRemarks('');
  }, []);

  const handleTeamSelect = useCallback(
    (team) => {
      setSelectedTeam(team);
      const initialScores = {};
      if (evaluationCriteria) {
        evaluationCriteria.forEach((c) => {
          initialScores[c.id] = 0;
        });
      }
      setScores(initialScores);
      setRemarks('');
    },
    []
  );

  const handleScoreChange = useCallback((criterionId, value) => {
    const numVal = Math.min(10, Math.max(0, Number(value)));
    setScores((prev) => ({ ...prev, [criterionId]: numVal }));
  }, []);

  const handleSubmitEvaluation = useCallback(() => {
    if (!selectedTeam) return;

    const totalScore = Object.values(scores).reduce((sum, v) => sum + v, 0);

    const evaluation = {
      id: Date.now(),
      teamId: selectedTeam.id,
      teamName: selectedTeam.name || selectedTeam.teamName || `Team ${selectedTeam.id}`,
      scores: { ...scores },
      totalScore,
      remarks,
      timestamp: new Date().toISOString(),
      juryId: user?.id,
      roomId: selectedRoom?.id,
    };

    setEvaluations((prev) => [...prev, evaluation]);
    setSelectedTeam(null);
    setScores({});
    setRemarks('');
  }, [selectedTeam, scores, remarks, user, selectedRoom]);

  const filteredEvaluations = evaluations.filter((ev) =>
    filterText
      ? ev.teamName.toLowerCase().includes(filterText.toLowerCase()) ||
        String(ev.teamId).includes(filterText)
      : true
  );

  const maxPossibleScore = evaluationCriteria ? evaluationCriteria.length * 10 : 0;
  const currentTotal = Object.values(scores).reduce((sum, v) => sum + v, 0);

  // ─── Dashboard Tab ───────────────────────────────────────────
  const renderDashboard = () => (
    <div>
      <h1 className="page-title">Jury Dashboard</h1>

      <div className="cards-row">
        <div className="stat-card">
          <div className="stat-icon">🏛️</div>
          <div className="stat-value">{allocatedVenue?.name || 'N/A'}</div>
          <div className="stat-label">Allocated Venue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-value">{allocatedRooms.length}</div>
          <div className="stat-label">Rooms Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{evaluations.length}</div>
          <div className="stat-label">Evaluations Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{teams ? teams.length : 0}</div>
          <div className="stat-label">Total Teams</div>
        </div>
      </div>

      {/* Venue Info Card */}
      <div className="info-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3>📍 Venue Information</h3>
        </div>
        <div className="card-body">
          {allocatedVenue ? (
            <div>
              <p>
                <strong>Venue:</strong> {allocatedVenue.name}
              </p>
              {allocatedVenue.address && (
                <p>
                  <strong>Address:</strong> {allocatedVenue.address}
                </p>
              )}
              <p>
                <strong>Rooms:</strong> {allocatedRooms.length}
              </p>
            </div>
          ) : (
            <p className="empty-state">No venue allocated yet.</p>
          )}
        </div>
      </div>

      {/* Room Selection */}
      <div className="info-card" style={{ marginTop: '1.5rem' }}>
        <div className="card-header">
          <h3>🚪 Select a Room to Evaluate</h3>
        </div>
        <div className="card-body">
          {allocatedRooms.length > 0 ? (
            <div className="cards-row" style={{ flexWrap: 'wrap' }}>
              {allocatedRooms.map((room) => (
                <div
                  key={room.id}
                  className={`room-card ${selectedRoom?.id === room.id ? 'active' : ''}`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="stat-icon">🏠</div>
                  <div className="stat-value">{room.name || room.number || `Room ${room.id}`}</div>
                  <div className="stat-label">
                    {room.capacity ? `Capacity: ${room.capacity}` : 'Click to select'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No rooms available in this venue.</p>
          )}
        </div>
      </div>

      {/* Teams in Selected Room */}
      {selectedRoom && (
        <div className="info-card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3>
              👥 Teams in {selectedRoom.name || `Room ${selectedRoom.id}`}
            </h3>
          </div>
          <div className="card-body">
            {displayTeams.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Team ID</th>
                    <th>Team Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTeams.map((team) => {
                    const evaluated = evaluations.some((e) => e.teamId === team.id);
                    return (
                      <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name || team.teamName || `Team ${team.id}`}</td>
                        <td>
                          <span
                            className={`btn ${evaluated ? 'btn-success' : 'btn-outline'}`}
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', cursor: 'default' }}
                          >
                            {evaluated ? 'Evaluated' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="empty-state">No teams assigned to this room yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ─── Evaluate Tab ────────────────────────────────────────────
  const renderEvaluate = () => {
    // No room selected
    if (!selectedRoom) {
      return (
        <div>
          <h1 className="page-title">Evaluate Teams</h1>
          <div className="info-card">
            <div className="card-header">
              <h3>⚠️ Select a Room First</h3>
            </div>
            <div className="card-body">
              <p className="empty-state">
                Please go to the Dashboard tab and select a room before evaluating teams.
              </p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                onClick={() => setActiveTab('dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No team selected — show team list
    if (!selectedTeam) {
      return (
        <div>
          <h1 className="page-title">
            Evaluate Teams — {selectedRoom.name || `Room ${selectedRoom.id}`}
          </h1>
          <div className="cards-row" style={{ flexWrap: 'wrap' }}>
            {displayTeams.map((team) => {
              const evaluated = evaluations.some((e) => e.teamId === team.id);
              return (
                <div
                  key={team.id}
                  className="team-select-card"
                  onClick={() => !evaluated && handleTeamSelect(team)}
                  style={evaluated ? { opacity: 0.6, cursor: 'default' } : {}}
                >
                  <div className="stat-icon" style={{ fontSize: '2rem' }}>
                    {evaluated ? '✅' : '👥'}
                  </div>
                  <div className="stat-value" style={{ fontSize: '1rem' }}>
                    {team.name || team.teamName || `Team ${team.id}`}
                  </div>
                  <div className="stat-label">
                    ID: {team.id} {evaluated ? '— Evaluated' : '— Click to evaluate'}
                  </div>
                </div>
              );
            })}
          </div>
          {displayTeams.length === 0 && (
            <p className="empty-state">No teams found in this room.</p>
          )}
        </div>
      );
    }

    // Team selected — show evaluation form
    return (
      <div>
        <h1 className="page-title">Evaluating Team</h1>

        <div className="evaluation-panel">
          {/* Team Info & Timer Row */}
          <div className="cards-row">
            <div className="info-card" style={{ flex: 1 }}>
              <div className="card-header">
                <h3>🏷️ Team Details</h3>
              </div>
              <div className="card-body">
                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.25rem 0' }}>
                  {selectedTeam.name || selectedTeam.teamName || `Team ${selectedTeam.id}`}
                </p>
                <p style={{ color: '#6b7280' }}>Team ID: {selectedTeam.id}</p>
                {selectedTeam.project && (
                  <p style={{ color: '#6b7280' }}>Project: {selectedTeam.project}</p>
                )}
              </div>
            </div>

            <div className="info-card" style={{ flex: 1 }}>
              <div className="card-header">
                <h3>⏱️ Evaluation Timer</h3>
              </div>
              <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
                <Timer initialMinutes={10} />
              </div>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="info-card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3>
                📝 Evaluation Criteria{' '}
                <span style={{ fontWeight: 400, fontSize: '0.9rem', color: '#6b7280' }}>
                  (Total: {currentTotal} / {maxPossibleScore})
                </span>
              </h3>
            </div>
            <div className="card-body">
              {evaluationCriteria && evaluationCriteria.length > 0 ? (
                evaluationCriteria.map((criterion) => (
                  <div className="criterion-row" key={criterion.id}>
                    <div style={{ flex: 1 }}>
                      <div className="criterion-name">{criterion.name}</div>
                      <div className="criterion-desc">
                        {criterion.description || 'No description provided.'}
                      </div>
                    </div>
                    <div className="criterion-score">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={scores[criterion.id] || 0}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                        style={{ width: '120px', marginRight: '0.75rem' }}
                      />
                      <input
                        type="number"
                        className="score-input"
                        min="0"
                        max="10"
                        value={scores[criterion.id] || 0}
                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                      />
                      <span style={{ marginLeft: '0.25rem', color: '#6b7280', fontSize: '0.85rem' }}>
                        /10
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No evaluation criteria defined.</p>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="info-card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3>💬 Remarks</h3>
            </div>
            <div className="card-body">
              <textarea
                className="remarks-textarea"
                placeholder="Enter your remarks about the team's performance..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button className="btn btn-success" onClick={handleSubmitEvaluation}>
              ✅ Submit Evaluation
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSelectedTeam(null);
                setScores({});
                setRemarks('');
              }}
            >
              ← Back to Team List
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── History Tab ─────────────────────────────────────────────
  const renderHistory = () => (
    <div>
      <h1 className="page-title">Evaluation History</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Filter by team name or ID..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {filteredEvaluations.length > 0 ? (
        <div className="info-card">
          <div className="card-header">
            <h3>📋 Completed Evaluations ({filteredEvaluations.length})</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Total Score</th>
                  <th>Remarks</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvaluations.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.teamId}</td>
                    <td>{ev.teamName}</td>
                    <td>
                      <strong>
                        {ev.totalScore} / {maxPossibleScore}
                      </strong>
                    </td>
                    <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ev.remarks || '—'}
                    </td>
                    <td>{new Date(ev.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="info-card">
          <div className="card-body">
            <p className="empty-state">
              {evaluations.length === 0
                ? 'No evaluations completed yet. Go to the Evaluate tab to start.'
                : 'No evaluations match your filter.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // ─── Render ──────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case 'evaluate':
        return renderEvaluate();
      case 'history':
        return renderHistory();
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default JuryDashboard;
