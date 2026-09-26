import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { confirmar } from '../../compartido/utilidades/dialogos'
import { botonVerde } from './componentes/estilos'
import MensajeError from './componentes/MensajeError'
import FormularioFase from './fases/FormularioFase'
import TarjetaFaseAdmin from './fases/TarjetaFaseAdmin'
import * as api from './admin.servicio'

const FASE_VACIA = { numero: '', nombre: '', descripcion: '', videoUrl: '', muestraUrl: '' }

// Sección "Fases" del panel: las 6 fases que se explican en el Inicio
function AdminFases({ mostrarMsg }) {
  const [fases, setFases] = useState([])
  const [error, setError] = useState('')
  // null = formulario cerrado · { id: null } = nueva · { id: 5 } = editando la 5
  const [edicion, setEdicion] = useState(null)

  const cargar = useCallback(() => api.obtenerFases().then(setFases).catch(() => setError('No se pudieron cargar las fases')), [])
  useEffect(() => { cargar() }, [cargar])

  const nueva = () => {
    const usados = new Set(fases.map((f) => f.numero))
    const siguiente = [1, 2, 3, 4, 5, 6].find((n) => !usados.has(n)) || fases.length + 1
    setEdicion({ id: null, datos: { ...FASE_VACIA, numero: siguiente } })
  }

  const editar = (fase) => {
    setEdicion({
      id: fase.id,
      datos: { numero: fase.numero, nombre: fase.nombre, descripcion: fase.descripcion || '', videoUrl: fase.videoUrl || '', muestraUrl: fase.muestraUrl || '' },
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardar = async (form) => {
    if (edicion.id) await api.actualizarFase(edicion.id, form)
    else await api.crearFase(form)
    mostrarMsg(edicion.id ? 'Fase actualizada' : 'Fase creada')
    setEdicion(null)
    cargar()
  }

  const eliminar = async (fase) => {
    if (!(await confirmar(`¿Eliminar la fase ${fase.numero} (${fase.nombre})?`, { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarFase(fase.id)
      mostrarMsg('Fase eliminada')
      cargar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="titulo text-verde text-3xl">Las 6 fases del método</h2>
        {!edicion && fases.length < 6 && <button onClick={nueva} className={botonVerde}><Plus size={14} /> Nueva fase</button>}
      </div>
      <p className="text-piedra text-xs mb-5">Se muestran en el Inicio para explicar por qué etapas pasa cada clase y qué beneficio da cada una.</p>
      <MensajeError texto={error} className="mb-4" />

      {edicion && (
        <FormularioFase key={edicion.id ?? 'nueva'} inicial={edicion.datos} editando={!!edicion.id}
          alGuardar={guardar} alCancelar={() => setEdicion(null)} />
      )}

      {fases.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay fases cargadas. Tocá "Nueva fase" para crear la primera.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fases.map((fase) => (
            <TarjetaFaseAdmin key={fase.id} fase={fase} alEditar={() => editar(fase)} alEliminar={() => eliminar(fase)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminFases
