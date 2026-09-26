import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { botonVerde } from './componentes/estilos'
import MensajeError from './componentes/MensajeError'
import FormularioClase from './clases/FormularioClase'
import { CLASE_VACIA, datosDeClase } from './clases/datosClase'
import FilaClase from './clases/FilaClase'
import * as api from './admin.servicio'

// Sección "Clases" del panel: crear, editar, ocultar y publicar clases
function AdminClases({ mostrarMsg }) {
  const [clases, setClases] = useState([])
  const [error, setError] = useState('')
  // null = formulario cerrado · { id: null } = nueva · { id: 5 } = editando la 5
  const [edicion, setEdicion] = useState(null)

  const cargar = useCallback(() => api.obtenerClasesAdmin().then(setClases).catch(() => setError('No se pudieron cargar las clases')), [])
  useEffect(() => { cargar() }, [cargar])

  const nueva = () => setEdicion({ id: null, datos: { ...CLASE_VACIA, orden: clases.length + 1 } })
  const editar = (clase) => {
    setEdicion({ id: clase.id, datos: datosDeClase(clase) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardar = async (form) => {
    if (edicion.id) await api.actualizarClase(edicion.id, form)
    else await api.crearClase(form)
    mostrarMsg(edicion.id ? 'Clase actualizada' : 'Clase creada')
    setEdicion(null)
    cargar()
  }

  const cambiarVisibilidad = async (clase) => {
    try {
      await api.actualizarClase(clase.id, { activo: !clase.activo })
      mostrarMsg(clase.activo ? 'Clase ocultada' : 'Clase publicada')
      cargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="titulo text-verde text-3xl">Clases</h2>
        {!edicion && <button onClick={nueva} className={botonVerde}><Plus size={14} /> Nueva clase</button>}
      </div>
      <MensajeError texto={error} className="mb-4" />

      {edicion && (
        <FormularioClase key={edicion.id ?? 'nueva'} inicial={edicion.datos} editando={!!edicion.id}
          mostrarMsg={mostrarMsg} alGuardar={guardar} alCancelar={() => setEdicion(null)} />
      )}

      {clases.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay clases. Tocá "Nueva clase" para crear la primera.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {clases.map((clase) => (
            <FilaClase key={clase.id} clase={clase} alEditar={() => editar(clase)} alCambiarVisibilidad={() => cambiarVisibilidad(clase)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminClases
