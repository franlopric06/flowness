import { useState } from 'react'
import { estiloLabel } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'
import CampoImagen from '../componentes/CampoImagen'
import CampoVideoMuestra from '../CampoVideoMuestra'
import * as api from '../admin.servicio'

const datosIniciales = (curso) => ({
  nombre: curso.nombre || '',
  subtitulo: curso.subtitulo || '',
  descripcion: curso.descripcion || '',
  dirigidoA: curso.dirigidoA || '',
  duracion: curso.duracion || '',
  totalVideos: curso.totalVideos ?? '',
  precio: curso.precio || '',
  portadaUrl: curso.portadaUrl || '',
  muestraUrl: curso.muestraUrl || '',
  activo: curso.activo,
})

// Datos de un nivel de la formación: nombre, textos, precio, video y portada
function FormularioCurso({ curso, mostrarMsg, alGuardar }) {
  const [form, setForm] = useState(() => datosIniciales(curso))
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const guardar = async () => {
    setError('')
    if (!form.nombre.trim()) return setError('Poné un nombre para el curso.')
    setGuardando(true)
    try {
      await api.actualizarCurso(curso.id, form)
      mostrarMsg('Curso guardado')
      alGuardar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const campoTexto = (campo, etiqueta, props = {}) => (
    <div>
      <label className={estiloLabel}>{etiqueta}</label>
      <input value={form[campo]} onChange={(e) => cambiar(campo, e.target.value)} className="input" {...props} />
    </div>
  )

  return (
    <div className="card p-5 md:p-6 mb-6">
      <h3 className="titulo text-verde text-2xl mb-4">Información del curso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campoTexto('nombre', 'Nombre')}
        {campoTexto('subtitulo', 'Etiqueta (ej: Nivel 1)')}
        <div className="md:col-span-2">
          <label className={estiloLabel}>Descripción</label>
          <textarea rows={4} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className="input" />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>¿A quién está dirigido?</label>
          <textarea rows={2} value={form.dirigidoA} onChange={(e) => cambiar('dirigidoA', e.target.value)} className="input" />
        </div>
        {campoTexto('duracion', 'Duración', { placeholder: 'Ej: 3 meses' })}
        {campoTexto('totalVideos', 'Cantidad total de videos previstos', { type: 'number', min: '0', placeholder: 'Ej: 20' })}
        {campoTexto('precio', 'Precio (ARS)', { type: 'number', min: '0', placeholder: 'Sin precio = Próximamente' })}
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-texto cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
            Publicado (visible en la página)
          </label>
        </div>
        <div className="md:col-span-2">
          <CampoVideoMuestra valor={form.muestraUrl} alCambiar={(url) => cambiar('muestraUrl', url)}
            etiqueta="Video corto del nivel (se ve en la tarjeta y en su página)"
            ayuda="Horizontal, de 10 a 20 segundos, que muestre de qué se trata este nivel." />
        </div>
        <div className="md:col-span-2">
          <CampoImagen etiqueta="Imagen de portada" valor={form.portadaUrl} alCambiar={(url) => cambiar('portadaUrl', url)}
            alError={setError} alSubir={setSubiendo} />
        </div>
      </div>
      <MensajeError texto={error} />
      <BotonGuardar guardando={guardando} disabled={subiendo} onClick={guardar} texto="Guardar curso" className="mt-5" />
    </div>
  )
}

export default FormularioCurso
