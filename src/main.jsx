import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ClientReviewPortal from './ClientReviewPortal.jsx';
import './styles.css';

const isClientReviewPortal = window.location.pathname.replace(/\/+$/, '') === '/client-review';
createRoot(document.getElementById('root')).render(
  <React.StrictMode>{isClientReviewPortal ? <ClientReviewPortal /> : <App />}</React.StrictMode>
);
