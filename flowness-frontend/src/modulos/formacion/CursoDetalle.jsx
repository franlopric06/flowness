import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, SearchX } from 'lucide-react'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import CargandoCurso from './curso/CargandoCurso'
import PaginaVenta from './curso/PaginaVenta'
import Aula from './curso/Aula'
import { obtenerCurso } from './formacion.servicio'

// Página de un nivel de la Formación.
// - Si todavía no lo compró: página de venta (info, temario y botón Comprar).
// - Si ya lo compró: el aula (lista de lecciones, video y PDF).
function CursoDetalle() {
  const { slug } = useParams()
  // Guarda para qué nivel es lo cargado; si cambia el nivel, se muestra la carga
  const [estado, setEstado] = useState({ slug: null, curso: null, error: false })

  useEffect(() => {
    obtenerCurso(slug)
      .then((curso) => setEstado({ slug, curso, error: false }))
      .catch(() => setEstado({ slug, curso: null, error: true }))
  }, [slug])

  if (estado.slug !== slug) return <CargandoCurso />

  const { curso, error } = estado
  if (error || !curso) {
    return (
      <main className="contenedor pt-32 min-h-screen">
        <EstadoVacio icono={SearchX} titulo="No encontramos este curso" texto="Puede que el link esté mal o que el curso ya no esté disponible.">
          <Link to="/formacion" className="btn btn-secundario"><ArrowLeft size={16} /> Volver a la formación</Link>
        </EstadoVacio>
      </main>
    )
  }

  return curso.tieneAcceso ? <Aula curso={curso} /> : <PaginaVenta curso={curso} />
}

export default CursoDetalle
