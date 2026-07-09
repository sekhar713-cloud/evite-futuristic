import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const FEATURES = [
  {
    icon: '✦',
    title: 'Stunning Themes',
    desc: 'Choose from Cosmic, Neon, Sunset, Ocean, and Crystal — every invite feels like an experience.',
  },
  {
    icon: '⚡',
    title: 'Instant RSVPs',
    desc: 'Guests respond in seconds. No account required. Real-time counts on your dashboard.',
  },
  {
    icon: '🔗',
    title: 'Shareable Links',
    desc: 'Every event gets a unique URL. Share it anywhere — DM, email, social. Zero friction.',
  },
  {
    icon: '📊',
    title: 'Live Dashboard',
    desc: 'Track who\'s coming, who\'s maybe, who\'s out. All your events in one beautiful view.',
  },
  {
    icon: '🌐',
    title: 'Works Everywhere',
    desc: 'Pixel-perfect on phone, tablet, or desktop. Your guests see it beautifully regardless.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    desc: 'JWT auth, bcrypt passwords, optional private events. Your data stays yours.',
  },
]

export default function Landing() {
  return (
    <div className="page-bg">
      <Navbar />

      {/* Orbs */}
      <div
        className="orb animate-float"
        style={{ width: 700, height: 700, background: '#7c3aed', opacity: 0.12, top: -200, left: -200 }}
      />
      <div
        className="orb animate-float-slow"
        style={{ width: 500, height: 500, background: '#06b6d4', opacity: 0.1, top: 100, right: -150 }}
      />
      <div
        className="orb animate-float-fast"
        style={{ width: 400, height: 400, background: '#ec4899', opacity: 0.08, bottom: 200, left: '40%' }}
      />

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-36 pb-24">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full mb-8"
          style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#a78bfa',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          The future of digital invitations is here
        </div>

        <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl mb-6 leading-none tracking-tight">
          Invitations,
          <br />
          <span className="gradient-text">Reimagined.</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          Create stunning event invites in seconds. Track RSVPs in real time.
          Make every event feel like the future.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/register" className="btn-primary text-base px-8 py-4">
            Create your first event →
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-4">
            Sign in
          </Link>
        </div>

        {/* Mock invite card */}
        <div className="mt-20 relative max-w-sm w-full">
          <div
            className="glass rounded-3xl overflow-hidden"
            style={{ boxShadow: '0 0 60px rgba(124,58,237,0.2), 0 0 120px rgba(124,58,237,0.05)' }}
          >
            <div className="h-40 bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-950 flex items-center justify-center">
              <span className="text-6xl animate-float" style={{ display: 'inline-block' }}>🌌</span>
            </div>
            <div className="p-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: 'rgba(124,58,237,0.2)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#a78bfa',
                  }}
                >
                  Cosmic ✦
                </span>
              </div>
              <h3 className="font-display font-bold text-xl text-white mt-3 mb-1">New Year's Eve 2025</h3>
              <p className="text-slate-400 text-sm">📅 Dec 31, 2025 · 9:00 PM</p>
              <p className="text-slate-400 text-sm">📍 Rooftop at The Edge, NYC</p>
              <div className="flex gap-3 mt-4 text-xs">
                <span className="text-emerald-400">✓ 42 going</span>
                <span className="text-slate-400">? 8 maybe</span>
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 rounded-full"
            style={{ background: 'rgba(124,58,237,0.3)', filter: 'blur(30px)' }}
          />
        </div>
      </section>

      {/* Features */}
      <section className="relative px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Everything you need to host in style
          </h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">
            Powerful features wrapped in a beautiful, minimal interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-hover p-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}
              >
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 py-24 text-center">
        <div
          className="glass max-w-2xl mx-auto p-12 rounded-3xl"
          style={{ boxShadow: '0 0 80px rgba(124,58,237,0.1)' }}
        >
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Ready to host something
            <span className="gradient-text"> unforgettable?</span>
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of hosts creating next-gen invites.</p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Start for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-8 text-slate-600 text-sm"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        Built with ✦ by Evite Futuristic &nbsp;·&nbsp; Open Source
      </footer>
    </div>
  )
}
