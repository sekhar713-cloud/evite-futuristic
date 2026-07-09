import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { useAuth } from '../hooks/useAuth'
import { api } from '../api/client'
import type { EventData } from '../types'

export default function Dashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getMyEvents()
      .then(setEvents)
      .catch(() => toast.error('Failed to load events'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this event and all its RSVPs?')) return
    try {
      await api.deleteEvent(slug)
      setEvents((prev) => prev.filter((e) => e.slug !== slug))
      toast.success('Event deleted')
    } catch {
      toast.error('Failed to delete event')
    }
  }

  const totalYes = events.reduce((s, e) => s + (e.rsvp_counts?.yes ?? 0), 0)
  const totalEvents = events.length
  const upcomingCount = events.filter((e) => new Date(e.event_date) > new Date()).length

  return (
    <div className="page-bg">
      <Navbar />
      <div
        className="orb"
        style={{ width: 600, height: 600, background: '#7c3aed', opacity: 0.07, top: -100, right: -100 }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-1">
              Welcome back, <span className="gradient-text">{user?.username}</span>
            </h1>
            <p className="text-slate-400">Manage your events and track responses</p>
          </div>
          <Link to="/create" className="btn-primary hidden sm:inline-flex">
            + New Event
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Events', value: totalEvents, icon: '🗓' },
            { label: 'Upcoming', value: upcomingCount, icon: '🚀' },
            { label: 'Total Attending', value: totalYes, icon: '✓' },
          ].map((stat) => (
            <div key={stat.label} className="glass p-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-3xl text-white">{stat.value}</div>
              <div className="text-slate-400 text-sm mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="glass p-16 text-center rounded-3xl">
            <div className="text-5xl mb-4">🌌</div>
            <h2 className="font-display font-semibold text-xl text-white mb-2">
              No events yet
            </h2>
            <p className="text-slate-400 mb-6">Create your first stunning invitation</p>
            <Link to="/create" className="btn-primary">
              Create your first event →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Mobile CTA */}
        {events.length > 0 && (
          <div className="mt-8 sm:hidden">
            <Link to="/create" className="btn-primary w-full text-center block">
              + New Event
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
