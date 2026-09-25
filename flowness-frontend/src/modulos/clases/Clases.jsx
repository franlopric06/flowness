import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { obtenerClases } from './clases.servicio'
import { crearPreferencia } from '../pagos/pagos.servicio'

// Catálogo de clases: lo ve cualquiera.
// - Gratis: se ve registrándose.
// - Paga: se compra de a una con Mercado Pago.
// El link del video solo llega del servidor si el usuario tiene acceso.
function Clases() {
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [claseAbierta, setClaseAbierta] = useState(null)
  const [comprando, setComprando] = useState(null)
  const vibrar = useVibrar()
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')

  useEffect(() => {
    obtenerClases()
      .then(setClases)
      .catch(() => setError('No pudimos cargar las clases. Probá de nuevo en un rato.'))
      .finally(() => setCargando(false))
  }, [])

  const irAIngresar = (modo) => {
    navigate(`/ingresar?modo=${modo}&volver=/clases`)
  }

  const comprar = async (clase) => {
    vibrar()
    if (!hayUsuario) return irAIngresar('registro')
    setComprando(clase.id)
    try {
      const { init_point } = await crearPreferencia(clase.id)
      window.location.assign(init_point)
    } catch (err) {
      alert(err.message || 'No se pudo iniciar el pago')
      setComprando(null)
    }
  }

  const accionPrincipal = (clase) => {
    if (clase.tieneAcceso) {
      return (
        <button onClick={() => { vibrar(); setClaseAbierta(clase) }}
          className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
          Ver clase
        </button>
      )
    }
    if (clase.esGratis) {
      return (
        <button onClick={() => { vibrar(); irAIngresar('registro') }}
          className="w-full bg-[#D8A48F] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:opacity-85 transition-opacity">
          Registrate y mirala gratis
        </button>
      )
    }
    return (
      <button onClick={() => comprar(clase)} disabled={comprando === clase.id}
        className="w-full border border-[#7B9B77] text-[#7B9B77] text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#7B9B77]/10 transition-colors disabled:opacity-50">
        {comprando === clase.id ? 'Redirigiendo…' : `Comprar · ${formatearPrecio(clase.precio)}`}
      </button>
    )
  }

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Para todo público</p>
      <h1 className="text-[#7B9B77] text-3xl md:text-4xl font-bold text-center tracking-widest mb-4">Clases</h1>
      <p className="text-[#A9A9A2] text-sm text-center max-w-xl mx-auto mb-12">
        Cada clase recorre las 6 fases del método. Registrate y mirá la primera gratis;
        las demás las comprás de a una y quedan en tu cuenta para siempre.
      </p>

      {cargando ? (
        <p className="text-center text-[#A9A9A2]">Cargando clases…</p>
      ) : error ? (
        <p className="text-center text-[#D8A48F]">{error}</p>
      ) : clases.length === 0 ? (
        <p className="text-center text-[#A9A9A2]">Muy pronto vas a encontrar clases acá.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {clases.map((clase) => (
            <article key={clase.id} className="bg-white rounded-2xl overflow-hidden border border-[#D8A48F]/20 shadow-sm flex flex-col">
              {/* Miniatura */}
              <div className="relative aspect-video bg-gradient-to-br from-[#7B9B77]/25 to-[#D8A48F]/25">
                {clase.miniaturaUrl ? (
                  <img src={clase.miniaturaUrl} alt={clase.nombre} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <img src="/logo.png" alt="" className="h-16 w-16 opacity-40" />
                  </div>
                )}

                {/* Etiquetas */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {clase.esGratis && (
                    <span className="bg-[#D8A48F] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">Gratis</span>
                  )}
                  {clase.comprada && (
                    <span className="bg-[#7B9B77] text-white text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">Comprada</span>
                  )}
                </div>
                {clase.duracion && (
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] tracking-widest px-2 py-1 rounded">
                    {clase.duracion}
                  </span>
                )}
                {!clase.tieneAcceso && (
                  <span className="absolute top-3 right-3 bg-white/90 text-[#7B9B77] rounded-full h-8 w-8 flex items-center justify-center" title="Bloqueada">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </span>
                )}
              </div>

              {/* Texto y botón */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-2">{clase.nombre}</h3>
                <p className="text-[#A9A9A2] text-xs leading-relaxed mb-5 flex-1 whitespace-pre-line">{clase.descripcion}</p>
                {accionPrincipal(clase)}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Reproductor */}
      {claseAbierta && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setClaseAbierta(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <h2 className="text-[#7B9B77] font-bold text-lg tracking-widest">{claseAbierta.nombre}</h2>
              <button onClick={() => { vibrar(); setClaseAbierta(null) }} aria-label="Cerrar"
                className="text-[#A9A9A2] text-2xl leading-none hover:opacity-60">×</button>
            </div>
            <ReproductorVideo url={claseAbierta.videoUrl} titulo={claseAbierta.nombre} />
            {claseAbierta.descripcion && (
              <p className="text-[#555] text-sm leading-relaxed mt-4 whitespace-pre-line">{claseAbierta.descripcion}</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

export default Clases
