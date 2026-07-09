import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: 'rgba(3,3,8,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Link to="/" className="font-display font-bold text-xl tracking-tight">
        <span className="gradient-text">Evite</span>
        <span className="text-slate-400 text-sm font-normal ml-1">✦</span>
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-slate-400 text-sm hidden sm:block">
              {user.username}
            </span>
            <Link to="/dashboard" className="btn-secondary text-sm py-2 px-4">
              Dashboard
            </Link>
            <Link to="/create" className="btn-primary text-sm py-2 px-4">
              + New Event
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition-colors ml-1">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white text-sm transition-colors">
              Sign in
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">
              Get started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
