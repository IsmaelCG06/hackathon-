import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext'
import { OpportunitiesProvider } from './data/OpportunitiesContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <OpportunitiesProvider>
        <App />
      </OpportunitiesProvider>
    </AuthProvider>
  </StrictMode>,
)
