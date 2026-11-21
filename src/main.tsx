import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// The Nocturne token sheet is the source of truth for every color, font,
// spacing, radius, and shadow value; app.css only adds what it does not cover.
import '../styles.css';
import './app.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
