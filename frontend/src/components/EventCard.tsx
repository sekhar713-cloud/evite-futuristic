import { Link } from 'react-router-dom'
import { format, isPast } from 'date-fns'
import type { EventData } from '../types'
import { EVENT_THEMES } from '../types'

interface Props {
  event: EventData
  onDelete?: (slug: string) => void
}

export default function EventCard({ event, onDelete }: Props) {
  const theme = EVENT_THEMES[event.theme as keyof typeof EVENT_THEMES] ?? EVENT_THEMES.cosmic
  const past = isPast(new Date(event.event_date))
  const total = event.rsvp_counts ? Object.values(event.rsvp_counts).reduce((a, b) => a + b, 0) : 0

  return (
    <div
      className="glass-hover relative overflow-hidden group"
      style={{ borderRadius: '20px' }}
    >
      {/* Colored top bar */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${theme.accent}, transparent)` }}
      />

      {/* Cover image */}
      {event.cover_image_url ? (
        <div className="h-36 overflow-hidden">
          <img
            src={event.cover_image_url}
            alt={event.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          />
        </div>
      ) : (
        <div
          className={`h-36 bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
        >
          <span className="text-5xl opacity-40">{theme.emoji}</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-display font-semibold text-lg text-white leading-tight line-clamp-1">
            {event.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full border flex-shrink-0 ${theme.badge}`}>
            {theme.name}
          </span>
        </div>

        <div className="space-y-1.5 mb-4">
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <span>📅</span>
            <span className={past ? 'line-through opacity-50' : ''}>
              {format(new Date(event.event_date), 'MMM d, yyyy · h:mm a')}
            </span>
            {past && <span className="text-xs text-slate-500 no-underline">(ended)</span>}
          </p>
          {event.location && (
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span>📍</span>
              <span className="line-clamp-1">{event.location}</span>
            </p>
          )}
        </div>

        {/* RSVP counts */}
        {event.rsvp_counts && (
          <div className="flex gap-3 mb-4 text-xs">
            <span className="text-emerald-400">✓ {event.rsvp_counts.yes} going</span>
            <span className="text-slate-400">? {event.rsvp_counts.maybe} maybe</span>
            <span className="text-red-400">✗ {event.rsvp_counts.no} declined</span>
            {total === 0 && <span className="text-slate-500">No RSVPs yet</span>}
          </div>
        )}

        <div className="flex gap-2">
          <Link
            to={`/e/${event.slug}`}
            className="flex-1 text-center text-sm py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200"
          >
            View invite
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(event.slug)}
              className="text-sm py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all duration-200"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
