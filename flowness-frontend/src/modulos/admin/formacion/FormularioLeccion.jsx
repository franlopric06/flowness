import { useState } from 'react'
import { Loader2, Upload, X, FileText, ExternalLink } from 'lucide-react'
import ReproductorVideo from '../../../compartido/componentes/ReproductorVideo'
import { esLinkValido } from '../../../compartido/utilidades/video'
import { urlVisorPdf } from '../../../compartido/utilidades/medios'
import { estiloLabel, botonBorde, botonQuitar, botonCancelar } from '../componentes/estilos'
import MensajeError from '../componentes/MensajeError'
import BotonGuardar from '../componentes/BotonGuardar'
import * as api from '../admin.servicio'

const MB = 1024 * 1024

// Formulario para crear o editar una lección (video de YouTube + PDF)
function FormularioLeccion({ inicial, editando, mostrarMsg, alGuardar, alCancelar }) {
  const [form, setForm] = useState(inicial)
  const [guardando, setGuardando] = useState(false)
  const [subiendoPdf, setSubiendoPdf] = useState(false)
  const [error, setError] = useState('')
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const subirPdf = async (archivo) => {
    if (!archivo) return
    if (archivo.type !== 'application/pdf') return setError('El archivo tiene que ser un PDF.')
    if (archivo.size > 10 * MB) return setError('El PDF pesa más de 10 MB. Probá comprimirlo.')
    setSubiendoPdf(true)
    setError('')
    try {
      const { url, error: motivo } = await api.subirDocumento(archivo)
      if (!url) throw new Error(motivo)
      cambiar('pdfUrl', url)
      mostrarMsg('PDF subido')
    } catch (err) {
      setError(`No se pudo subir el PDF. ${err.message || ''}`)
    } finally {
      setSubiendoPdf(false)
    }
  }

  const guardar = async () => {
    setError('')
    if (!form.titulo.trim()) return setError('Poné un título para la lección.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo.')
    setGuardando(true)
    try {
      await alGuardar(form)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  return (
    <div className="bg-crema rounded-2xl p-4 mb-5">
      <h4 className="titulo text-verde text-xl mb-3">{editando ? 'Editar lección' : 'Nueva lección'}</h4>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">
        <div>
          <label className={estiloLabel}>Título</label>
          <input value={form.titulo} onChange={(e) => cambiar('titulo', e.target.value)} className="input bg-blanco" />
        </div>
        <div>
          <label className={estiloLabel}>Orden</label>
          <input type="number" min="0" value={form.orden} onChange={(e) => cambiar('orden', e.target.value)} className="input bg-blanco" />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Descripción (opcional)</label>
          <textarea rows={2} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className="input bg-blanco" />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Link del video en YouTube (No listado)</label>
          <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className="input bg-blanco" />
          {form.videoUrl && esLinkValido(form.videoUrl) && (
            <div className="mt-3 max-w-sm"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Material en PDF</label>
          <div className="flex flex-wrap gap-3 items-center">
            {form.pdfUrl && (
              <a href={urlVisorPdf(form.pdfUrl)} target="_blank" rel="noreferrer" className="btn btn-chico text-verde hover:bg-verde/10">
                <FileText size={14} /> Ver PDF cargado <ExternalLink size={12} />
              </a>
            )}
            <label className={`${botonBorde} cursor-pointer bg-blanco`}>
              {subiendoPdf ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> {form.pdfUrl ? 'Reemplazar PDF' : 'Subir PDF'}</>}
              <input type="file" accept="application/pdf" className="hidden" disabled={subiendoPdf} onChange={(e) => subirPdf(e.target.files[0])} />
            </label>
            {form.pdfUrl && <button onClick={() => cambiar('pdfUrl', '')} className={botonQuitar}><X size={13} /> Quitar</button>}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-texto cursor-pointer">
          <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
          Publicada (la ven los alumnos)
        </label>
      </div>
      <MensajeError texto={error} />
      <div className="flex gap-3 mt-4">
        <BotonGuardar guardando={guardando} disabled={subiendoPdf} onClick={guardar} texto={editando ? 'Guardar cambios' : 'Crear lección'} />
        <button onClick={alCancelar} className={botonCancelar}>Cancelar</button>
      </div>
    </div>
  )
}

export default FormularioLeccion
