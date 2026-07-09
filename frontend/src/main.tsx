import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0d0d24',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(16px)',
        },
        success: { iconTheme: { primary: '#7c3aed', secondary: '#f8fafc' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
      }}
    />
  </React.StrictMode>
)
