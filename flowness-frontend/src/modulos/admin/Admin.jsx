import { useState, useEffect } from 'react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import * as api from './admin.servicio'
import AdminFases from './AdminFases'
import AdminClases from './AdminClases'
import AdminFormacion from './AdminFormacion'
import AdminGaleria from './AdminGaleria'

const SECCIONES = ['Fases', 'Clases', 'Formación', 'Galería', 'Avisos', 'Sobre mí', 'Configuración', 'Usuarios']

function Admin() {
  const [seccion, setSeccion] = useState('Fases')
  const [datos, setDatos] = useState({})
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')
  const vibrar = useVibrar()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    cargarDatos()
  }, [seccion])

  const cargarDatos = async () => {
    try {
      if (seccion === 'Avisos') setDatos({ avisos: await api.obtenerAvisos() })
      if (seccion === 'Sobre mí') setDatos({ sobreMi: await api.obtenerSobreMi() })
      if (seccion === 'Configuración') setDatos({ config: await api.obtenerConfiguracion() })
      if (seccion === 'Usuarios') setDatos({ usuarios: await api.obtenerUsuarios() })
    } catch {}
  }

  const mostrarMsg = (texto) => { setMsg(texto); setTimeout(() => setMsg(''), 3000) }

  if (usuario.rol !== 'ADMIN') {
    return <main className="pt-32 min-h-screen flex items-center justify-center"><p className="text-[#A9A9A2]">Acceso denegado.</p></main>
  }

  return (
    <main className="pt-24 min-h-screen bg-[#F5F0EB]">
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h1 className="text-[#7B9B77] text-2xl font-bold tracking-widest mb-6">Panel Admin</h1>
        {msg && <div className="bg-[#7B9B77]/10 border border-[#7B9B77]/20 text-[#7B9B77] text-sm px-4 py-3 rounded-xl mb-4">{msg}</div>}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECCIONES.map(s => (
            <button key={s} onClick={() => { vibrar(); setSeccion(s); setForm({}) }}
              className={`text-xs tracking-widest uppercase px-5 py-2 rounded-full transition-colors ${seccion === s ? 'bg-[#7B9B77] text-white' : 'border border-[#7B9B77] text-[#7B9B77] hover:bg-[#7B9B77]/10'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Fases (componente propio) */}
        {seccion === 'Fases' && <AdminFases mostrarMsg={mostrarMsg} />}

        {/* Clases (componente propio) */}
        {seccion === 'Clases' && <AdminClases mostrarMsg={mostrarMsg} />}
        {seccion === 'Formación' && <AdminFormacion mostrarMsg={mostrarMsg} />}
        {seccion === 'Galería' && <AdminGaleria mostrarMsg={mostrarMsg} />}

        {/* Avisos */}
        {seccion === 'Avisos' && (
          <div>
            <div className="bg-white rounded-2xl p-5 mb-6 border border-[#D8A48F]/20">
              <input placeholder="Título" value={form.titulo || ''} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none mb-3" />
              <textarea placeholder="Descripción" value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })} className="w-full border border-[#D8A48F]/30 rounded-xl px-4 py-2 text-sm outline-none mb-3" rows={3} />
              <button onClick={async () => { vibrar(); await api.crearAviso(form); setForm({}); cargarDatos(); mostrarMsg('Aviso publicado') }}
                className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-2 rounded-full">Publicar aviso</button>
            </div>
            {(datos.avisos || []).map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-4 mb-3 border border-[#D8A48F]/20 flex justify-between">
                <div><p className="font-medium text-sm">{a.titulo}</p><p className="text-[#A9A9A2] text-xs">{a.descripcion}</p></div>
                <button onClick={async () => { vibrar(); await api.eliminarAviso(a.id); cargarDatos() }} className="text-red-400 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Sobre mí */}
        {seccion === 'Sobre mí' && (
          <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
            {['nombre', 'titulo', 'descripcion1', 'descripcion2', 'fotoUrl'].map(campo => (
              <div key={campo} className="mb-3">
                <label className="text-[#A9A9A2] text-xs tracking-widest uppercase block mb-1">{campo}</label>
                {campo.startsWith('descripcion') ? (
                  <textarea value={form[campo] ?? datos.sobreMi?.[campo] ?? ''} onChange={e => setForm({ ...form, [campo]: e.target.value })} className="w-full border border-[#D8A48F]/30 rounded-xl px-4 py-2 text-sm outline-none" rows={3} />
                ) : (
                  <input value={form[campo] ?? datos.sobreMi?.[campo] ?? ''} onChange={e => setForm({ ...form, [campo]: e.target.value })} className="w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none" />
                )}
              </div>
            ))}
            <button onClick={async () => { vibrar(); await api.actualizarSobreMi({ ...datos.sobreMi, ...form }); cargarDatos(); mostrarMsg('Guardado') }}
              className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-2 rounded-full">Guardar</button>
          </div>
        )}

        {/* Configuración */}
        {seccion === 'Configuración' && (
          <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
            <p className="text-[#A9A9A2] text-xs mb-4">Editá los textos e info del sitio:</p>
            {[
              ['hero_titulo', 'Título del hero'],
              ['hero_subtitulo', 'Subtítulo del hero'],
              ['hero_descripcion', 'Descripción del hero'],
              ['instagram_url', 'URL de Instagram'],
              ['whatsapp_numero', 'Número de WhatsApp (con código de país, sin +)'],
              ['popup_instagram', 'Usuario de Instagram para el popup'],
              ['popup_texto', 'Texto del popup'],
            ].map(([clave, label]) => (
              <div key={clave} className="mb-3">
                <label className="text-[#A9A9A2] text-xs tracking-widest uppercase block mb-1">{label}</label>
                <input
                  value={form[clave] ?? datos.config?.[clave] ?? ''}
                  onChange={e => setForm({ ...form, [clave]: e.target.value })}
                  className="w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none"
                />
              </div>
            ))}
            <button onClick={async () => { vibrar(); await api.actualizarConfiguracion(form); setForm({}); cargarDatos(); mostrarMsg('Configuración guardada') }}
              className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-6 py-2 rounded-full">Guardar configuración</button>
          </div>
        )}

        {/* Usuarios */}
        {seccion === 'Usuarios' && (
          <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
            <table className="w-full text-sm">
              <thead><tr className="text-[#A9A9A2] text-xs tracking-widest uppercase border-b border-[#D8A48F]/20">
                <th className="pb-2 text-left">Nombre</th><th className="pb-2 text-left">Email</th><th className="pb-2 text-left">Rol</th>
              </tr></thead>
              <tbody>
                {(datos.usuarios || []).map(u => (
                  <tr key={u.id} className="border-b border-[#F5F0EB]">
                    <td className="py-2">{u.nombre}</td>
                    <td className="py-2 text-[#A9A9A2]">{u.email}</td>
                    <td className="py-2"><span className={`text-xs px-2 py-1 rounded-full ${u.rol === 'ADMIN' ? 'bg-[#7B9B77]/20 text-[#7B9B77]' : 'bg-[#D8A48F]/20 text-[#D8A48F]'}`}>{u.rol}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}

export default Admin
