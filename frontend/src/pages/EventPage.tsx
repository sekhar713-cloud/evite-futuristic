import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { api } from '../api/client'
import { EVENT_THEMES } from '../types'
import type { EventData, RSVP } from '../types'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import toast from 'react-hot-toast'

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventData | null>(null)
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!slug) return
    api.getEvent(slug)
      .then(setEvent)
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!event || !user || event.organizer_id !== user.id) return
    api.getEventRSVPs(slug!).then(setRsvps).catch(() => {})
  }, [event, user, slug])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied!')
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
          <p className="text-slate-400 mb-6">This invite link may be invalid or the event was deleted.</p>
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    )
  }

  const theme = EVENT_THEMES[event.theme as keyof typeof EVENT_THEMES] ?? EVENT_THEMES.cosmic
  const eventDate = new Date(event.event_date)
  const past = isPast(eventDate)
  const isOrganizer = user?.id === event.organizer_id
  const totalYes = event.rsvp_counts?.yes ?? 0
  const totalMaybe = event.rsvp_counts?.maybe ?? 0
  const totalNo = event.rsvp_counts?.no ?? 0
  const total = totalYes + totalMaybe + totalNo

  return (
    <div className="page-bg">
      <Navbar />

      {/* Hero */}
      <div
        className={`relative w-full min-h-[40vh] bg-gradient-to-br ${theme.gradient} flex flex-col items-center justify-end pb-12 pt-32 px-6 text-center overflow-hidden`}
      >
        {/* Orbs */}
        <div
          className="orb animate-float absolute"
          style={{ width: 400, height: 400, background: theme.accent, opacity: 0.2, top: -100, left: '20%' }}
        />
        <div
          className="orb animate-float-slow absolute"
          style={{ width: 300, height: 300, background: theme.accent, opacity: 0.15, bottom: -50, right: '15%' }}
        />

        {event.cover_image_url && (
          <img
            src={event.cover_image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        )}

        <div className="relative z-10">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border mb-4 ${theme.badge}`}
          >
            {theme.emoji} {theme.name}
            {past && <span className="opacity-60 ml-1">· Ended</span>}
          </span>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
            {event.title}
          </h1>

          {event.description && (
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">{event.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">

        {/* Date, Location, Countdown */}
        <div className="glass p-6 grid sm:grid-cols-2 gap-6">
          <div>
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Date & Time</div>
            <div className="font-display font-semibold text-white text-lg">
              {format(eventDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <div className="text-slate-300">{format(eventDate, 'h:mm a')}</div>
            {!past && (
              <div
                className="mt-2 text-xs px-2 py-1 rounded-full inline-block"
                style={{ background: `rgba(${hexToRgb(theme.accent)}, 0.15)`, color: theme.accent }}
              >
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </div>
            )}
          </div>

          {event.location && (
            <div>
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-2">Location</div>
              <div className="font-display font-semibold text-white text-lg">{event.location}</div>
              {event.location_url && (
                <a
                  href={event.location_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm mt-1 inline-block transition-colors"
                  style={{ color: theme.accent }}
                >
                  View on map →
                </a>
              )}
            </div>
          )}
        </div>

        {/* RSVP counts */}
        {total > 0 && (
          <div className="glass p-6">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-4">RSVPs</div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-emerald-400">{totalYes}</div>
                <div className="text-slate-400 text-sm">Going</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-amber-400">{totalMaybe}</div>
                <div className="text-slate-400 text-sm">Maybe</div>
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-red-400">{totalNo}</div>
                <div className="text-slate-400 text-sm">Can't go</div>
              </div>
            </div>
            {event.max_guests && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>{totalYes} confirmed</span>
                  <span>{event.max_guests} max</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totalYes / event.max_guests) * 100)}%`,
                      background: theme.accent,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        {!past && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/e/${event.slug}/rsvp`}
              className="btn-primary flex-1 text-center text-base py-4"
            >
              RSVP to this event →
            </Link>
            <button onClick={copyLink} className="btn-secondary flex-1 text-center py-4">
              {copied ? '✓ Copied!' : '🔗 Copy invite link'}
            </button>
          </div>
        )}

        {past && (
          <button onClick={copyLink} className="btn-secondary w-full py-4">
            {copied ? '✓ Copied!' : '🔗 Copy invite link'}
          </button>
        )}

        {/* Organizer: RSVP list */}
        {isOrganizer && rsvps.length > 0 && (
          <div className="glass p-6">
            <div className="text-slate-400 text-xs uppercase tracking-wider mb-4">
              Guest List ({rsvps.length})
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {rsvps.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white font-medium text-sm">{r.name}</div>
                    <div className="text-slate-500 text-xs">{r.email}</div>
                    {r.message && <div className="text-slate-400 text-xs mt-0.5 italic">"{r.message}"</div>}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.status === 'yes' ? 'bg-emerald-500/20 text-emerald-400' :
                      r.status === 'maybe' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {r.status === 'yes' ? 'Going' : r.status === 'maybe' ? 'Maybe' : 'Can\'t go'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link to="/" className="text-slate-500 hover:text-slate-400 text-sm transition-colors">
            Powered by Evite ✦
          </Link>
        </div>
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
