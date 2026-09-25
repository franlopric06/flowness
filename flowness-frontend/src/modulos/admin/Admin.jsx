import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Layers, Clapperboard, GraduationCap, Images, Megaphone, UserRound, Settings, Users,
  Plus, Trash2, Save, Loader2, Upload, ShieldAlert, ExternalLink, X,
} from 'lucide-react'
import { avisar } from '../../compartido/utilidades/avisos'
import { confirmar } from '../../compartido/utilidades/dialogos'
import { tabContent } from '../../compartido/utilidades/animaciones'
import EstadoVacio from '../../compartido/componentes/EstadoVacio'
import * as api from './admin.servicio'
import AdminFases from './AdminFases'
import AdminClases from './AdminClases'
import AdminFormacion from './AdminFormacion'
import AdminGaleria from './AdminGaleria'
import CampoVideoMuestra from './CampoVideoMuestra'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'

const SECCIONES = [
  ['Fases', Layers],
  ['Clases', Clapperboard],
  ['Formación', GraduationCap],
  ['Galería', Images],
  ['Avisos', Megaphone],
  ['Sobre mí', UserRound],
  ['Configuración', Settings],
  ['Usuarios', Users],
]

const estiloLabel = 'text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5'

const CAMPOS_SOBRE_MI = [
  ['nombre', 'Nombre'],
  ['titulo', 'Título (ej: Profesora de Educación Física)'],
  ['descripcion1', 'Texto principal'],
  ['descripcion2', 'Texto destacado (frase o cita)'],
]

const CAMPOS_CONFIG = [
  ['hero_titulo', 'Título de la portada'],
  ['hero_subtitulo', 'Subtítulo de la portada'],
  ['hero_descripcion', 'Descripción de la portada'],
  ['instagram_url', 'Link de Instagram'],
  ['whatsapp_numero', 'Número de WhatsApp (con código de país, sin +)'],
  ['popup_instagram', 'Usuario de Instagram para el cartel'],
  ['popup_texto', 'Texto del cartel de Instagram'],
]

// Los avisos de éxito / error se muestran con el sistema de avisos del sitio
const mostrarMsg = (texto, tipo = 'exito') => avisar(texto, tipo)

