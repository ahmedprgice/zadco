import React from 'react'
import ReactDOM from 'react-dom/client'
import { flushSync } from 'react-dom'
import App from './App'
import './index.css'
import './industrial-decor.css'

// Mount before the browser captures the incoming page for its transition.
flushSync(() => {
  const root = document.getElementById('root')!
  const app = <React.StrictMode><App /></React.StrictMode>
  // Query-specific forms and filters differ from the canonical pre-rendered page.
  if (root.hasChildNodes() && !window.location.search) ReactDOM.hydrateRoot(root, app)
  else ReactDOM.createRoot(root).render(app)
})
