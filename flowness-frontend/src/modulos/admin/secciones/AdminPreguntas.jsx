import { useState } from 'react'
import { Plus } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { confirmar } from '../../../compartido/utilidades/dialogos'
import { botonVerde } from '../componentes/estilos'
import { useCargar } from '../componentes/useCargar'
import FormularioPregunta from '../preguntas/FormularioPregunta'
import FilaPregunta from '../preguntas/FilaPregunta'
import ProbarAsistente from '../preguntas/ProbarAsistente'
import { PREGUNTA_VACIA, datosDePregunta } from '../preguntas/datosPregunta'
import * as api from '../admin.servicio'

// Sección "Preguntas" del panel: lo que responde el asistente del sitio
function AdminPreguntas() {
  const [preguntas, recargar] = useCargar(api.obtenerPreguntasAdmin, [])
  // null = formulario cerrado · { id: null } = nueva · { id: 5 } = editando la 5
  const [edicion, setEdicion] = useState(null)
  const lista = preguntas || []

  const nueva = () => setEdicion({ id: null, datos: { ...PREGUNTA_VACIA } })
  const editar = (p) => {
    setEdicion({ id: p.id, datos: datosDePregunta(p) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const guardar = async (form) => {
    if (edicion.id) await api.actualizarPregunta(edicion.id, form)
    else await api.crearPregunta(form)
    avisar(edicion.id ? 'Pregunta actualizada' : 'Pregunta agregada')
    setEdicion(null)
    recargar()
  }

  const accion = async (hacer, mensaje) => {
    try {
      await hacer()
      if (mensaje) avisar(mensaje)
      recargar()
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  // Intercambia con la de al lado y vuelve a numerar todas (0, 1, 2…)
  const mover = (i, direccion) => {
    const nueva = [...lista]
    ;[nueva[i], nueva[i + direccion]] = [nueva[i + direccion], nueva[i]]
    accion(() => Promise.all(nueva
      .map((p, orden) => (p.orden !== orden ? api.actualizarPregunta(p.id, { orden }) : null))
      .filter(Boolean)))
  }

  const eliminar = async (p) => {
    if (!(await confirmar(`¿Eliminar la pregunta "${p.pregunta}"?`, { textoConfirmar: 'Eliminar' }))) return
    accion(() => api.eliminarPregunta(p.id), 'Pregunta eliminada')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="titulo text-verde text-3xl">Preguntas frecuentes</h2>
        {!edicion && <button onClick={nueva} className={botonVerde}><Plus size={14} /> Nueva pregunta</button>}
      </div>
      <p className="text-piedra text-xs mb-5">
        Las usa el asistente "¿Dudas?" del sitio y se muestran en Contacto. Las primeras 4 aparecen como sugerencias al abrir el asistente.
        Si alguien pregunta algo que no está acá, el asistente le ofrece escribir por WhatsApp.
      </p>

      {edicion && (
        <FormularioPregunta key={edicion.id ?? 'nueva'} inicial={edicion.datos} editando={!!edicion.id}
          alGuardar={guardar} alCancelar={() => setEdicion(null)} />
      )}

      {lista.length > 0 && <ProbarAsistente preguntas={lista} />}

      {lista.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay preguntas. Tocá "Nueva pregunta" para agregar la primera.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((p, i) => (
            <FilaPregunta key={p.id} pregunta={p} esPrimera={i === 0} esUltima={i === lista.length - 1}
              alSubir={() => mover(i, -1)} alBajar={() => mover(i, 1)} alEditar={() => editar(p)}
              alCambiarVisibilidad={() => accion(() => api.actualizarPregunta(p.id, { activo: !p.activo }), p.activo ? 'Pregunta oculta' : 'Pregunta visible')}
              alEliminar={() => eliminar(p)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPreguntas
