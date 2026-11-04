import { create } from 'zustand';
import { api } from '../api/client';

export const useEMSStore = create((set, get) => ({
  teams: [],
  events: [],
  venues: [],
  evaluations: [],
  loading: false,
  error: null,

  fetchInitialData: async () => {
    set({ loading: true, error: null });
    try {
      const [teams, events, venues, evaluations] = await Promise.all([
        api.getTeams().catch(() => []),
        api.getEvents().catch(() => []),
        api.getVenues().catch(() => []),
        api.getEvaluations().catch(() => [])
      ]);
      set({ teams, events, venues, evaluations, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTeams: async () => {
    try {
      const teams = await api.getTeams();
      set({ teams });
    } catch (err) {
      console.error(err);
    }
  },

  updateCredits: async (teamId, credits, status) => {
    try {
      const updated = await api.updateTeamCredits(teamId, credits, status);
      set({
        teams: get().teams.map((t) => (t.id === teamId ? updated : t))
      });
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchEvents: async () => {
    try {
      const events = await api.getEvents();
      set({ events });
    } catch (err) {
      console.error(err);
    }
  },

  addEvent: async (eventData) => {
    try {
      const created = await api.createEvent(eventData);
      set({ events: [...get().events, created] });
      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  modifyEvent: async (eventId, eventData) => {
    try {
      const updated = await api.updateEvent(eventId, eventData);
      set({
        events: get().events.map((e) => (e.id === eventId ? updated : e))
      });
      return updated;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  fetchVenues: async () => {
    try {
      const venues = await api.getVenues();
      set({ venues });
    } catch (err) {
      console.error(err);
    }
  },

  fetchEvaluations: async () => {
    try {
      const evaluations = await api.getEvaluations();
      set({ evaluations });
    } catch (err) {
      console.error(err);
    }
  },

  submitEvaluation: async (evalData) => {
    try {
      const created = await api.submitEvaluation(evalData);
      set({ evaluations: [created, ...get().evaluations] });
      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}));

