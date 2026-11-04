const API_BASE = 'http://localhost:8000/api/v1';

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  // Participant
  getParticipantVenue: async (teamOrUserId) => {
    const res = await fetch(`${API_BASE}/participants/${teamOrUserId}/venue`);
    if (!res.ok) throw new Error('Failed to fetch participant venue allocation');
    return res.json();
  },

  // Teams
  getTeams: async () => {
    const res = await fetch(`${API_BASE}/teams`);
    if (!res.ok) throw new Error('Failed to fetch teams');
    return res.json();
  },

  updateTeamCredits: async (teamId, credits, status) => {
    const res = await fetch(`${API_BASE}/teams/${teamId}/credits`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credits, status })
    });
    if (!res.ok) throw new Error('Failed to update team credits');
    return res.json();
  },

  // Events
  getEvents: async () => {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  createEvent: async (eventData) => {
    const res = await fetch(`${API_BASE}/organizer/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
  },

  updateEvent: async (eventId, eventData) => {
    const res = await fetch(`${API_BASE}/organizer/event/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    if (!res.ok) throw new Error('Failed to update event');
    return res.json();
  },

  // Venues
  getVenues: async () => {
    const res = await fetch(`${API_BASE}/venues`);
    if (!res.ok) throw new Error('Failed to fetch venues');
    return res.json();
  },

  // Evaluations (Jury)
  getEvaluations: async () => {
    const res = await fetch(`${API_BASE}/evaluations`);
    if (!res.ok) throw new Error('Failed to fetch evaluations');
    return res.json();
  },

  submitEvaluation: async (evalData) => {
    const res = await fetch(`${API_BASE}/evaluations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evalData)
    });
    if (!res.ok) throw new Error('Failed to submit evaluation');
    return res.json();
  }
};
