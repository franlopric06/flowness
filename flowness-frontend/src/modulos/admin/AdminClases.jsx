import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Eye, EyeOff, Save, Loader2, Upload, X, AlertCircle, Sparkles, Clock, ShoppingBag, VideoOff } from 'lucide-react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { esLinkValido, formatearPrecio } from '../../compartido/utilidades/video'
import CampoVideoMuestra from './CampoVideoMuestra'
import * as api from './admin.servicio'

const FORM_VACIO = {
  nombre: '', descripcion: '', videoUrl: '', miniaturaUrl: '', muestraUrl: '',
  duracion: '', precio: '', esGratis: false, orden: '', activo: true,
}

const estiloInput = 'input'
const estiloLabel = 'text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5'

// Sección "Clases" del panel: crear, editar, ocultar y publicar clases.
function AdminClases({ mostrarMsg }) {
  const [clases, setClases] = useState([])
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null) // null = creando una nueva
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()

  const cargar = useCallback(() => api.obtenerClasesAdmin().then(setClases).catch(() => setError('No se pudieron cargar las clases')), [])
  useEffect(() => { cargar() }, [cargar])

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const nueva = () => {
    vibrar()
    setForm({ ...FORM_VACIO, orden: clases.length + 1 })
    setEditandoId(null)
    setError('')
    setAbierto(true)
  }

  const editar = (clase) => {
    vibrar()
    setForm({
      nombre: clase.nombre || '',
      descripcion: clase.descripcion || '',
      videoUrl: clase.videoUrl || '',
      miniaturaUrl: clase.miniaturaUrl || '',
      muestraUrl: clase.muestraUrl || '',
      duracion: clase.duracion || '',
      precio: clase.precio || '',
      esGratis: clase.esGratis,
      orden: clase.orden ?? '',
      activo: clase.activo,
    })
    setEditandoId(clase.id)
    setError('')
    setAbierto(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cerrar = () => { setAbierto(false); setEditandoId(null); setForm(FORM_VACIO); setError('') }

  const subirMiniatura = async (archivo) => {
    if (!archivo) return
    setSubiendoImagen(true)
    try {
      const { url, error: err } = await api.subirImagen(archivo)
      if (!url) throw new Error(err)
      cambiar('miniaturaUrl', url)
      mostrarMsg('Imagen subida')
    } catch (error) {
      setError(`No se pudo subir la imagen. ${error.message || ''}`)
    } finally {
      setSubiendoImagen(false)
    }
  }

  const guardar = async () => {
    vibrar()
    setError('')
    if (!form.nombre.trim()) return setError('Poné un nombre para la clase.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo.')
    if (!form.esGratis && !(Number(form.precio) > 0)) return setError('Poné un precio o marcá la clase como gratis.')

    setGuardando(true)
    try {
      if (editandoId) await api.actualizarClase(editandoId, form)
      else await api.crearClase(form)
      mostrarMsg(editandoId ? 'Clase actualizada' : 'Clase creada')
      cerrar()
      cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const cambiarVisibilidad = async (clase) => {
    vibrar()
    try {
      await api.actualizarClase(clase.id, { activo: !clase.activo })
      mostrarMsg(clase.activo ? 'Clase ocultada' : 'Clase publicada')
      cargar()
    } catch {
      // el aviso de error lo muestra el cliente de la API
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="titulo text-verde text-3xl">Clases</h2>
        {!abierto && (
          <button onClick={nueva} className="btn btn-primario btn-chico">
            <Plus size={14} /> Nueva clase
          </button>
        )}
      </div>

      {/* Formulario */}
      {abierto && (
        <div className="card p-5 md:p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4 text-texto">{editandoId ? 'Editar clase' : 'Nueva clase'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={estiloLabel}>Nombre</label>
              <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} className={estiloInput} />
            </div>

            <div className="md:col-span-2">
              <label className={estiloLabel}>Descripción</label>
              <textarea value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} rows={3}
                className="input" />
            </div>

            {/* Video */}
            <div className="md:col-span-2">
              <label className={estiloLabel}>Link del video en YouTube</label>
              <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)}
                placeholder="https://youtu.be/..." className={estiloInput} />
              <p className="text-piedra text-[11px] mt-1 px-2">
                Subilo a YouTube como <strong>No listado</strong> (no como Privado, porque así no se puede ver desde la página).
                El link solo se le muestra a quien tiene acceso a la clase.
              </p>
              {form.videoUrl && esLinkValido(form.videoUrl) && (
                <div className="mt-3 max-w-md"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
              )}
            </div>

            {/* Adelanto en video */}
            <div className="md:col-span-2">
              <CampoVideoMuestra valor={form.muestraUrl} alCambiar={(url) => cambiar('muestraUrl', url)}
                etiqueta="Adelanto de la clase (se ve en la tarjeta)"
                ayuda="Horizontal, de 10 a 20 segundos, con lo mejor de la clase. Es un video aparte: la clase completa sigue protegida." />
            </div>

            {/* Miniatura */}
            <div className="md:col-span-2">
              <label className={estiloLabel}>Imagen de portada (opcional)</label>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                {form.miniaturaUrl && (
                  <img src={form.miniaturaUrl} alt="" className="h-20 aspect-video object-cover rounded-lg border border-terracota/20" />
                )}
                <label className="btn btn-secundario btn-chico cursor-pointer">
                  {subiendoImagen ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> Subir imagen</>}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
                    onChange={(e) => subirMiniatura(e.target.files[0])} disabled={subiendoImagen} />
                </label>
                {form.miniaturaUrl && (
                  <button onClick={() => cambiar('miniaturaUrl', '')} className="btn btn-chico text-error hover:bg-error/5"><X size={13} /> Quitar</button>
                )}
              </div>
            </div>

            <div>
              <label className={estiloLabel}>Duración</label>
              <input value={form.duracion} onChange={(e) => cambiar('duracion', e.target.value)} placeholder="Ej: 45 min" className={estiloInput} />
            </div>

            <div>
              <label className={estiloLabel}>Orden en el catálogo</label>
              <input type="number" min="0" value={form.orden} onChange={(e) => cambiar('orden', e.target.value)} className={estiloInput} />
            </div>

            <div>
              <label className={estiloLabel}>Precio (ARS)</label>
              <input type="number" min="0" value={form.esGratis ? '' : form.precio} disabled={form.esGratis}
                onChange={(e) => cambiar('precio', e.target.value)} placeholder={form.esGratis ? 'Gratis' : 'Ej: 5000'}
                className={`${estiloInput} disabled:bg-crema`} />
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

          {error && <p className="flex items-center gap-2 text-error text-sm bg-error/5 rounded-md px-3 py-2 mt-4"><AlertCircle size={15} className="shrink-0" />{error}</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={guardar} disabled={guardando || subiendoImagen}
              className="btn btn-primario btn-chico">
              {guardando ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Save size={14} /> {editandoId ? 'Guardar cambios' : 'Crear clase'}</>}
            </button>
            <button onClick={() => { vibrar(); cerrar() }} className="btn btn-chico text-texto/60 hover:text-texto">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Listado */}
      {clases.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay clases. Tocá "Nueva clase" para crear la primera.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {clases.map((clase) => (
            <div key={clase.id}
              className={`card p-3 flex flex-col sm:flex-row sm:items-center gap-3 ${clase.activo ? '' : 'opacity-60'}`}>
              <div className="h-16 aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-verde/25 to-terracota/25 shrink-0 flex items-center justify-center">
                {clase.miniaturaUrl
                  ? <img src={clase.miniaturaUrl} alt="" className="h-full w-full object-cover" />
                  : <img src="/logo.png" alt="" className="h-8 w-8 opacity-40" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="titulo text-verde text-xl truncate">{clase.orden}. {clase.nombre}</p>
                <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                  <span className={`chip ${clase.esGratis ? 'chip-terracota' : 'bg-arena/60 text-texto'}`}>
                    {clase.esGratis ? <><Sparkles size={11} /> Gratis</> : formatearPrecio(clase.precio)}
                  </span>
                  {clase.duracion && <span className="flex items-center gap-1 text-piedra"><Clock size={12} /> {clase.duracion}</span>}
                  {!clase.esGratis && <span className="flex items-center gap-1 text-piedra"><ShoppingBag size={12} /> {clase.ventas} {clase.ventas === 1 ? 'venta' : 'ventas'}</span>}
                  {!clase.videoUrl && <span className="flex items-center gap-1 text-error"><VideoOff size={12} /> Sin video</span>}
                  {!clase.activo && <span className="flex items-center gap-1 text-error"><EyeOff size={12} /> Oculta</span>}
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button onClick={() => editar(clase)}
                  className="btn btn-secundario btn-chico">
                  <Pencil size={13} /> Editar
                </button>
                <button onClick={() => cambiarVisibilidad(clase)}
                  className="btn btn-chico border border-piedra/60 text-texto/70 hover:bg-crema">
                  {clase.activo ? <><EyeOff size={13} /> Ocultar</> : <><Eye size={13} /> Publicar</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminClases
