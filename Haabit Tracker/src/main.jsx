import App from './App.jsx'

import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <div className="app-container">
    <App />
  </div>
)
