import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Lock, PlayCircle, Sparkles, CheckCircle2, ShoppingBag, UserPlus, Loader2, Clapperboard, WifiOff } from 'lucide-react'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import Modal from '../../compartido/componentes/Modal'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import { fadeUpScrollDelay } from '../../compartido/utilidades/animaciones'
import { avisar } from '../../compartido/utilidades/avisos'
import { formatearPrecio } from '../../compartido/utilidades/video'
import { imagenReducida } from '../../compartido/utilidades/medios'
import { obtenerClases } from './clases.servicio'
import { crearPreferencia } from '../pagos/pagos.servicio'

// Catálogo de clases: lo ve cualquiera.
// - Gratis: se ve registrándose.
// - Paga: se compra de a una con Mercado Pago.
// El link del video solo llega del servidor si el usuario tiene acceso.
function Clases() {
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [claseAbierta, setClaseAbierta] = useState(null)
  const [comprando, setComprando] = useState(null)
  const navigate = useNavigate()
  const hayUsuario = !!localStorage.getItem('token')

  useEffect(() => {
    obtenerClases()
      .then(setClases)
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  const irAIngresar = (modo) => navigate(`/ingresar?modo=${modo}&volver=/clases`)

  const comprar = async (clase) => {
    if (!hayUsuario) {
      avisar('Creá tu cuenta o ingresá para comprar la clase.', 'info')
      return irAIngresar('registro')
    }
    setComprando(clase.id)
    try {
      const { init_point } = await crearPreferencia(clase.id)
      avisar('Te llevamos a Mercado Pago…', 'info')
      window.location.assign(init_point)
    } catch {
      // El aviso de error ya lo muestra el cliente de la API
      setComprando(null)
    }
  }

  const accionPrincipal = (clase) => {
    if (clase.tieneAcceso) {
      return (
        <button onClick={() => setClaseAbierta(clase)} className="btn btn-primario w-full">
          <PlayCircle size={16} /> Ver clase
        </button>
      )
    }
    if (clase.esGratis) {
      return (
        <button onClick={() => irAIngresar('registro')} className="btn btn-acento btn-brillo w-full">
          <UserPlus size={16} /> Registrate y mirala gratis
        </button>
      )
    }
    return (
      <button onClick={() => comprar(clase)} disabled={comprando === clase.id} className="btn btn-secundario w-full">
        {comprando === clase.id
          ? <><Loader2 size={16} className="animate-spin" /> Redirigiendo…</>
          : <><ShoppingBag size={16} /> Comprar · {formatearPrecio(clase.precio)}</>}
      </button>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina
        etiqueta="Para todo público"
        titulo="Clases"
        texto="Cada clase recorre las fases del método. Registrate y mirá la primera gratis; las demás las comprás de a una y quedan en tu cuenta para siempre."
      />

      <div className="contenedor">
        {cargando ? (
          <EsqueletoGrilla cantidad={6} />
        ) : error ? (
          <EstadoVacio icono={WifiOff} error titulo="No pudimos cargar las clases" texto="Revisá tu conexión y probá de nuevo en un rato." />
        ) : clases.length === 0 ? (
          <EstadoVacio icono={Clapperboard} titulo="Muy pronto" texto="Estamos preparando las primeras clases. ¡Volvé en unos días!" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clases.map((clase, i) => (
              <motion.article key={clase.id} {...fadeUpScrollDelay((i % 3) * 0.08)} className="card card-elevable group flex flex-col">
                {/* Miniatura */}
                <div className="relative aspect-video bg-gradient-to-br from-verde/25 to-terracota/25 overflow-hidden">
                  {clase.miniaturaUrl ? (
                    <img src={imagenReducida(clase.miniaturaUrl, 700)} alt={clase.nombre} loading="lazy" className="zoom h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <img src="/logo.png" alt="" className="zoom h-16 w-16 opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 flex gap-2">
                    {clase.esGratis && <span className="chip chip-terracota"><Sparkles size={12} /> Gratis</span>}
                    {clase.comprada && <span className="chip chip-verde"><CheckCircle2 size={12} /> Comprada</span>}
                  </div>
                  {!clase.tieneAcceso && (
                    <span className="absolute top-3 right-3 bg-blanco/90 text-verde rounded-full h-8 w-8 flex items-center justify-center shadow-suave" title="Bloqueada">
                      <Lock size={15} />
                    </span>
                  )}
                  {clase.duracion && (
                    <span className="absolute bottom-3 right-3 bg-black/55 backdrop-blur text-blanco text-[0.65rem] tracking-wider px-2 py-1 rounded-md flex items-center gap-1">
                      <Clock size={11} /> {clase.duracion}
                    </span>
                  )}
                  {clase.tieneAcceso && (
                    <button onClick={() => setClaseAbierta(clase)} aria-label={`Ver ${clase.nombre}`}
                      className="absolute inset-0 flex items-center justify-center bg-verde/0 hover:bg-verde/25 transition-colors">
                      <PlayCircle size={52} className="text-blanco drop-shadow opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                    </button>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="titulo text-verde text-2xl mb-2">{clase.nombre}</h3>
                  <p className="text-texto/70 text-sm leading-relaxed mb-6 flex-1 whitespace-pre-line line-clamp-4">{clase.descripcion}</p>
                  {accionPrincipal(clase)}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Reproductor */}
      <Modal abierto={!!claseAbierta} alCerrar={() => setClaseAbierta(null)} titulo={claseAbierta?.nombre}>
        {claseAbierta && (
          <>
            <ReproductorVideo url={claseAbierta.videoUrl} titulo={claseAbierta.nombre} />
            {claseAbierta.descripcion && (
              <p className="text-texto/80 text-sm leading-relaxed mt-5 whitespace-pre-line">{claseAbierta.descripcion}</p>
            )}
          </>
        )}
      </Modal>
    </main>
  )
}

export default Clases
