import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function AuthSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const error = params.get('error')

    if (token) {
      api.setToken(token)
      navigate('/dashboard', { replace: true })
    } else {
      const msg = error === 'oauth_failed' ? 'Google sign-in failed. Please try again.'
        : error === 'no_profile' ? 'Could not retrieve your Google profile.'
        : 'Authentication failed.'
      navigate(`/login?error=${encodeURIComponent(msg)}`, { replace: true })
    }
  }, [navigate])

  return (
    <div className="page-bg flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Signing you in…</p>
      </div>
    </div>
  )
}
