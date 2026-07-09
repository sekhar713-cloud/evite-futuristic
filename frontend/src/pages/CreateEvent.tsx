import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { api } from '../api/client'
import { EVENT_THEMES } from '../types'
import type { ThemeKey } from '../types'

const THEME_KEYS = Object.keys(EVENT_THEMES) as ThemeKey[]

export default function CreateEvent() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    location_url: '',
    cover_image_url: '',
    theme: 'cosmic' as ThemeKey,
    max_guests: '',
    is_public: true,
  })

  const set = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        event_date: new Date(form.event_date).toISOString(),
        max_guests: form.max_guests ? parseInt(form.max_guests) : null,
        description: form.description || null,
        location: form.location || null,
        location_url: form.location_url || null,
        cover_image_url: form.cover_image_url || null,
      }
      const event = await api.createEvent(payload)
      toast.success('Event created!')
      navigate(`/e/${event.slug}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const selectedTheme = EVENT_THEMES[form.theme]

  return (
    <div className="page-bg">
      <Navbar />
      <div
        className="orb animate-float"
        style={{ width: 500, height: 500, background: selectedTheme.accent, opacity: 0.08, top: -50, right: -100 }}
      />

      <div className="max-w-2xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Create an Event</h1>
          <p className="text-slate-400">Fill in the details and get a shareable invite link instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core details */}
          <div className="glass p-6 space-y-4">
            <h2 className="font-display font-semibold text-white text-lg mb-2">Event Details</h2>

            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Event Title *</label>
              <input
                className="input-field"
                placeholder="My Amazing Party"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Description</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Tell your guests what to expect…"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Date & Time *</label>
                <input
                  type="datetime-local"
                  className="input-field"
                  value={form.event_date}
                  onChange={(e) => set('event_date', e.target.value)}
                  required
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm block mb-1.5">Max Guests</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Unlimited"
                  value={form.max_guests}
                  onChange={(e) => set('max_guests', e.target.value)}
                  min={1}
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Location</label>
              <input
                className="input-field"
                placeholder="Rooftop at The Edge, NYC"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Location URL (Google Maps, etc.)</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://maps.google.com/…"
                value={form.location_url}
                onChange={(e) => set('location_url', e.target.value)}
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm block mb-1.5">Cover Image URL</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://… (optional)"
                value={form.cover_image_url}
                onChange={(e) => set('cover_image_url', e.target.value)}
              />
            </div>
          </div>

          {/* Theme picker */}
          <div className="glass p-6">
            <h2 className="font-display font-semibold text-white text-lg mb-4">Choose a Theme</h2>
            <div className="grid grid-cols-5 gap-3">
              {THEME_KEYS.map((key) => {
                const t = EVENT_THEMES[key]
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set('theme', key)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      form.theme === key
                        ? 'ring-2 ring-offset-2 ring-offset-transparent scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: `rgba(${hexToRgb(t.accent)}, 0.15)`,
                      border: `1px solid rgba(${hexToRgb(t.accent)}, 0.3)`,
                      ...(form.theme === key ? { ringColor: t.accent, borderColor: t.accent } : {}),
                    }}
                  >
                    <div className="text-xl mb-1">{t.emoji}</div>
                    <div className="text-xs text-slate-300">{t.name}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Visibility */}
          <div className="glass p-5 flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Public event</div>
              <div className="text-slate-400 text-sm">Anyone with the link can view and RSVP</div>
            </div>
            <button
              type="button"
              onClick={() => set('is_public', !form.is_public)}
              className={`w-12 h-6 rounded-full transition-all duration-200 relative ${
                form.is_public ? 'bg-violet-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                  form.is_public ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-4">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </span>
            ) : 'Create event & get invite link →'}
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
