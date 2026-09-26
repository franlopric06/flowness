import { useState, useEffect } from 'react'
import { Clapperboard, WifiOff } from 'lucide-react'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import MediosDePago from '../../compartido/componentes/MediosDePago'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import Modal from '../../compartido/componentes/Modal'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import TarjetaClase from './componentes/TarjetaClase'
import { obtenerClases } from './clases.servicio'

// Catálogo de clases: lo ve cualquiera.
// - Gratis: se ve registrándose.
// - Paga: se compra de a una con Mercado Pago.
// El link del video solo llega del servidor si el usuario tiene acceso.
function Clases() {
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [claseAbierta, setClaseAbierta] = useState(null)

  useEffect(() => {
    obtenerClases()
      .then(setClases)
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina
        etiqueta="Para todo público"
        titulo="Clases"
        texto="Cada clase recorre las fases del método. Registrate y mirá la primera gratis; las demás las comprás de a una y quedan en tu cuenta para siempre."
      />

      <MediosDePago className="mb-10" />

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
              <TarjetaClase key={clase.id} clase={clase} indice={i} alVer={() => setClaseAbierta(clase)} />
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
