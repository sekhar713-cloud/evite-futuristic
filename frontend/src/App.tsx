import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext, useAuthProvider } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EventPage from './pages/EventPage'
import RSVPPage from './pages/RSVPPage'
import AuthSuccess from './pages/AuthSuccess'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = React.useContext(AuthContext)
  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const auth = useAuthProvider()

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/e/:slug" element={<EventPage />} />
          <Route path="/e/:slug/rsvp" element={<RSVPPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
