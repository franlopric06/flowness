import { useState } from 'react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import { esLinkValido } from '../../../compartido/utilidades/video'
import { estiloLabel, botonCancelar } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'
import CampoImagen from '../componentes/CampoImagen'
import CampoVideoMuestra from '../CampoVideoMuestra'

// Formulario para crear o editar una clase
function FormularioClase({ inicial, editando, mostrarMsg, alGuardar, alCancelar }) {
  const [form, setForm] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const guardar = async () => {
    setError('')
    if (!form.nombre.trim()) return setError('Poné un nombre para la clase.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo.')
    if (!form.esGratis && !(Number(form.precio) > 0)) return setError('Poné un precio o marcá la clase como gratis.')
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
      <h3 className="text-sm font-semibold mb-4 text-texto">{editando ? 'Editar clase' : 'Nueva clase'}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={estiloLabel}>Nombre</label>
          <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className="input" />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Descripción</label>
          <textarea value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} rows={3} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className={estiloLabel}>Link del video en YouTube</label>
          <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className="input" />
          <p className="text-piedra text-[11px] mt-1 px-2">
            Subilo a YouTube como <strong>No listado</strong> (no como Privado, porque así no se puede ver desde la página).
            El link solo se le muestra a quien tiene acceso a la clase.
          </p>
          {form.videoUrl && esLinkValido(form.videoUrl) && (
            <div className="mt-3 max-w-md"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
          )}
        </div>

        <div className="md:col-span-2">
          <CampoVideoMuestra valor={form.muestraUrl} alCambiar={(url) => cambiar('muestraUrl', url)}
            etiqueta="Adelanto de la clase (se ve en la tarjeta)"
            ayuda="Horizontal, de 10 a 20 segundos, con lo mejor de la clase. Es un video aparte: la clase completa sigue protegida." />
        </div>

        <div className="md:col-span-2">
          <CampoImagen etiqueta="Imagen de portada (opcional)" valor={form.miniaturaUrl}
            alCambiar={(url) => { cambiar('miniaturaUrl', url); if (url) mostrarMsg('Imagen subida') }}
            alError={setError} alSubir={setSubiendo} />
        </div>

        <div>
          <label className={estiloLabel}>Duración</label>
          <input value={form.duracion} onChange={(e) => cambiar('duracion', e.target.value)} placeholder="Ej: 45 min" className="input" />
        </div>
        <div>
          <label className={estiloLabel}>Orden en el catálogo</label>
          <input type="number" min="0" value={form.orden} onChange={(e) => cambiar('orden', e.target.value)} className="input" />
        </div>
        <div>
          <label className={estiloLabel}>Precio (ARS)</label>
          <input type="number" min="0" value={form.esGratis ? '' : form.precio} disabled={form.esGratis}
            onChange={(e) => cambiar('precio', e.target.value)} placeholder={form.esGratis ? 'Gratis' : 'Ej: 5000'}
            className="input disabled:bg-crema" />
        </div>
        <div className="flex flex-col gap-2 justify-end pb-1">
          <label className="flex items-center gap-2 text-sm text-texto cursor-pointer">
            <input type="checkbox" checked={form.esGratis} onChange={(e) => cambiar('esGratis', e.target.checked)} />
            Gratis (se ve con solo registrarse)
          </label>
          <label className="flex items-center gap-2 text-sm text-texto cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
            Publicada (visible en la página)
          </label>
        </div>
      </div>

      <MensajeError texto={error} />
      <div className="flex gap-3 mt-5">
        <BotonGuardar guardando={guardando} disabled={subiendo} onClick={guardar} texto={editando ? 'Guardar cambios' : 'Crear clase'} />
        <button onClick={alCancelar} className={botonCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default FormularioClase
