import { useState } from 'react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import { esLinkValido } from '../../../compartido/utilidades/video'
import { estiloLabel, botonCancelar } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'
import CampoVideoMuestra from '../CampoVideoMuestra'

// Formulario para crear o editar una fase del método
function FormularioFase({ inicial, editando, alGuardar, alCancelar }) {
  const [form, setForm] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const guardar = async () => {
    setError('')
    if (!form.nombre.trim()) return setError('Poné el nombre de la fase.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo o dejalo vacío.')
    setGuardando(true)
    try {
      await alGuardar(form)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="card p-5 md:p-6 mb-6">
      <h3 className="titulo text-verde text-2xl mb-4">{editando ? 'Editar fase' : 'Nueva fase'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
        <div>
          <label className={estiloLabel}>Número</label>
          <input type="number" min="1" max="6" value={form.numero} onChange={(e) => cambiar('numero', e.target.value)} className="input" />
        </div>
        <div>
          <label className={estiloLabel}>Nombre</label>
          <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} placeholder="Ej: Respiración consciente" className="input" />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Qué se trabaja y qué beneficio da</label>
          <textarea rows={4} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className="input" />
        </div>
        <div className="md:col-span-2">
          <CampoVideoMuestra valor={form.muestraUrl} alCambiar={(url) => cambiar('muestraUrl', url)} formato="aspect-[9/16]"
            etiqueta="Video corto de la fase (se ve en la tarjeta)"
            ayuda="Vertical, de 10 a 20 segundos, mostrando el movimiento de esta fase. Se ve de fondo, sin sonido y en bucle." />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Video completo en YouTube (opcional)</label>
          <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className="input" />
          {form.videoUrl && esLinkValido(form.videoUrl) && (
            <div className="mt-3 max-w-sm"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
          )}
        </div>
      </div>
      <MensajeError texto={error} />
      <div className="flex gap-3 mt-5">
        <BotonGuardar guardando={guardando} onClick={guardar} texto={editando ? 'Guardar cambios' : 'Crear fase'} />
        <button onClick={alCancelar} className={botonCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default FormularioFase
