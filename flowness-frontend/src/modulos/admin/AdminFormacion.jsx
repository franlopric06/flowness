import { useState, useEffect } from 'react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { esLinkValido, formatearPrecio } from '../../compartido/utilidades/video'
import * as api from './admin.servicio'

const estiloInput = 'w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none focus:border-[#7B9B77]'
const estiloArea = 'w-full border border-[#D8A48F]/30 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#7B9B77]'
const estiloLabel = 'text-[#A9A9A2] text-[11px] tracking-widest uppercase block mb-1'
const botonVerde = 'bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50'
const botonBorde = 'border border-[#7B9B77] text-[#7B9B77] text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full hover:bg-[#7B9B77]/10'

// Sección "Formación" del panel: editar los 3 niveles y cargar sus lecciones.
function AdminFormacion({ mostrarMsg }) {
  const [cursos, setCursos] = useState([])
  const [cursoId, setCursoId] = useState(null)
  const [error, setError] = useState('')

  const cargar = () =>
    api.obtenerCursosAdmin()
      .then((lista) => {
        setCursos(lista)
        setCursoId((actual) => actual ?? lista[0]?.id ?? null)
      })
      .catch(() => setError('No se pudo cargar la formación'))

  useEffect(() => { cargar() }, [])

  const curso = cursos.find((c) => c.id === cursoId)

  return (
    <div>
      <h2 className="text-[#7B9B77] font-semibold mb-4">Formación</h2>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Selector de nivel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {cursos.map((c) => (
          <button key={c.id} onClick={() => setCursoId(c.id)}
            className={`text-left rounded-2xl p-4 border transition-colors ${
              c.id === cursoId ? 'bg-[#7B9B77] text-white border-[#7B9B77]' : 'bg-white border-[#D8A48F]/20 hover:border-[#7B9B77]'
            }`}>
            <p className={`text-[10px] tracking-widest uppercase ${c.id === cursoId ? 'text-white/80' : 'text-[#D8A48F]'}`}>{c.subtitulo || 'Nivel'}</p>
            <p className="font-semibold text-sm">{c.nombre}</p>
            <p className={`text-[11px] mt-1 ${c.id === cursoId ? 'text-white/80' : 'text-[#A9A9A2]'}`}>
              {c.precio > 0 ? formatearPrecio(c.precio) : 'Sin precio (próximamente)'} · {c.lecciones.filter((l) => l.activo).length} lecciones · {c.ventas} ventas
              {!c.activo && ' · Oculto'}
            </p>
          </button>
        ))}
      </div>

      {curso && (
        <>
          <FormularioCurso key={`curso-${curso.id}`} curso={curso} mostrarMsg={mostrarMsg} alGuardar={cargar} />
          <Lecciones key={`lecc-${curso.id}`} curso={curso} mostrarMsg={mostrarMsg} alGuardar={cargar} />
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Datos del curso
// ─────────────────────────────────────────────
function FormularioCurso({ curso, mostrarMsg, alGuardar }) {
  const [form, setForm] = useState({
    nombre: curso.nombre || '',
    subtitulo: curso.subtitulo || '',
    descripcion: curso.descripcion || '',
    dirigidoA: curso.dirigidoA || '',
    duracion: curso.duracion || '',
    totalVideos: curso.totalVideos ?? '',
    precio: curso.precio || '',
    portadaUrl: curso.portadaUrl || '',
    activo: curso.activo,
  })
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const subirPortada = async (archivo) => {
    if (!archivo) return
    setSubiendo(true)
    try {
      const { url } = await api.subirImagen(archivo)
      if (!url) throw new Error()
      cambiar('portadaUrl', url)
    } catch {
      setError('No se pudo subir la imagen.')
    } finally {
      setSubiendo(false)
    }
  }

  const guardar = async () => {
    vibrar()
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

  return (
    <div className="bg-white rounded-2xl p-5 mb-6 border border-[#D8A48F]/20">
      <h3 className="text-sm font-semibold mb-4 text-[#555]">Información del curso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={estiloLabel}>Nombre</label>
          <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className={estiloInput} />
        </div>
        <div>
          <label className={estiloLabel}>Etiqueta (ej: Nivel 1)</label>
          <input value={form.subtitulo} onChange={(e) => cambiar('subtitulo', e.target.value)} className={estiloInput} />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Descripción</label>
          <textarea rows={4} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className={estiloArea} />
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>¿A quién está dirigido?</label>
          <textarea rows={2} value={form.dirigidoA} onChange={(e) => cambiar('dirigidoA', e.target.value)} className={estiloArea} />
        </div>
        <div>
          <label className={estiloLabel}>Duración</label>
          <input value={form.duracion} onChange={(e) => cambiar('duracion', e.target.value)} placeholder="Ej: 3 meses" className={estiloInput} />
        </div>
        <div>
          <label className={estiloLabel}>Cantidad total de videos previstos</label>
          <input type="number" min="0" value={form.totalVideos} onChange={(e) => cambiar('totalVideos', e.target.value)} placeholder="Ej: 20" className={estiloInput} />
        </div>
        <div>
          <label className={estiloLabel}>Precio (ARS)</label>
          <input type="number" min="0" value={form.precio} onChange={(e) => cambiar('precio', e.target.value)} placeholder="Sin precio = Próximamente" className={estiloInput} />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
            <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
            Publicado (visible en la página)
          </label>
        </div>
        <div className="md:col-span-2">
          <label className={estiloLabel}>Imagen de portada</label>
          <div className="flex flex-wrap gap-3 items-center">
            {form.portadaUrl && <img src={form.portadaUrl} alt="" className="h-20 aspect-video object-cover rounded-lg border border-[#D8A48F]/20" />}
            <label className={`${botonBorde} cursor-pointer`}>
              {subiendo ? 'Subiendo…' : 'Subir imagen'}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={subiendo}
                onChange={(e) => subirPortada(e.target.files[0])} />
            </label>
            {form.portadaUrl && <button onClick={() => cambiar('portadaUrl', '')} className="text-red-400 text-xs">Quitar</button>}
          </div>
        </div>
      </div>
      {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      <button onClick={guardar} disabled={guardando || subiendo} className={`${botonVerde} mt-5`}>
        {guardando ? 'Guardando…' : 'Guardar curso'}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// Lecciones del curso
// ─────────────────────────────────────────────
const LECCION_VACIA = { titulo: '', descripcion: '', videoUrl: '', pdfUrl: '', orden: '', activo: true }

function Lecciones({ curso, mostrarMsg, alGuardar }) {
  const [form, setForm] = useState(LECCION_VACIA)
  const [editandoId, setEditandoId] = useState(null)
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [subiendoPdf, setSubiendoPdf] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()
  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const nueva = () => {
    vibrar()
    setForm({ ...LECCION_VACIA, orden: curso.lecciones.length + 1 })
    setEditandoId(null)
    setError('')
    setAbierto(true)
  }

  const editar = (leccion) => {
    vibrar()
    setForm({
      titulo: leccion.titulo || '',
      descripcion: leccion.descripcion || '',
      videoUrl: leccion.videoUrl || '',
      pdfUrl: leccion.pdfUrl || '',
      orden: leccion.orden ?? '',
      activo: leccion.activo,
    })
    setEditandoId(leccion.id)
    setError('')
    setAbierto(true)
  }

  const cerrar = () => { setAbierto(false); setEditandoId(null); setForm(LECCION_VACIA); setError('') }

  const subirPdf = async (archivo) => {
    if (!archivo) return
    if (archivo.type !== 'application/pdf') return setError('El archivo tiene que ser un PDF.')
    if (archivo.size > 10 * 1024 * 1024) return setError('El PDF pesa más de 10 MB. Probá comprimirlo.')
    setSubiendoPdf(true)
    setError('')
    try {
      const { url } = await api.subirDocumento(archivo)
      if (!url) throw new Error()
      cambiar('pdfUrl', url)
    } catch {
      setError('No se pudo subir el PDF.')
    } finally {
      setSubiendoPdf(false)
    }
  }

  const guardar = async () => {
    vibrar()
    setError('')
    if (!form.titulo.trim()) return setError('Poné un título para la lección.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo.')
    setGuardando(true)
    try {
      if (editandoId) await api.actualizarLeccion(editandoId, form)
      else await api.crearLeccion(curso.id, form)
      mostrarMsg(editandoId ? 'Lección actualizada' : 'Lección creada')
      cerrar()
      alGuardar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const cambiarVisibilidad = async (leccion) => {
    vibrar()
    try {
      await api.actualizarLeccion(leccion.id, { activo: !leccion.activo })
      mostrarMsg(leccion.activo ? 'Lección ocultada' : 'Lección publicada')
      alGuardar()
    } catch (err) {
      mostrarMsg(err.message)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#555]">
          Lecciones · {curso.lecciones.filter((l) => l.activo).length}{curso.totalVideos ? ` de ${curso.totalVideos}` : ''}
        </h3>
        {!abierto && <button onClick={nueva} className={botonVerde}>+ Nueva lección</button>}
      </div>

      {abierto && (
        <div className="bg-[#F5F0EB] rounded-2xl p-4 mb-5">
          <h4 className="text-sm font-semibold mb-3 text-[#555]">{editandoId ? 'Editar lección' : 'Nueva lección'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">
            <div>
              <label className={estiloLabel}>Título</label>
              <input value={form.titulo} onChange={(e) => cambiar('titulo', e.target.value)} className={`${estiloInput} bg-white`} />
            </div>
            <div>
              <label className={estiloLabel}>Orden</label>
              <input type="number" min="0" value={form.orden} onChange={(e) => cambiar('orden', e.target.value)} className={`${estiloInput} bg-white`} />
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Descripción (opcional)</label>
              <textarea rows={2} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} className={`${estiloArea} bg-white`} />
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Link del video en YouTube (No listado)</label>
              <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className={`${estiloInput} bg-white`} />
              {form.videoUrl && esLinkValido(form.videoUrl) && (
                <div className="mt-3 max-w-sm"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Material en PDF</label>
              <div className="flex flex-wrap gap-3 items-center">
                {form.pdfUrl && (
                  <a href={form.pdfUrl} target="_blank" rel="noreferrer" className="text-[#7B9B77] text-sm underline">📄 Ver PDF cargado</a>
                )}
                <label className={`${botonBorde} cursor-pointer bg-white`}>
                  {subiendoPdf ? 'Subiendo…' : form.pdfUrl ? 'Reemplazar PDF' : 'Subir PDF'}
                  <input type="file" accept="application/pdf" className="hidden" disabled={subiendoPdf}
                    onChange={(e) => subirPdf(e.target.files[0])} />
                </label>
                {form.pdfUrl && <button onClick={() => cambiar('pdfUrl', '')} className="text-red-400 text-xs">Quitar</button>}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#555] cursor-pointer">
              <input type="checkbox" checked={form.activo} onChange={(e) => cambiar('activo', e.target.checked)} />
              Publicada (la ven los alumnos)
            </label>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <div className="flex gap-3 mt-4">
            <button onClick={guardar} disabled={guardando || subiendoPdf} className={botonVerde}>
              {guardando ? 'Guardando…' : editandoId ? 'Guardar cambios' : 'Crear lección'}
            </button>
            <button onClick={() => { vibrar(); cerrar() }} className="text-[#A9A9A2] text-xs tracking-widest uppercase px-4 py-2">Cancelar</button>
          </div>
        </div>
      )}

      {curso.lecciones.length === 0 ? (
        <p className="text-[#A9A9A2] text-sm">Todavía no hay lecciones en este curso.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {curso.lecciones.map((leccion) => (
            <li key={leccion.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 border border-[#D8A48F]/20 rounded-xl px-4 py-3 ${leccion.activo ? '' : 'opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[#7B9B77] text-sm font-medium truncate">{leccion.orden}. {leccion.titulo}</p>
                <p className="text-[11px] text-[#A9A9A2]">
                  {leccion.videoUrl ? '▶ Video' : <span className="text-red-400">Sin video</span>}
                  {' · '}
                  {leccion.pdfUrl ? '📄 PDF' : 'Sin PDF'}
                  {!leccion.activo && <span className="text-red-400"> · Oculta</span>}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => editar(leccion)} className={botonBorde}>Editar</button>
                <button onClick={() => cambiarVisibilidad(leccion)}
                  className="border border-[#A9A9A2] text-[#A9A9A2] text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full hover:bg-[#A9A9A2]/10">
                  {leccion.activo ? 'Ocultar' : 'Publicar'}
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default AdminFormacion
