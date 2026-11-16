import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="174664322103-ir3gugfbed8te3hb4t62gq0c2htmtg1l.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
