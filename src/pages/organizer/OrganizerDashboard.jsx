import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { teams, events, venues, evaluationCriteria, resultSheetColumns } from '../../data/mockData';

const OrganizerDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [venueData, setVenueData] = useState(venues || []);
  const [eventData, setEventData] = useState(events || []);
  const [resultSheet, setResultSheet] = useState([
    { rank: 1, teamId: 'T-001', teamName: 'CodeCrafters', venue: 'Block A - Room 101', juryName: 'Dr. Priya Mehta', totalScore: 45 },
    { rank: 2, teamId: 'T-003', teamName: 'ByteForce', venue: 'Block A - Room 102', juryName: 'Prof. Rajesh Kumar', totalScore: 42 },
    { rank: 3, teamId: 'T-005', teamName: 'DataMinds', venue: 'Block B - Room 201', juryName: 'Dr. Ananya Desai', totalScore: 39 },
    { rank: 4, teamId: 'T-002', teamName: 'InnoVate', venue: 'Block A - Room 101', juryName: 'Dr. Priya Mehta', totalScore: 37 },
    { rank: 5, teamId: 'T-006', teamName: 'AlgoStars', venue: 'Block B - Room 202', juryName: 'TBD', totalScore: 35 },
  ]);
  const [resultColumns, setResultColumns] = useState(
    resultSheetColumns || ['Rank', 'Team ID', 'Team Name', 'Venue', 'Jury Name', 'Total Score']
  );
  const [newColumnName, setNewColumnName] = useState('');
  const [rallyTeams, setRallyTeams] = useState([
    { round: 1, team: 'CodeCrafters', evaluator: 'Dr. Priya Mehta', venue: 'Block A - Room 101', status: 'Completed' },
    { round: 2, team: 'ByteForce', evaluator: 'Prof. Rajesh Kumar', venue: 'Block A - Room 102', status: 'Completed' },
    { round: 3, team: 'InnoVate', evaluator: 'Dr. Ananya Desai', venue: 'Block B - Room 201', status: 'In Progress' },
    { round: 4, team: 'DataMinds', evaluator: 'Dr. Priya Mehta', venue: 'Block B - Room 202', status: 'Pending' },
    { round: 5, team: 'AlgoStars', evaluator: 'TBD', venue: 'Block A - Room 101', status: 'Pending' },
  ]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);

  // Inline editing state for events
  const [editFormData, setEditFormData] = useState({});

  // New event form state
  const [showNewEventForm, setShowNewEventForm] = useState(false);
  const [newEventData, setNewEventData] = useState({
    name: '',
    maxTeams: '',
    minTeams: '',
    location: '',
    deadline: '',
    fees: '',
  });

  // New venue modal state
  const [newVenueData, setNewVenueData] = useState({ blockName: '', rooms: '' });

  // ── Stats ──
  const totalEvents = eventData.length;
  const totalTeams = teams ? teams.length : 0;
  const totalVenues = venueData.length;
  const totalRooms = useMemo(() => {
    return venueData.reduce((sum, v) => sum + (v.rooms ? v.rooms.length : 0), 0);
  }, [venueData]);

  // ── Recent activity mock ──
  const recentActivity = [
    { id: 1, text: 'Venue "Block C" was added to the system', time: '10 minutes ago', icon: '🏢' },
    { id: 2, text: 'Team "CodeCrafters" registered for Hackathon', time: '25 minutes ago', icon: '👥' },
    { id: 3, text: 'Result sheet generated for Round 2', time: '1 hour ago', icon: '📊' },
    { id: 4, text: 'Evaluator Rally Round 3 started', time: '2 hours ago', icon: '🔄' },
    { id: 5, text: 'Event "Code Sprint" deadline updated', time: '3 hours ago', icon: '📅' },
  ];

  // ── Handlers ──

  const handleAddColumn = () => {
    const trimmed = newColumnName.trim();
    if (trimmed && !resultColumns.includes(trimmed)) {
      setResultColumns([...resultColumns, trimmed]);
      setNewColumnName('');
    }
  };

  const handleRemoveColumn = (col) => {
    setResultColumns(resultColumns.filter((c) => c !== col));
  };

  const handleGenerateResults = () => {
    const shuffled = [...resultSheet].sort(() => Math.random() - 0.5);
    const rescored = shuffled.map((entry, idx) => ({
      ...entry,
      totalScore: Math.floor(Math.random() * 20) + 30,
    }));
    const sorted = rescored.sort((a, b) => b.totalScore - a.totalScore);
    const ranked = sorted.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    setResultSheet(ranked);
  };

  const handleExportResults = () => {
    alert('Results exported successfully! (simulated)');
  };

  const handleStartEditing = (evt) => {
    setEditingEvent(evt.id);
    setEditFormData({
      maxTeams: evt.maxTeams || '',
      minTeams: evt.minTeams || '',
      location: evt.location || evt.venue || '',
      deadline: evt.deadline || evt.registrationDeadline || '',
      fees: evt.fees || evt.participationFees || 0,
    });
  };

  const handleSaveEvent = (eventId) => {
    setEventData(
      eventData.map((evt) =>
        evt.id === eventId
          ? {
              ...evt,
              maxTeams: Number(editFormData.maxTeams) || evt.maxTeams,
              minTeams: Number(editFormData.minTeams) || evt.minTeams,
              location: editFormData.location || evt.location,
              venue: editFormData.location || evt.venue,
              deadline: editFormData.deadline || evt.deadline,
              registrationDeadline: editFormData.deadline || evt.registrationDeadline,
              fees: Number(editFormData.fees) || evt.fees,
              participationFees: Number(editFormData.fees) || evt.participationFees,
            }
          : evt
      )
    );
    setEditingEvent(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditFormData({});
  };

  const handleCreateEvent = () => {
    if (!newEventData.name.trim()) return;
    const newEvt = {
      id: `evt-${Date.now()}`,
      name: newEventData.name,
      status: 'Upcoming',
      maxTeams: Number(newEventData.maxTeams) || 10,
      minTeams: Number(newEventData.minTeams) || 2,
      location: newEventData.location || 'TBD',
      venue: newEventData.location || 'TBD',
      deadline: newEventData.deadline || 'TBD',
      registrationDeadline: newEventData.deadline || 'TBD',
      fees: Number(newEventData.fees) || 0,
      participationFees: Number(newEventData.fees) || 0,
    };
    setEventData([...eventData, newEvt]);
    setNewEventData({ name: '', maxTeams: '', minTeams: '', location: '', deadline: '', fees: '' });
    setShowNewEventForm(false);
  };

  const handleAddVenue = () => {
    if (!newVenueData.blockName.trim()) return;
    const newBlock = {
      id: `venue-${Date.now()}`,
      name: newVenueData.blockName,
      blockName: newVenueData.blockName,
      rooms: [],
    };
    setVenueData([...venueData, newBlock]);
    setNewVenueData({ blockName: '', rooms: '' });
    setShowAddVenueModal(false);
  };

  const handleAddRoom = (venueId) => {
    const roomNum = Math.floor(Math.random() * 300) + 100;
    setVenueData(
      venueData.map((v) =>
        v.id === venueId
          ? {
              ...v,
              rooms: [
                ...(v.rooms || []),
                {
                  id: `room-${Date.now()}`,
                  name: `Room ${roomNum}`,
                  capacity: 30,
                  tables: Math.floor(Math.random() * 5) + 3,
                  juryAssigned: 'Not Assigned',
                },
              ],
            }
          : v
      )
    );
  };

  const handleStartNewRound = () => {
    const nextRound = rallyTeams.length > 0 ? Math.max(...rallyTeams.map((r) => r.round)) + 1 : 1;
    setRallyTeams([
      ...rallyTeams,
      {
        round: nextRound,
        team: 'Unassigned',
        evaluator: 'TBD',
        venue: 'TBD',
        status: 'Pending',
      },
    ]);
  };

  const handleEndRally = () => {
    setRallyTeams(
      rallyTeams.map((r) =>
        r.status !== 'Completed' ? { ...r, status: 'Completed' } : r
      )
    );
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge';
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'active' || s === 'ongoing') return 'badge badge-success';
    if (s === 'in progress' || s === 'upcoming') return 'badge badge-warning';
    if (s === 'pending') return 'badge badge-info';
    return 'badge';
  };

  // ── Render Tabs ──

  const renderOverview = () => (
    <div className="tab-content">
      <h2 className="page-title">Dashboard Overview</h2>
      <p className="page-subtitle">Welcome back, {user?.name || 'Organizer'}. Here's a snapshot of your event management system.</p>

      <div className="cards-row">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{totalEvents}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{totalTeams}</div>
          <div className="stat-label">Total Teams</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-value">{totalVenues}</div>
          <div className="stat-label">Total Venues</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚪</div>
          <div className="stat-value">{totalRooms}</div>
          <div className="stat-label">Total Rooms</div>
        </div>
      </div>

      <div className="cards-row" style={{ alignItems: 'flex-start' }}>
        <div className="info-card" style={{ flex: 2 }}>
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="card-body">
            <ul className="activity-list">
              {recentActivity.map((item) => (
                <li key={item.id} className="activity-item">
                  <span className="activity-icon">{item.icon}</span>
                  <div className="activity-details">
                    <span className="activity-text">{item.text}</span>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="info-card" style={{ flex: 1 }}>
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowAddVenueModal(true);
                  setActiveTab('venues');
                }}
              >
                🏢 Add Venue
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  setShowNewEventForm(true);
                  setActiveTab('events');
                }}
              >
                📅 Create Event
              </button>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setActiveTab('results');
                  handleGenerateResults();
                }}
              >
                📊 Generate Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVenues = () => (
    <div className="tab-content">
      <div className="action-bar">
        <div>
          <h2 className="page-title">Venue Management</h2>
          <p className="page-subtitle">Manage blocks, rooms, tables, and jury assignments</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddVenueModal(true)}>
          + Add New Block
        </button>
      </div>

      {showAddVenueModal && (
        <div className="info-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <div className="card-header">
            <h3>Add New Block / Venue</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Block Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Block D"
                  value={newVenueData.blockName}
                  onChange={(e) => setNewVenueData({ ...newVenueData, blockName: e.target.value })}
                />
              </div>
            </div>
            <div className="card-actions">
              <button className="btn btn-primary" onClick={handleAddVenue}>
                Add Block
              </button>
              <button className="btn btn-outline" onClick={() => setShowAddVenueModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {venueData.length === 0 ? (
        <div className="empty-state">
          <p>No venues have been created yet.</p>
          <button className="btn btn-primary" onClick={() => setShowAddVenueModal(true)}>
            Add Your First Venue
          </button>
        </div>
      ) : (
        venueData.map((venue) => (
          <div className="info-card" key={venue.id} style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>{venue.blockName || venue.name}</h3>
              <span className="badge badge-info">{(venue.rooms || []).length} Rooms</span>
            </div>
            <div className="card-body">
              {(venue.rooms || []).length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Capacity</th>
                      <th>Tables</th>
                      <th>Jury Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(venue.rooms || []).map((room) => (
                      <tr key={room.id}>
                        <td>{room.name || room.roomName}</td>
                        <td>{room.capacity || '—'}</td>
                        <td>{room.tables || room.tableCount || '—'}</td>
                        <td>{room.juryAssigned || room.jury || 'Not Assigned'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No rooms added yet.</p>
              )}
            </div>
            <div className="card-actions">
              <button className="btn btn-sm btn-outline" onClick={() => handleAddRoom(venue.id)}>
                + Add Room
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="tab-content">
      <div className="action-bar">
        <div>
          <h2 className="page-title">Event Management</h2>
          <p className="page-subtitle">Configure event parameters, teams, locations, and deadlines</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewEventForm(true)}>
          + Create New Event
        </button>
      </div>

      {showNewEventForm && (
        <div className="info-card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--success)' }}>
          <div className="card-header">
            <h3>Create New Event</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Event Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Event name"
                  value={newEventData.name}
                  onChange={(e) => setNewEventData({ ...newEventData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Venue / Location"
                  value={newEventData.location}
                  onChange={(e) => setNewEventData({ ...newEventData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Max Teams</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max teams"
                  value={newEventData.maxTeams}
                  onChange={(e) => setNewEventData({ ...newEventData, maxTeams: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Min Teams</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min teams"
                  value={newEventData.minTeams}
                  onChange={(e) => setNewEventData({ ...newEventData, minTeams: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Registration Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={newEventData.deadline}
                  onChange={(e) => setNewEventData({ ...newEventData, deadline: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Participation Fees (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0"
                  value={newEventData.fees}
                  onChange={(e) => setNewEventData({ ...newEventData, fees: e.target.value })}
                />
              </div>
            </div>
            <div className="card-actions">
              <button className="btn btn-success" onClick={handleCreateEvent}>
                Create Event
              </button>
              <button className="btn btn-outline" onClick={() => setShowNewEventForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {eventData.length === 0 ? (
        <div className="empty-state">
          <p>No events found. Create your first event to get started.</p>
          <button className="btn btn-primary" onClick={() => setShowNewEventForm(true)}>
            Create Event
          </button>
        </div>
      ) : (
        <div className="info-card">
          <div className="card-body" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Max Teams</th>
                  <th>Min Teams</th>
                  <th>Location</th>
                  <th>Deadline</th>
                  <th>Fees (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((evt) => (
                  <tr key={evt.id}>
                    {editingEvent === evt.id ? (
                      <>
                        <td><strong>{evt.name}</strong></td>
                        <td><span className={getStatusBadgeClass(evt.status)}>{evt.status || 'N/A'}</span></td>
                        <td>
                          <input
                            type="number"
                            className="form-input inline-edit"
                            value={editFormData.maxTeams}
                            onChange={(e) => setEditFormData({ ...editFormData, maxTeams: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input inline-edit"
                            value={editFormData.minTeams}
                            onChange={(e) => setEditFormData({ ...editFormData, minTeams: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-input inline-edit"
                            value={editFormData.location}
                            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className="form-input inline-edit"
                            value={editFormData.deadline}
                            onChange={(e) => setEditFormData({ ...editFormData, deadline: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input inline-edit"
                            value={editFormData.fees}
                            onChange={(e) => setEditFormData({ ...editFormData, fees: e.target.value })}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-sm btn-success" onClick={() => handleSaveEvent(evt.id)}>Save</button>
                            <button className="btn btn-sm btn-outline" onClick={handleCancelEdit}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td><strong>{evt.name}</strong></td>
                        <td><span className={getStatusBadgeClass(evt.status)}>{evt.status || 'N/A'}</span></td>
                        <td>{evt.maxTeams || '—'}</td>
                        <td>{evt.minTeams || '—'}</td>
                        <td>{evt.location || evt.venue || '—'}</td>
                        <td>{evt.deadline || evt.registrationDeadline || '—'}</td>
                        <td>{evt.fees || evt.participationFees || 0}</td>
                        <td>
                          <button className="btn btn-sm btn-primary" onClick={() => handleStartEditing(evt)}>Edit</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderResults = () => (
    <div className="tab-content">
      <h2 className="page-title">Result Sheets</h2>
      <p className="page-subtitle">Configure result columns, generate and export result sheets</p>

      {/* Result Sheet Configuration */}
      <div className="info-card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h3>Result Sheet Configuration</h3>
        </div>
        <div className="card-body">
          <div className="column-chips">
            {resultColumns.map((col) => (
              <span key={col} className="column-chip">
                {col}
                <button
                  className="chip-remove"
                  onClick={() => handleRemoveColumn(col)}
                  title={`Remove ${col}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="form-row" style={{ marginTop: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Add Custom Column</label>
              <input
                type="text"
                className="form-input"
                placeholder="Column name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
              />
            </div>
            <div className="form-group" style={{ flex: 'none' }}>
              <button className="btn btn-primary" onClick={handleAddColumn}>
                + Add Column
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Sheet Table */}
      <div className="info-card">
        <div className="card-header">
          <h3>Result Sheet</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-sm btn-outline" onClick={handleExportResults}>
              📤 Export
            </button>
            <button className="btn btn-sm btn-success" onClick={handleGenerateResults}>
              🔄 Generate Results
            </button>
          </div>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          {resultSheet.length === 0 ? (
            <div className="empty-state">
              <p>No result data available. Click "Generate Results" to populate.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  {resultColumns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultSheet.map((entry, idx) => (
                  <tr key={idx}>
                    {resultColumns.map((col) => {
                      const keyMap = {
                        'Rank': 'rank',
                        'Team ID': 'teamId',
                        'Team Name': 'teamName',
                        'Venue': 'venue',
                        'Jury Name': 'juryName',
                        'Total Score': 'totalScore',
                      };
                      const dataKey = keyMap[col];
                      const value = dataKey ? entry[dataKey] : '—';
                      return (
                        <td key={col}>
                          {col === 'Rank' ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: value <= 3 ? 'var(--primary)' : 'var(--bg-secondary)',
                              color: value <= 3 ? '#fff' : 'var(--text-primary)',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                            }}>
                              {value}
                            </span>
                          ) : col === 'Total Score' ? (
                            <strong>{value}</strong>
                          ) : (
                            value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  const renderRally = () => (
    <div className="tab-content">
      <h2 className="page-title">Evaluator Rally</h2>
      <p className="page-subtitle">
        Rally allows organizers to track and manage evaluation rounds. Each round assigns a team to an evaluator at a specific venue for assessment.
      </p>

      <div className="action-bar" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleStartNewRound}>
            ▶ Start New Round
          </button>
          <button className="btn btn-danger" onClick={handleEndRally}>
            ⏹ End Rally
          </button>
        </div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <h3>Rally Rounds</h3>
          <span className="badge badge-info">{rallyTeams.length} Rounds</span>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          {rallyTeams.length === 0 ? (
            <div className="empty-state">
              <p>No rally rounds have been started yet.</p>
              <button className="btn btn-primary" onClick={handleStartNewRound}>
                Start First Round
              </button>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Round #</th>
                  <th>Team</th>
                  <th>Evaluator (Jury)</th>
                  <th>Venue</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rallyTeams.map((round, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>Round {round.round}</strong>
                    </td>
                    <td>{round.team}</td>
                    <td>{round.evaluator}</td>
                    <td>{round.venue}</td>
                    <td>
                      <span className={getStatusBadgeClass(round.status)}>
                        {round.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'venues':
        return renderVenues();
      case 'events':
        return renderEvents();
      case 'results':
        return renderResults();
      case 'rally':
        return renderRally();
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveTab()}
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
