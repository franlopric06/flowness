import { useState } from 'react'
import { estiloLabel, botonCancelar } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'

// Formulario para crear o editar una pregunta frecuente
function FormularioPregunta({ inicial, editando, alGuardar, alCancelar }) {
  const [form, setForm] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const guardar = async () => {
    setError('')
    if (!form.pregunta.trim()) return setError('Escribí la pregunta.')
    if (!form.respuesta.trim()) return setError('Escribí la respuesta.')
    setGuardando(true)
    try {
      await alGuardar(form)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="card p-5 md:p-6 mb-6 space-y-4">
      <h3 className="text-sm font-semibold text-texto">{editando ? 'Editar pregunta' : 'Nueva pregunta'}</h3>
      <div>
        <label className={estiloLabel}>Pregunta</label>
        <input value={form.pregunta} onChange={(e) => cambiar('pregunta', e.target.value)} maxLength={200}
          placeholder='Ej: "¿Las clases tienen horario?"' className="input" />
      </div>
      <div>
        <label className={estiloLabel}>Respuesta</label>
        <textarea rows={4} value={form.respuesta} onChange={(e) => cambiar('respuesta', e.target.value)} maxLength={1500}
          placeholder="Lo que le responde el asistente" className="input" />
      </div>
      <div>
        <label className={estiloLabel}>Otras formas de preguntarlo (opcional)</label>
        <input value={form.palabrasClave} onChange={(e) => cambiar('palabrasClave', e.target.value)}
          placeholder="Separadas por coma. Ej: horario, a qué hora, en vivo, cuándo" className="input" />
        <p className="text-piedra text-xs mt-1.5">Ayudan a que el asistente encuentre esta respuesta aunque la persona lo pregunte con otras palabras.</p>
      </div>
      <MensajeError texto={error} className="" />
      <div className="flex gap-2">
        <BotonGuardar guardando={guardando} onClick={guardar} texto={editando ? 'Guardar cambios' : 'Agregar pregunta'} />
        <button type="button" onClick={alCancelar} className={botonCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default FormularioPregunta
