import { useState, useEffect } from 'react'
import { useVibrar } from '../hooks/useVibrar'
import { obtenerClases, crearPreferencia } from '../servicios/api'

function Clases() {
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [claseSeleccionada, setClaseSeleccionada] = useState(null)
  const vibrar = useVibrar()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { setCargando(false); return }
    obtenerClases()
      .then(setClases)
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  const comprar = async (claseId) => {
    vibrar()
    try {
      const { init_point } = await crearPreferencia(claseId)
      window.location.href = init_point
    } catch {
      alert('Error al procesar el pago')
    }
  }

  if (!token) {
    return (
      <main className="pt-32 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-4">Acceso requerido</p>
        <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-4">Clases de Flowness</h1>
        <p className="text-[#A9A9A2] text-sm mb-8">Registrate o ingresá para ver las clases disponibles.</p>
        <a href="/ingresar" onClick={vibrar} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
          Ingresar
        </a>
      </main>
    )
  }

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Contenido exclusivo</p>
      <h1 className="text-[#7B9B77] text-3xl md:text-4xl font-bold text-center tracking-widest mb-10">Clases</h1>

      {cargando ? (
        <p className="text-center text-[#A9A9A2]">Cargando clases...</p>
      ) : clases.length === 0 ? (
        <p className="text-center text-[#A9A9A2]">Próximamente habrá clases disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {clases.map((clase) => (
            <div key={clase.id} className="bg-white rounded-2xl overflow-hidden border border-[#D8A48F]/20 shadow-sm">
              <div className="p-5">
                <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">{clase.fase?.nombre}</p>
                <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-2">{clase.nombre}</h3>
                <p className="text-[#A9A9A2] text-xs leading-relaxed mb-4">{clase.descripcion}</p>

                {clase.tieneAcceso ? (
                  <button
                    onClick={() => { vibrar(); setClaseSeleccionada(clase) }}
                    className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#5a7a56] transition-colors"
                  >
                    Ver clase
                  </button>
                ) : clase.esGratis ? (
                  <button
                    onClick={() => { vibrar(); setClaseSeleccionada(clase) }}
                    className="w-full bg-[#D8A48F] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:opacity-80 transition-colors"
                  >
                    Ver gratis
                  </button>
                ) : (
                  <button
                    onClick={() => comprar(clase.id)}
                    className="w-full border border-[#7B9B77] text-[#7B9B77] text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#7B9B77]/10 transition-colors"
                  >
                    Comprar — ${clase.precio}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de reproducción */}
      {claseSeleccionada && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[#7B9B77] font-bold text-lg">{claseSeleccionada.nombre}</h2>
              <button onClick={() => { vibrar(); setClaseSeleccionada(null) }} className="text-[#A9A9A2] text-2xl hover:opacity-60">×</button>
            </div>
            {claseSeleccionada.videoUrl ? (
              <video src={claseSeleccionada.videoUrl} controls className="w-full rounded-xl mb-4" />
            ) : (
              <p className="text-[#A9A9A2] text-sm mb-4">El video estará disponible próximamente.</p>
            )}
            {claseSeleccionada.documentos?.length > 0 && (
              <div>
                <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">Materiales</p>
                {claseSeleccionada.documentos.map(doc => (
                  <a key={doc.id} href={doc.url} target="_blank" rel="noreferrer" onClick={vibrar}
                    className="block text-[#7B9B77] text-sm underline mb-1">
                    {doc.titulo}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default Clases