function Admin() {
  const [seccion, setSeccion] = useState('Fases')
  const [datos, setDatos] = useState({})
  const [form, setForm] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  // Qué datos pide cada sección que se maneja acá mismo
  const cargarDatos = useCallback(() => {
    const pedidos = {
      'Avisos': ['avisos', api.obtenerAvisos],
      'Sobre mí': ['sobreMi', api.obtenerSobreMi],
      'Configuración': ['config', api.obtenerConfiguracion],
      'Usuarios': ['usuarios', api.obtenerUsuarios],
    }
    const pedido = pedidos[seccion]
    if (!pedido) return Promise.resolve()
    const [clave, pedir] = pedido
    return pedir()
      .then((valor) => setDatos({ [clave]: valor }))
      .catch(() => mostrarMsg('No se pudieron cargar los datos', 'error'))
  }, [seccion])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  const cambiarSeccion = (s) => {
    setSeccion(s)
    setForm({})
    setDatos({})
  }

  // Ejecuta una acción de guardado con indicador de carga y aviso de éxito
  const guardar = async (accion, mensaje) => {
    setGuardando(true)
    try {
      await accion()
      setForm({})
      await cargarDatos()
      mostrarMsg(mensaje)
    } catch {
      // El aviso de error ya lo muestra el cliente de la API
    } finally {
      setGuardando(false)
    }
  }

  const publicarAviso = () => {
    if (!form.titulo?.trim()) return mostrarMsg('Poné un título para el aviso.', 'alerta')
    guardar(() => api.crearAviso(form), 'Aviso publicado')
  }

  const eliminarAviso = async (aviso) => {
    if (!(await confirmar(`¿Eliminar el aviso "${aviso.titulo}"?`, { textoConfirmar: 'Eliminar' }))) return
    guardar(() => api.eliminarAviso(aviso.id), 'Aviso eliminado')
  }

  const [progresoVideo, setProgresoVideo] = useState(null)
  const subirVideoSobreMi = async (archivo) => {
    if (!archivo) return
    if (archivo.size > 100 * 1024 * 1024) return mostrarMsg('El video pesa más de 100 MB. Subilo a YouTube como No listado y pegá el link.', 'error')
    setProgresoVideo(0)
    const { url } = await api.subirVideo(archivo, setProgresoVideo)
    setProgresoVideo(null)
    if (url) {
      setForm((f) => ({ ...f, videoUrl: url }))
      mostrarMsg('Video subido. Tocá "Guardar" para aplicarlo.', 'info')
    }
  }

  const subirFotoSobreMi = async (archivo) => {
    if (!archivo) return
    setSubiendoFoto(true)
    const { url } = await api.subirImagen(archivo)
    setSubiendoFoto(false)
    if (url) {
      setForm((f) => ({ ...f, fotoUrl: url }))
      mostrarMsg('Foto subida. Tocá "Guardar" para aplicarla.', 'info')
    }
  }

  if (usuario.rol !== 'ADMIN') {
    return (
      <main className="contenedor pt-32 min-h-screen">
        <EstadoVacio icono={ShieldAlert} error titulo="Acceso denegado" texto="Esta sección es solo para la administración del sitio.">
          <Link to="/" className="btn btn-secundario">Ir al inicio</Link>
        </EstadoVacio>
      </main>
    )
  }

  const botonGuardar = (texto, alHacer) => (
    <button onClick={alHacer} disabled={guardando} className="btn btn-primario btn-chico">
      {guardando ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Save size={14} /> {texto}</>}
    </button>
  )

  const fotoActual = form.fotoUrl ?? datos.sobreMi?.fotoUrl
  const videoActual = form.videoUrl ?? datos.sobreMi?.videoUrl

  return (
    <main className="min-h-screen pt-20 md:pt-24">
      <div className="contenedor pb-20">
        <div className="flex flex-wrap items-end justify-between gap-3 mt-4 mb-6">
          <div>
            <p className="etiqueta mb-1">Hola, {usuario.nombre?.split(' ')[0]}</p>
            <h1 className="titulo text-verde text-4xl md:text-5xl">Panel de administración</h1>
          </div>
          <Link to="/" target="_blank" className="btn btn-chico btn-secundario"><ExternalLink size={14} /> Ver sitio</Link>
        </div>

        {/* Pestañas: en el celular se deslizan de costado */}
        <nav className="sticky top-16 md:top-20 z-20 -mx-5 px-5 md:mx-0 md:px-0 py-3 mb-6 bg-crema/90 backdrop-blur-md">
          <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap">
            {SECCIONES.map(([s, Icono]) => {
              const activa = seccion === s
              return (
                <button key={s} onClick={() => cambiarSeccion(s)}
                  className={`relative shrink-0 inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.14em] uppercase px-4 py-2.5 rounded-full transition-colors ${
                    activa ? 'text-blanco' : 'text-verde bg-blanco border border-verde/30 hover:border-verde'
                  }`}>
                  {activa && <motion.span layoutId="pestanaAdmin" className="absolute inset-0 bg-verde rounded-full -z-0" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <Icono size={15} className="relative" /><span className="relative">{s}</span>
                </button>
              )
            })}
          </div>
        </nav>

        <AnimatePresence mode="wait">
          <motion.section key={seccion} {...tabContent}>
            {seccion === 'Fases' && <AdminFases mostrarMsg={mostrarMsg} />}
            {seccion === 'Clases' && <AdminClases mostrarMsg={mostrarMsg} />}
            {seccion === 'Formación' && <AdminFormacion mostrarMsg={mostrarMsg} />}
            {seccion === 'Galería' && <AdminGaleria mostrarMsg={mostrarMsg} />}

            {/* Avisos */}
            {seccion === 'Avisos' && (
              <div>
                <h2 className="titulo text-verde text-3xl mb-2">Avisos</h2>
                <p className="text-piedra text-xs mb-5">Se muestran como "Novedades" en el Inicio.</p>
                <div className="card p-5 md:p-6 mb-6 space-y-3">
                  <div>
                    <label className={estiloLabel}>Título</label>
                    <input value={form.titulo || ''} onChange={(e) => setForm({ ...form, titulo: e.target.value })} className="input" />
                  </div>
                  <div>
                    <label className={estiloLabel}>Descripción</label>
                    <textarea rows={3} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="input" />
                  </div>
                  <button onClick={publicarAviso} disabled={guardando} className="btn btn-primario btn-chico">
                    {guardando ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Publicar aviso
                  </button>
                </div>
                {(datos.avisos || []).length === 0 ? (
                  <p className="text-piedra text-sm">No hay avisos publicados.</p>
                ) : (
                  <ul className="space-y-3">
                    {datos.avisos.map((a) => (
                      <li key={a.id} className="card p-4 flex gap-4 items-start">
                        <span className="icono-caja bg-terracota/15 text-terracota"><Megaphone size={18} /></span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-texto">{a.titulo}</p>
                          <p className="text-texto/60 text-xs whitespace-pre-line">{a.descripcion}</p>
                        </div>
                        <button onClick={() => eliminarAviso(a)} aria-label="Eliminar aviso" title="Eliminar"
                          className="w-9 h-9 shrink-0 inline-flex items-center justify-center rounded-full text-error hover:bg-error/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Sobre mí */}
            {seccion === 'Sobre mí' && (
              <div>
                <h2 className="titulo text-verde text-3xl mb-5">Sobre mí</h2>
                <div className="card p-5 md:p-6 grid md:grid-cols-[200px_1fr] gap-6">
                  <div>
                    <label className={estiloLabel}>Foto</label>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-arena/40 flex items-center justify-center mb-3">
                      {fotoActual ? <img src={fotoActual} alt="" className="w-full h-full object-cover" /> : <UserRound size={40} className="text-piedra" />}
                    </div>
                    <label className="btn btn-chico btn-secundario w-full cursor-pointer">
                      {subiendoFoto ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> Cambiar foto</>}
                      <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={subiendoFoto}
                        onChange={(e) => subirFotoSobreMi(e.target.files[0])} />
                    </label>
                  </div>
                  <div className="md:col-span-2 border-t border-terracota/15 pt-5">
                    <label className={estiloLabel}>Video de la historia (opcional)</label>
                    <p className="text-piedra text-xs mb-3">Si cargás un video, se muestra en lugar de la foto: en "Sobre mí" y en el Inicio. Puede ser un link de YouTube (No listado o público) o un archivo.</p>
                    <div className="grid md:grid-cols-[1fr_auto] gap-3 items-start">
                      <input value={videoActual || ''} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                        placeholder="https://youtu.be/... o subí el archivo" className="input" />
                      <div className="flex gap-2">
                        <label className={`btn btn-chico btn-secundario cursor-pointer ${progresoVideo !== null ? 'opacity-60 pointer-events-none' : ''}`}>
                          {progresoVideo !== null ? <><Loader2 size={14} className="animate-spin" /> {progresoVideo}%</> : <><Upload size={14} /> Subir video</>}
                          <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
                            onChange={(e) => { subirVideoSobreMi(e.target.files[0]); e.target.value = '' }} />
                        </label>
                        {videoActual && (
                          <button onClick={() => setForm({ ...form, videoUrl: '' })} className="btn btn-chico text-error hover:bg-error/5"><X size={13} /> Quitar</button>
                        )}
                      </div>
                    </div>
                    {videoActual && <div className="mt-4 max-w-md"><ReproductorVideo url={videoActual} titulo="Video de la historia" /></div>}
                  </div>
                  <div className="space-y-4">
                    {CAMPOS_SOBRE_MI.map(([campo, label]) => (
                      <div key={campo}>
                        <label className={estiloLabel}>{label}</label>
                        {campo.startsWith('descripcion') ? (
                          <textarea rows={campo === 'descripcion1' ? 6 : 3} value={form[campo] ?? datos.sobreMi?.[campo] ?? ''}
                            onChange={(e) => setForm({ ...form, [campo]: e.target.value })} className="input" />
                        ) : (
                          <input value={form[campo] ?? datos.sobreMi?.[campo] ?? ''} onChange={(e) => setForm({ ...form, [campo]: e.target.value })} className="input" />
                        )}
                      </div>
                    ))}
                    {botonGuardar('Guardar', () => guardar(() => api.actualizarSobreMi({ ...datos.sobreMi, ...form }), 'Sobre mí guardado'))}
                  </div>
                </div>
              </div>
            )}

            {/* Configuración */}
            {seccion === 'Configuración' && (
              <div>
                <h2 className="titulo text-verde text-3xl mb-2">Configuración</h2>
                <p className="text-piedra text-xs mb-5">Textos y datos de contacto del sitio.</p>
                <div className="card p-5 md:p-6 grid md:grid-cols-2 gap-4">
                  {CAMPOS_CONFIG.map(([clave, label]) => (
                    <div key={clave} className={clave === 'hero_descripcion' || clave === 'popup_texto' ? 'md:col-span-2' : ''}>
                      <label className={estiloLabel}>{label}</label>
                      {clave === 'hero_descripcion' ? (
                        <textarea rows={3} value={form[clave] ?? datos.config?.[clave] ?? ''} onChange={(e) => setForm({ ...form, [clave]: e.target.value })} className="input" />
                      ) : (
                        <input value={form[clave] ?? datos.config?.[clave] ?? ''} onChange={(e) => setForm({ ...form, [clave]: e.target.value })} className="input" />
                      )}
                    </div>
                  ))}
                  <div className="md:col-span-2 border-t border-terracota/15 pt-5">
                    <CampoVideoMuestra valor={form.hero_video ?? datos.config?.hero_video ?? ''}
                      alCambiar={(url) => setForm({ ...form, hero_video: url })}
                      etiqueta="Video de fondo de la portada (opcional)"
                      ayuda="Horizontal, de 10 a 20 segundos, de Florencia en movimiento. Se ve de fondo en la portada del Inicio, sin sonido y en bucle, con un velo verde encima para que se lean los textos." />
                  </div>
                  <div className="md:col-span-2">
                    {botonGuardar('Guardar configuración', () => {
                      if (Object.keys(form).length === 0) return mostrarMsg('No hiciste cambios todavía.', 'info')
                      guardar(() => api.actualizarConfiguracion(form), 'Configuración guardada')
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Usuarios */}
            {seccion === 'Usuarios' && (
              <div>
                <h2 className="titulo text-verde text-3xl mb-5">Usuarios <span className="text-piedra text-xl">· {(datos.usuarios || []).length}</span></h2>
                <ul className="card divide-y divide-terracota/10">
                  {(datos.usuarios || []).map((u) => (
                    <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-9 h-9 shrink-0 rounded-full bg-verde/15 text-verde flex items-center justify-center font-semibold text-sm">
                        {u.nombre?.[0]?.toUpperCase() || '?'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-texto truncate">{u.nombre}</p>
                        <p className="text-xs text-piedra truncate">{u.email}</p>
                      </div>
                      <span className={`chip ${u.rol === 'ADMIN' ? 'chip-verde' : 'bg-terracota/15 text-terracota'}`}>{u.rol === 'ADMIN' ? 'Admin' : 'Alumna/o'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </main>
  )
}

export default Admin
