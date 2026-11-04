import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useEMSStore } from '../../store/emsStore';
import { api } from '../../api/client';
import './ParticipantDashboard.css';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [participantData, setParticipantData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { teams, events } = useEMSStore();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        if (user?.teamId || user?.id) {
          const res = await api.getParticipantVenue(user.teamId || user.id);
          if (isMounted) setParticipantData(res);
        }
      } catch (err) {
        console.error('Could not fetch participant venue endpoint, using store fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [user]);

  // Fallback to store if direct endpoint hasn't resolved
  const team = participantData || teams.find(t => t.id === user?.teamId);
  const event = events.find(e => e.id === team?.event);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="participant-dashboard">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>Welcome back, {user?.name || 'Participant'}! 👋</h1>
            <p>Here's your live event registration summary and venue allocation details from the database.</p>
          </div>
        </div>

        {/* Status Cards Row */}
        <div className="cards-row">
          <div className={`stat-card status-card ${team?.registrationStatus === 'confirmed' ? 'status-confirmed' : 'status-pending'}`}>
            <div className="stat-icon">
              {team?.registrationStatus === 'confirmed' ? '✅' : '⏳'}
            </div>
            <div className="stat-value">
              {team?.registrationStatus === 'confirmed' ? 'Confirmed' : 'Pending'}
            </div>
            <div className="stat-label">Registration Status</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏷️</div>
            <div className="stat-value">{team?.teamId || team?.id || '—'}</div>
            <div className="stat-label">Team ID</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{participantData?.eventName || event?.name || '—'}</div>
            <div className="stat-label">Event Name</div>
          </div>
        </div>

        {/* Venue Card */}
        <h2 className="page-title">Your Venue & Table</h2>
        <div className="venue-card">
          <div className="venue-grid">
            <div className="venue-item">
              <div className="venue-item-label">Block</div>
              <div className="venue-item-value">{team?.venue || '—'}</div>
            </div>
            <div className="venue-item">
              <div className="venue-item-label">Room</div>
              <div className="venue-item-value">{team?.room || '—'}</div>
            </div>
            <div className="venue-item venue-table-highlight">
              <div className="venue-item-label">Table Number</div>
              <div className="venue-table-number">{team?.table || '—'}</div>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="cards-row cards-row-bottom">
          {/* Team Info Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>🧑‍🤝‍🧑 Team Info</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Team Name</span>
                <span className="info-value">{participantData?.teamName || team?.name || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Members</span>
                <div className="members-list">
                  {team?.members?.length > 0
                    ? team.members.map((member, idx) => (
                        <span className="badge" key={idx}>{member}</span>
                      ))
                    : <span className="info-value">—</span>
                  }
                </div>
              </div>
              <div className="info-row">
                <span className="info-label">Fee Status</span>
                <span className="info-value">
                  {team?.feePaid ? 'Paid ✅' : 'Unpaid ❌'}
                </span>
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <div className="info-card">
            <div className="card-header">
              <h3>📋 Event Details</h3>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">Description</span>
                <span className="info-value">{participantData?.eventDescription || event?.description || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location</span>
                <span className="info-value">{participantData?.location || event?.location || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Deadline</span>
                <span className="info-value">{participantData?.registrationDeadline || event?.registrationDeadline || '—'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Fees</span>
                <span className="info-value">{participantData?.participationFees || event?.participationFees ? `₹${participantData?.participationFees || event?.participationFees}` : 'Free'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParticipantDashboard;
