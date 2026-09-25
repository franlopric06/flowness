import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './app/App.jsx'
import { activarVibracionGeneral } from './compartido/utilidades/vibracion'

// Todo lo que se toca vibra (botones, links, casillas…)
activarVibracionGeneral()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
