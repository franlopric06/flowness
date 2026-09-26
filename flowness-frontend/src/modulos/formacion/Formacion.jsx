import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, WifiOff, BadgeCheck } from 'lucide-react'
import CabeceraPagina from '../../compartido/componentes/CabeceraPagina'
import MediosDePago from '../../compartido/componentes/MediosDePago'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import { EsqueletoGrilla } from '../../compartido/componentes/Esqueleto'
import { useResumenResenas } from '../../compartido/hooks/useResumenResenas'
import TarjetaCurso from './componentes/TarjetaCurso'
import { obtenerCursos } from './formacion.servicio'

// Página general de la Formación: presenta los 3 niveles.
// Cada tarjeta lleva a la página del nivel (info completa y compra).
function Formacion() {
  const resumen = useResumenResenas()
  const [cursos, setCursos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    obtenerCursos()
      .then(setCursos)
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="min-h-screen pb-20">
      <CabeceraPagina
        etiqueta="Para profesionales"
        titulo="Formación Flowness"
        texto="Un programa en tres niveles para profesores de educación física, entrenadores y profesionales del movimiento. Cada nivel se compra por separado y queda en tu cuenta para siempre.">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 mt-6 chip bg-verde/15 text-verde">
          <BadgeCheck size={14} /> Método con marca registrada
        </motion.p>
      </CabeceraPagina>

      <MediosDePago className="mb-10" />

      <div className="contenedor">
        {cargando ? (
          <EsqueletoGrilla cantidad={3} imagen="aspect-[4/3]" className="grid grid-cols-1 md:grid-cols-3 gap-6" />
        ) : error ? (
          <EstadoVacio icono={WifiOff} error titulo="No pudimos cargar la formación" texto="Revisá tu conexión y probá de nuevo en un rato." />
        ) : cursos.length === 0 ? (
          <EstadoVacio icono={GraduationCap} titulo="Muy pronto" texto="La formación va a estar disponible acá muy pronto." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cursos.map((curso, i) => (
              <TarjetaCurso key={curso.id} curso={curso} indice={i} resumen={resumen.cursos[curso.id]} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Formacion
