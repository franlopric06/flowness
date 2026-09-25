import { useState, useEffect } from 'react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { esLinkValido } from '../../compartido/utilidades/video'
import * as api from './admin.servicio'

const FORM_VACIO = { numero: '', nombre: '', descripcion: '', videoUrl: '' }
const estiloInput = 'w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none focus:border-[#7B9B77]'
const estiloLabel = 'text-[#A9A9A2] text-[11px] tracking-widest uppercase block mb-1'
const botonVerde = 'bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50'

// Sección "Fases" del panel: las 6 fases que se explican en el Inicio.
function AdminFases({ mostrarMsg }) {
  const [fases, setFases] = useState([])
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [abierto, setAbierto] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()

  const cargar = () => api.obtenerFases().then(setFases).catch(() => setError('No se pudieron cargar las fases'))
  useEffect(() => { cargar() }, [])

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
    setForm({ numero: fase.numero, nombre: fase.nombre, descripcion: fase.descripcion || '', videoUrl: fase.videoUrl || '' })
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
    if (!window.confirm(`¿Eliminar la fase ${fase.numero}?`)) return
    vibrar()
    await api.eliminarFase(fase.id)
    mostrarMsg('Fase eliminada')
    cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[#7B9B77] font-semibold">Las 6 fases del método</h2>
        {!abierto && fases.length < 6 && <button onClick={nueva} className={botonVerde}>+ Nueva fase</button>}
      </div>
      <p className="text-[#A9A9A2] text-xs mb-5">Se muestran en el Inicio para explicar por qué etapas pasa cada clase y qué beneficio da cada una.</p>

      {abierto && (
        <div className="bg-white rounded-2xl p-5 mb-6 border border-[#D8A48F]/20">
          <h3 className="text-sm font-semibold mb-4 text-[#555]">{editandoId ? 'Editar fase' : 'Nueva fase'}</h3>
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
                className="w-full border border-[#D8A48F]/30 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#7B9B77]" />
            </div>
            <div className="md:col-span-2">
              <label className={estiloLabel}>Video de muestra en YouTube (opcional)</label>
              <input value={form.videoUrl} onChange={(e) => cambiar('videoUrl', e.target.value)} placeholder="https://youtu.be/..." className={estiloInput} />
              {form.videoUrl && esLinkValido(form.videoUrl) && (
                <div className="mt-3 max-w-sm"><ReproductorVideo url={form.videoUrl} titulo="Vista previa" /></div>
              )}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <div className="flex gap-3 mt-5">
            <button onClick={guardar} disabled={guardando} className={botonVerde}>
              {guardando ? 'Guardando…' : editandoId ? 'Guardar cambios' : 'Crear fase'}
            </button>
            <button onClick={() => { vibrar(); cerrar() }} className="text-[#A9A9A2] text-xs tracking-widest uppercase px-4 py-2">Cancelar</button>
          </div>
        </div>
      )}

      {fases.length === 0 ? (
        <p className="text-[#A9A9A2] text-sm">Todavía no hay fases cargadas. Tocá "Nueva fase" para crear la primera.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fases.map((fase) => (
            <div key={fase.id} className="bg-white rounded-2xl p-4 border border-[#D8A48F]/20">
              <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase">Fase {fase.numero}{fase.videoUrl && ' · con video'}</p>
              <p className="text-[#7B9B77] font-semibold text-sm">{fase.nombre}</p>
              <p className="text-[#A9A9A2] text-xs mt-1 line-clamp-3">{fase.descripcion}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => editar(fase)}
                  className="border border-[#7B9B77] text-[#7B9B77] text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full hover:bg-[#7B9B77]/10">Editar</button>
                <button onClick={() => eliminar(fase)}
                  className="border border-red-300 text-red-400 text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full hover:bg-red-50">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminFases
