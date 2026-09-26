import { useState, useEffect, useCallback } from 'react'
import MensajeError from './componentes/MensajeError'
import SelectorNivel from './formacion/SelectorNivel'
import FormularioCurso from './formacion/FormularioCurso'
import LeccionesCurso from './formacion/LeccionesCurso'
import * as api from './admin.servicio'

// Sección "Formación" del panel: elegir un nivel, editar sus datos y cargar sus lecciones
function AdminFormacion({ mostrarMsg }) {
  const [cursos, setCursos] = useState([])
  const [cursoId, setCursoId] = useState(null)
  const [error, setError] = useState('')

  const cargar = useCallback(() =>
    api.obtenerCursosAdmin()
      .then((lista) => {
        setCursos(lista)
        setCursoId((actual) => actual ?? lista[0]?.id ?? null)
      })
      .catch(() => setError('No se pudo cargar la formación')), [])

  useEffect(() => { cargar() }, [cargar])

  const curso = cursos.find((c) => c.id === cursoId)

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-4">Formación</h2>
      <MensajeError texto={error} className="mb-4" />
      <SelectorNivel cursos={cursos} elegido={cursoId} alElegir={setCursoId} />
      {curso && (
        <>
          <FormularioCurso key={`curso-${curso.id}`} curso={curso} mostrarMsg={mostrarMsg} alGuardar={cargar} />
          <LeccionesCurso key={`lecc-${curso.id}`} curso={curso} mostrarMsg={mostrarMsg} alGuardar={cargar} />
        </>
      )}
    </div>
  )
}

export default AdminFormacion
