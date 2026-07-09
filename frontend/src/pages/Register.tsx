import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await register(email, username, password)
      toast.success('Account created! Let\'s make your first event.')
      navigate('/create')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4">
      <div
        className="orb animate-float"
        style={{ width: 500, height: 500, background: '#ec4899', opacity: 0.1, top: -100, right: -100 }}
      />
      <div
        className="orb animate-float-slow"
        style={{ width: 400, height: 400, background: '#7c3aed', opacity: 0.1, bottom: -100, left: -100 }}
      />

      <div className="glass w-full max-w-md p-8 animate-slide-up relative">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-bold text-2xl gradient-text">
            Evite ✦
          </Link>
          <h1 className="font-display font-semibold text-2xl text-white mt-4 mb-1">
            Create your account
          </h1>
          <p className="text-slate-400 text-sm">Free forever · No credit card needed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="coolhost"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account…
              </span>
            ) : 'Create account →'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
