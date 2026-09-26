import { useState } from 'react'
import { Loader2, Upload, UserRound } from 'lucide-react'
import { avisar } from '../../../compartido/utilidades/avisos'
import { estiloLabel } from '../componentes/estilos'
import { useCargar } from '../componentes/useCargar'
import BotonGuardar from '../componentes/BotonGuardar'
import VideoHistoria from './VideoHistoria'
import * as api from '../admin.servicio'

const CAMPOS = [
  ['nombre', 'Nombre'],
  ['titulo', 'Título (ej: Profesora de Educación Física)'],
  ['descripcion1', 'Texto principal'],
  ['descripcion2', 'Texto destacado (frase o cita)'],
]

// Sección "Sobre mí" del panel: foto o video, nombre y textos
function AdminSobreMi() {
  const [sobreMi, recargar] = useCargar(api.obtenerSobreMi)
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)

  const valor = (campo) => form[campo] ?? sobreMi?.[campo] ?? ''
  const cambiar = (campo, v) => setForm((f) => ({ ...f, [campo]: v }))

  const subirFoto = async (archivo) => {
    if (!archivo) return
    setSubiendoFoto(true)
    const { url } = await api.subirImagen(archivo)
    setSubiendoFoto(false)
    if (url) {
      cambiar('fotoUrl', url)
      avisar('Foto subida. Tocá "Guardar" para aplicarla.', 'info')
    }
  }

  const guardar = async () => {
    setGuardando(true)
    try {
      await api.actualizarSobreMi({ ...sobreMi, ...form })
      setForm({})
      await recargar()
      avisar('Sobre mí guardado')
    } catch { /* el aviso de error lo muestra el cliente de la API */ }
    setGuardando(false)
  }

  const foto = valor('fotoUrl')

  return (
    <div>
      <h2 className="titulo text-verde text-3xl mb-5">Sobre mí</h2>
      <div className="card p-5 md:p-6 grid md:grid-cols-[200px_1fr] gap-6">
        <div>
          <label className={estiloLabel}>Foto</label>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-arena/40 flex items-center justify-center mb-3">
            {foto ? <img src={foto} alt="" className="w-full h-full object-cover" /> : <UserRound size={40} className="text-piedra" />}
          </div>
          <label className="btn btn-chico btn-secundario w-full cursor-pointer">
            {subiendoFoto ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> Cambiar foto</>}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={subiendoFoto}
              onChange={(e) => subirFoto(e.target.files[0])} />
          </label>
        </div>
        <VideoHistoria valor={valor('videoUrl')} alCambiar={(v) => cambiar('videoUrl', v)} />
        <div className="space-y-4">
          {CAMPOS.map(([campo, etiqueta]) => (
            <div key={campo}>
              <label className={estiloLabel}>{etiqueta}</label>
              {campo.startsWith('descripcion') ? (
                <textarea rows={campo === 'descripcion1' ? 6 : 3} value={valor(campo)} onChange={(e) => cambiar(campo, e.target.value)} className="input" />
              ) : (
                <input value={valor(campo)} onChange={(e) => cambiar(campo, e.target.value)} className="input" />
              )}
            </div>
          ))}
          <BotonGuardar guardando={guardando} onClick={guardar} />
        </div>
      </div>
    </div>
  )
}

export default AdminSobreMi
