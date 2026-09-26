import { useEffect, useState } from 'react'
import { obtenerResenas, obtenerMia } from '../../compartido/servicios/resenas.servicio'
import ResumenResenas from './ResumenResenas'
import ItemResena from './ItemResena'
import FormularioResena from './FormularioResena'

const MOSTRAR_DE_A = 5

// Opiniones de una clase o un curso: promedio, lista y (si puede opinar) su propia reseña.
// producto: { claseId } o { cursoId }
function SeccionResenas({ producto, titulo = 'Opiniones', conFormulario = false, ocultarSiVacia = false }) {
  const [datos, setDatos] = useState(null)
  const [mia, setMia] = useState(null) // { puedeOpinar, resena }
  const [visibles, setVisibles] = useState(MOSTRAR_DE_A)
  const clave = JSON.stringify(producto)

  useEffect(() => {
    const p = JSON.parse(clave)
    obtenerResenas(p).then(setDatos).catch(() => setDatos({ cantidad: 0, resenas: [] }))
    if (conFormulario && localStorage.getItem('token')) obtenerMia(p).then(setMia).catch(() => {})
  }, [clave, conFormulario])

  if (!datos) return null
  const puedeOpinar = mia?.puedeOpinar
  if (ocultarSiVacia && datos.cantidad === 0 && !puedeOpinar) return null

  return (
    <section aria-label={titulo}>
      <h2 className="titulo text-verde text-3xl mb-4">{titulo}</h2>
      <ResumenResenas promedio={datos.promedio} cantidad={datos.cantidad} />

      {puedeOpinar && (
        <div className="mt-6">
          <FormularioResena producto={producto} inicial={mia.resena}
            alGuardar={(resena) => setMia((m) => ({ ...m, resena }))} />
        </div>
      )}

      {datos.resenas.length > 0 && (
        <div className="mt-4">
          {datos.resenas.slice(0, visibles).map((r) => <ItemResena key={r.id} resena={r} />)}
          {datos.resenas.length > visibles && (
            <button type="button" onClick={() => setVisibles((v) => v + MOSTRAR_DE_A)} className="btn btn-chico btn-secundario mt-3">
              Ver más opiniones
            </button>
          )}
        </div>
      )}
    </section>
  )
}

export default SeccionResenas
