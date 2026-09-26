import { useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import Campo from './Campo'

// Contraseña con el "ojito" para mostrarla u ocultarla
function CampoClave({ valor, alCambiar, placeholder = 'Contraseña', autoComplete = 'current-password', minimo }) {
  const [ver, setVer] = useState(false)
  return (
    <Campo icono={Lock}>
      <input type={ver ? 'text' : 'password'} placeholder={placeholder} required autoComplete={autoComplete}
        minLength={minimo} value={valor} onChange={(e) => alCambiar(e.target.value)} className="input pl-11 pr-11" />
      <button type="button" onClick={() => setVer((v) => !v)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-piedra hover:text-verde">
        {ver ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </Campo>
  )
}

export default CampoClave
