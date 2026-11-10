import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './prompted-experience.css';
import './liquid-current.css';

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
