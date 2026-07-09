export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface RSVPCounts {
  yes: number
  no: number
  maybe: number
}

export interface EventData {
  id: string
  slug: string
  title: string
  description?: string
  event_date: string
  location?: string
  location_url?: string
  cover_image_url?: string
  theme: string
  max_guests?: number
  is_public: boolean
  organizer_id: string
  organizer?: User
  created_at: string
  rsvp_counts?: RSVPCounts
}

export interface RSVP {
  id: string
  event_id: string
  name: string
  email: string
  status: 'yes' | 'no' | 'maybe'
  message?: string
  created_at: string
}

export const EVENT_THEMES = {
  cosmic: {
    name: 'Cosmic',
    gradient: 'from-violet-900 via-indigo-950 to-slate-950',
    accent: '#7c3aed',
    glow: 'rgba(124,58,237,0.4)',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    emoji: '🌌',
  },
  neon: {
    name: 'Neon',
    gradient: 'from-cyan-900 via-teal-950 to-slate-950',
    accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.4)',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    emoji: '⚡',
  },
  sunset: {
    name: 'Sunset',
    gradient: 'from-rose-900 via-orange-950 to-amber-950',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.4)',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    emoji: '🌅',
  },
  ocean: {
    name: 'Ocean',
    gradient: 'from-blue-900 via-cyan-950 to-slate-950',
    accent: '#0ea5e9',
    glow: 'rgba(14,165,233,0.4)',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    emoji: '🌊',
  },
  crystal: {
    name: 'Crystal',
    gradient: 'from-slate-700 via-slate-800 to-slate-950',
    accent: '#94a3b8',
    glow: 'rgba(148,163,184,0.3)',
    badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    emoji: '💎',
  },
} as const

export type ThemeKey = keyof typeof EVENT_THEMES
