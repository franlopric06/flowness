import { useState } from 'react'
import { Plus, Trash2, Loader2, Megaphone } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { confirmar } from '../../../compartido/utilidades/dialogos'
import { estiloLabel } from '../componentes/estilos'
import { useCargar } from '../componentes/useCargar'
import * as api from '../admin.servicio'

// Sección "Avisos" del panel: novedades que se muestran en el Inicio
function AdminAvisos() {
  const [avisos, recargar] = useCargar(api.obtenerAvisos, [])
  const [form, setForm] = useState({ titulo: '', descripcion: '' })
  const [guardando, setGuardando] = useState(false)

  const publicar = async () => {
    if (!form.titulo.trim()) return avisar('Poné un título para el aviso.', 'alerta')
    setGuardando(true)
    try {
      await api.crearAviso(form)
      setForm({ titulo: '', descripcion: '' })
      await recargar()
      avisar('Aviso publicado')
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
    setGuardando(false)
  }

  const eliminar = async (aviso) => {
    if (!(await confirmar(`¿Eliminar el aviso "${aviso.titulo}"?`, { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarAviso(aviso.id)
      await recargar()
      avisar('Aviso eliminado')
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
  }

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-2">Avisos</h2>
      <p className="text-piedra text-xs mb-5">Se muestran como "Novedades" en el Inicio.</p>
      <div className="card p-5 md:p-6 mb-6 space-y-3">
        <div>
          <label className={estiloLabel}>Título</label>
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="input" />
        </div>
        <div>
          <label className={estiloLabel}>Descripción</label>
          <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="input" />
        </div>
        <button onClick={publicar} disabled={guardando} className="btn btn-primario btn-chico">
          {guardando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Publicar aviso
        </button>
      </div>
      {(avisos || []).length === 0 ? (
        <p className="text-piedra text-sm">No hay avisos publicados.</p>
      ) : (
        <ul className="space-y-3">
          {avisos.map((a) => (
            <li key={a.id} className="card p-4 flex gap-4 items-start">
              <span className="icono-caja bg-terracota/15 text-terracota"><Megaphone size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-texto">{a.titulo}</p>
                <p className="text-texto/60 text-xs whitespace-pre-line">{a.descripcion}</p>
              </div>
              <button onClick={() => eliminar(a)} aria-label="Eliminar aviso" title="Eliminar"
                className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full text-error hover:bg-error/10 transition-colors">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminAvisos
