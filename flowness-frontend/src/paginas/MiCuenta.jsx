import { useState, useEffect } from 'react'
import { useVibrar } from '../hooks/useVibrar'
import { obtenerClases } from '../servicios/api'

function MiCuenta() {
  const [misClases, setMisClases] = useState([])
  const vibrar = useVibrar()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    obtenerClases()
      .then(clases => setMisClases(clases.filter(c => c.tieneAcceso)))
      .catch(() => {})
  }, [])

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-2">Hola, {usuario.nombre}</h1>
      <p className="text-[#A9A9A2] text-sm mb-10">Tus clases desbloqueadas:</p>
      {misClases.length === 0 ? (
        <p className="text-[#A9A9A2]">Todavía no tenés clases. <a href="/clases" onClick={vibrar} className="text-[#7B9B77] underline">Ver clases disponibles</a></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
          {misClases.map(clase => (
            <div key={clase.id} className="bg-white rounded-2xl p-5 border border-[#7B9B77]/20">
              <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">{clase.fase?.nombre}</p>
              <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase">{clase.nombre}</h3>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default MiCuenta
