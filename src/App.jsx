import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import ParticipantDashboard from './pages/participant/ParticipantDashboard'
import JuryDashboard from './pages/jury/JuryDashboard'
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard'
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/participant" element={<ProtectedRoute role="participant"><ParticipantDashboard /></ProtectedRoute>} />
      <Route path="/jury" element={<ProtectedRoute role="jury"><JuryDashboard /></ProtectedRoute>} />
      <Route path="/coordinator" element={<ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/organizer" element={<ProtectedRoute role="organizer"><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? `/${user.role}` : '/login'} />} />
    </Routes>
  )
}

export default App

