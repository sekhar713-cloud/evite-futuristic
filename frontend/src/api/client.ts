import type { User, EventData, RSVP } from '../types'

const API_URL = import.meta.env.VITE_API_URL || ''

class ApiClient {
  private token: string | null = localStorage.getItem('evite_token')

  setToken(token: string) {
    this.token = token
    localStorage.setItem('evite_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('evite_token')
  }

  isAuthenticated() {
    return !!this.token
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (requiresAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body != null ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(err.detail || `Request failed (${res.status})`)
    }

    if (res.status === 204) return {} as T
    return res.json()
  }

  register(data: { email: string; username: string; password: string }) {
    return this.request<{ access_token: string; token_type: string }>('POST', '/auth/register', data, false)
  }

  login(data: { email: string; password: string }) {
    return this.request<{ access_token: string; token_type: string }>('POST', '/auth/login', data, false)
  }

  getMe() {
    return this.request<User>('GET', '/auth/me')
  }

  getMyEvents() {
    return this.request<EventData[]>('GET', '/events/')
  }

  createEvent(data: unknown) {
    return this.request<EventData>('POST', '/events/', data)
  }

  getEvent(slug: string) {
    return this.request<EventData>('GET', `/events/${slug}`, undefined, false)
  }

  updateEvent(slug: string, data: unknown) {
    return this.request<EventData>('PUT', `/events/${slug}`, data)
  }

  deleteEvent(slug: string) {
    return this.request<void>('DELETE', `/events/${slug}`)
  }

  submitRSVP(slug: string, data: unknown) {
    return this.request<RSVP>('POST', `/events/${slug}/rsvp`, data, false)
  }

  getEventRSVPs(slug: string) {
    return this.request<RSVP[]>('GET', `/events/${slug}/rsvps`)
  }
}

export const api = new ApiClient()
