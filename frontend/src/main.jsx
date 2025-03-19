import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProfileProvider } from "./context/ProfileContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>
    <AuthProvider>
    <App />
    </AuthProvider>
    </ProfileProvider>
  </StrictMode>,
)
