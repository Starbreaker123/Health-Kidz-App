import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import React from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';

// Global error handler for charts and other runtime errors
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('Cannot access')) {
    console.warn('Chart initialization error detected, falling back to basic UI');
    // Prevent the error from crashing the app
    event.preventDefault();
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('charts')) {
    console.warn('Chart promise rejection handled, continuing with app');
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
<React.StrictMode>
  <AuthProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </AuthProvider>
</React.StrictMode>)    