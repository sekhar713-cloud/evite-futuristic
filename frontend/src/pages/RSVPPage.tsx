import { useState, useEffect, FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { EVENT_THEMES } from '../types'
import type { EventData } from '../types'

type Status = 'yes' | 'no' | 'maybe'

const STATUS_OPTIONS: { value: Status; label: string; icon: string; color: string }[] = [
  { value: 'yes', label: "I'll be there!", icon: '🎉', color: 'emerald' },
  { value: 'maybe', label: 'Maybe', icon: '🤔', color: 'amber' },
  { value: 'no', label: "Can't make it", icon: '😔', color: 'red' },
]

export default function RSVPPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('yes')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!slug) return
    api.getEvent(slug)
      .then(setEvent)
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!slug) return
    setSubmitting(true)
    try {
      await api.submitRSVP(slug, { name, email, status, message: message || null })
      setSubmitted(true)
      toast.success('RSVP submitted!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit RSVP')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-bg flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="page-bg flex items-center justify-center min-h-screen text-center px-4">
        <div>
          <div className="text-6xl mb-4">🌌</div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">Event not found</h1>
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    )
  }

  const theme = EVENT_THEMES[event.theme as keyof typeof EVENT_THEMES] ?? EVENT_THEMES.cosmic

  if (submitted) {
    return (
      <div className="page-bg flex items-center justify-center min-h-screen px-4">
        <div
          className="orb animate-float"
          style={{ width: 400, height: 400, background: theme.accent, opacity: 0.15, top: -100, left: '30%' }}
        />
        <div className="glass max-w-md w-full p-10 text-center animate-slide-up">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: `rgba(${hexToRgb(theme.accent)}, 0.15)`, border: `1px solid rgba(${hexToRgb(theme.accent)}, 0.3)` }}
          >
            {status === 'yes' ? '🎉' : status === 'maybe' ? '🤔' : '😔'}
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-2">
            {status === 'yes' ? "You're going!" : status === 'maybe' ? 'Noted!' : 'No worries!'}
          </h1>
          <p className="text-slate-400 mb-2">
            {status === 'yes'
              ? `See you at ${event.title}!`
              : status === 'maybe'
              ? 'We hope you can make it.'
              : 'Thanks for letting us know.'}
          </p>
          <p className="text-slate-500 text-sm mb-8">
            {format(new Date(event.event_date), 'MMMM d, yyyy · h:mm a')}
          </p>
          <div className="flex gap-3">
            <Link to={`/e/${event.slug}`} className="btn-secondary flex-1 text-center py-3 text-sm">
              View event
            </Link>
            <Link to="/" className="btn-primary flex-1 text-center py-3 text-sm">
              Create yours →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg flex items-center justify-center min-h-screen px-4 py-16">
      <div
        className="orb animate-float"
        style={{ width: 400, height: 400, background: theme.accent, opacity: 0.1, top: -100, right: -50 }}
      />

      <div className="glass max-w-md w-full p-8 animate-slide-up">
        {/* Event summary */}
        <Link to={`/e/${event.slug}`} className="flex items-center gap-3 mb-6 group">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-xl flex-shrink-0`}
          >
            {theme.emoji}
          </div>
          <div>
            <div className="text-white font-semibold group-hover:text-violet-300 transition-colors">
              {event.title}
            </div>
            <div className="text-slate-400 text-sm">
              {format(new Date(event.event_date), 'MMM d, yyyy · h:mm a')}
            </div>
          </div>
        </Link>

        <div className="border-t border-white/10 pt-6 mb-6">
          <h1 className="font-display font-bold text-xl text-white mb-1">RSVP</h1>
          <p className="text-slate-400 text-sm">Let the host know if you're coming</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Your name *</label>
            <input
              className="input-field"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1.5">Email *</label>
            <input
              type="email"
              className="input-field"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Status selector */}
          <div>
            <label className="text-slate-300 text-sm block mb-2">Will you be attending? *</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`p-3 rounded-xl text-center text-sm transition-all duration-200 border ${
                    status === opt.value
                      ? opt.color === 'emerald'
                        ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 scale-105'
                        : opt.color === 'amber'
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 scale-105'
                        : 'bg-red-500/20 border-red-500/60 text-red-300 scale-105'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/8'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="font-medium text-xs">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm block mb-1.5">
              Message to host <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              className="input-field resize-none"
              rows={2}
              placeholder="Looking forward to it!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-base mt-2">
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting…
              </span>
            ) : 'Send RSVP →'}
          </button>
        </form>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
