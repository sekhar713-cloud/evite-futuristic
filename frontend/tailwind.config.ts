import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030308',
          900: '#080812',
          800: '#0d0d24',
          700: '#111132',
          600: '#1a1a4e',
        },
        neon: {
          purple: '#7c3aed',
          cyan: '#06b6d4',
          pink: '#ec4899',
          green: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite reverse',
        'float-fast': 'float 4s ease-in-out infinite 1s',
        glow: 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradientX 8s ease infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-24px)' },
        },
        glow: {
          from: { boxShadow: '0 0 20px rgba(124,58,237,0.4)' },
          to: { boxShadow: '0 0 50px rgba(124,58,237,0.8), 0 0 100px rgba(124,58,237,0.2)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
