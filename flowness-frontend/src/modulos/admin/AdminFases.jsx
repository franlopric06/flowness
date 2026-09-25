import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Save, Loader2, AlertCircle, PlayCircle } from 'lucide-react'
import { confirmar } from '../../compartido/utilidades/dialogos'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { esLinkValido } from '../../compartido/utilidades/video'
import CampoVideoMuestra from './CampoVideoMuestra'
import * as api from './admin.servicio'

const FORM_VACIO = { numero: '', nombre: '', descripcion: '', videoUrl: '', muestraUrl: '' }
const estiloInput = 'input'
const estiloLabel = 'text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5'
const botonVerde = 'btn btn-primario btn-chico'

// Sección "Fases" del panel: las 6 fases que se explican en el Inicio.
function AdminFases({ mostrarMsg }) {
  const [fases, setFases] = useState([])
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()

  const cargar = useCallback(() => api.obtenerFases().then(setFases).catch(() => setError('No se pudieron cargar las fases')), [])
  useEffect(() => { cargar() }, [cargar])

  const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }))

  const nueva = () => {
    vibrar()
    const usados = new Set(fases.map((f) => f.numero))
    const siguiente = [1, 2, 3, 4, 5, 6].find((n) => !usados.has(n)) || fases.length + 1
    setForm({ ...FORM_VACIO, numero: siguiente })
    setEditandoId(null)
    setError('')
    setAbierto(true)
  }

  const editar = (fase) => {
    vibrar()
    setForm({ numero: fase.numero, nombre: fase.nombre, descripcion: fase.descripcion || '', videoUrl: fase.videoUrl || '', muestraUrl: fase.muestraUrl || '' })
    setEditandoId(fase.id)
    setError('')
    setAbierto(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const cerrar = () => { setAbierto(false); setEditandoId(null); setForm(FORM_VACIO); setError('') }

  const guardar = async () => {
    vibrar()
    setError('')
    if (!form.nombre.trim()) return setError('Poné el nombre de la fase.')
    if (form.videoUrl && !esLinkValido(form.videoUrl)) return setError('El link del video no es de YouTube. Revisalo o dejalo vacío.')
    setGuardando(true)
    try {
      if (editandoId) await api.actualizarFase(editandoId, form)
      else await api.crearFase(form)
      mostrarMsg(editandoId ? 'Fase actualizada' : 'Fase creada')
      cerrar()
      cargar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
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
        {!abierto && fases.length < 6 && <button onClick={nueva} className={botonVerde}><Plus size={14} /> Nueva fase</button>}
      </div>
      <p className="text-piedra text-xs mb-5">Se muestran en el Inicio para explicar por qué etapas pasa cada clase y qué beneficio da cada una.</p>

      {abierto && (
        <div className="card p-5 md:p-6 mb-6">
          <h3 className="titulo text-verde text-2xl mb-4">{editandoId ? 'Editar fase' : 'Nueva fase'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4">
            <div>
              <label className={estiloLabel}>Número</label>
              <input type="number" min="1" max="6" value={form.numero} onChange={(e) => cambiar('numero', e.target.value)} className={estiloInput} />
            </div>
            <div>
              <label className={estiloLabel}>Nombre</label>
              <input value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} placeholder="Ej: Respiración consciente" className={estiloInput} />
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Qué se trabaja y qué beneficio da</label>
              <textarea rows={4} value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)}
                className="input" />
            </div>
            <div className="md:col-span-2">
              <CampoVideoMuestra valor={form.muestraUrl} alCambiar={(url) => cambiar('muestraUrl', url)} formato="aspect-[9/16]"
                etiqueta="Video corto de la fase (se ve en la tarjeta)"
                ayuda="Vertical, de 10 a 20 segundos, mostrando el movimiento de esta fase. Se ve de fondo, sin sonido y en bucle." />
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Video completo en YouTube (opcional)</label>
              <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className={estiloInput} />
              {form.videoUrl && esLinkValido(form.videoUrl) && (
                <div className="mt-3 max-w-sm"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
              )}
            </div>
          </div>
          {error && <p className="flex items-center gap-2 text-error text-sm bg-error/5 rounded-md px-3 py-2 mt-4"><AlertCircle size={15} className="shrink-0" />{error}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={guardar} disabled={guardando} className={botonVerde}>
              {guardando ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Save size={14} /> {editandoId ? 'Guardar cambios' : 'Crear fase'}</>}
            </button>
            <button onClick={() => { vibrar(); cerrar() }} className="btn btn-chico text-texto/60 hover:text-texto">Cancelar</button>
          </div>
        </div>
      )}

      {fases.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay fases cargadas. Tocá "Nueva fase" para crear la primera.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fases.map((fase) => (
            <div key={fase.id} className="card card-elevable p-5">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 shrink-0 rounded-full bg-verde text-blanco flex items-center justify-center titulo text-lg">{fase.numero}</span>
                <div className="min-w-0">
                  <p className="titulo text-verde text-xl">{fase.nombre}</p>
                  {fase.videoUrl && <p className="flex items-center gap-1 text-terracota text-[0.65rem] tracking-widest uppercase"><PlayCircle size={12} /> Con video</p>}
                </div>
              </div>
              <p className="text-texto/60 text-xs mt-3 line-clamp-3">{fase.descripcion}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => editar(fase)}
                  className="btn btn-secundario btn-chico"><Pencil size={13} /> Editar</button>
                <button onClick={() => eliminar(fase)}
                  className="btn btn-chico border border-error/40 text-error hover:bg-error/5"><Trash2 size={13} /> Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminFases
