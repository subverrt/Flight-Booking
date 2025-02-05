import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.css';
import App from './App.jsx';
import AuthProvider from './AuthContext.jsx'; // Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
