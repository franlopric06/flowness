import { useState, useEffect } from 'react'
import { obtenerDatosPublicos } from '../servicios/api'

function Galeria() {
  const [fotos, setFotos] = useState([])

  useEffect(() => {
    obtenerDatosPublicos().then(d => setFotos(d.fotos)).catch(() => {})
  }, [])

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Momentos</p>
      <h1 className="text-[#7B9B77] text-3xl font-bold text-center tracking-widest mb-10">Galería</h1>
      {fotos.length === 0 ? (
        <p className="text-center text-[#A9A9A2]">Próximamente habrá fotos disponibles.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
          {fotos.map(foto => (
            <img key={foto.id} src={foto.url} alt={foto.descripcion || ''} className="w-full h-48 object-cover rounded-xl" />
          ))}
        </div>
      )}
    </main>
  )
}

export default Galeria
