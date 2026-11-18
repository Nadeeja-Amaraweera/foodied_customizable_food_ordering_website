import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Enable manual history scroll restoration for route-aware transitions
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="174664322103-ir3gugfbed8te3hb4t62gq0c2htmtg1l.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
