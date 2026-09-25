import { useState, useEffect, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, Pencil, Eye, EyeOff, Trash2, Upload, Plus, Loader2, Images, Film, Link2, AlertCircle,
  CheckCircle2, Download,
} from 'lucide-react'
import Medio from '../../compartido/componentes/Medio'
import IconoInstagram from '../../compartido/componentes/IconoInstagram'
import { esLinkInstagram } from '../../compartido/utilidades/medios'
import { confirmar, pedirTexto } from '../../compartido/utilidades/dialogos'
import * as api from './admin.servicio'

const estiloLabel = 'text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5'
const botonVerde = 'btn btn-primario btn-chico'
const botonChico = 'w-8 h-8 inline-flex items-center justify-center rounded-full border border-piedra/40 text-texto hover:bg-crema transition-colors disabled:opacity-30'
const MB = 1024 * 1024

// Lo que cambia entre fotos y videos; todo lo demás funciona igual
const CONFIG = {
  foto: {
    singular: 'foto', plural: 'fotos', articulo: 'la', oculta: 'oculta', visible: 'visible',
    crear: api.crearFoto, actualizar: api.actualizarFoto, eliminar: api.eliminarFoto,
    subir: api.subirImagen, acepta: 'image/jpeg,image/png,image/webp', tipoMime: 'image/', maxMB: 10, varios: true,
    ejemploLink: 'https://www.instagram.com/p/...',
    ayudaArchivo: 'Podés elegir varias a la vez. Máximo 10 MB cada una.',
  },
  video: {
    singular: 'video', plural: 'videos', articulo: 'el', oculta: 'oculto', visible: 'visible',
    crear: api.crearReel, actualizar: api.actualizarReel, eliminar: api.eliminarReel,
    subir: api.subirVideo, acepta: 'video/mp4,video/quicktime,video/webm', tipoMime: 'video/', maxMB: 100, varios: false,
    ejemploLink: 'https://www.instagram.com/reel/...',
    ayudaArchivo: 'Máximo 100 MB. Ideal: videos verticales de menos de 1 minuto.',
  },
}

// Intercambia el orden de dos elementos y guarda los dos
const intercambiar = async (lista, i, j, guardar) => {
  const a = lista[i]
  const b = lista[j]
  if (!a || !b) return
  const ordenA = a.orden === b.orden ? a.orden + (j > i ? 1 : -1) : b.orden
  await Promise.all([guardar(a.id, { orden: ordenA }), guardar(b.id, { orden: a.orden })])
}

// Sección "Galería" del panel: fotos y videos, cada uno subido desde el equipo o con link de Instagram
function AdminGaleria({ mostrarMsg }) {
  const [fotos, setFotos] = useState([])
  const [reels, setReels] = useState([])
  const [pestana, setPestana] = useState('foto')
  const [instagram, setInstagram] = useState(null) // { conectado, usuario }

  useEffect(() => {
    api.obtenerEstadoInstagram().then(setInstagram).catch(() => setInstagram({ conectado: false }))
  }, [])

  const cargar = useCallback(() =>
    api.obtenerGaleriaAdmin()
      .then((datos) => { setFotos(datos.fotos || []); setReels(datos.reels || []) })
      .catch(() => mostrarMsg('No se pudo cargar la galería', 'error')), [mostrarMsg])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="titulo text-verde text-3xl mr-2">Galería</h2>
        {[['foto', `Fotos · ${fotos.length}`, Images], ['video', `Videos · ${reels.length}`, Film]].map(([clave, texto, Icono]) => (
          <button key={clave} onClick={() => setPestana(clave)}
            className={`btn btn-chico ${pestana === clave ? 'btn-acento' : 'border border-terracota text-terracota hover:bg-terracota/10'}`}>
            <Icono size={14} /> {texto}
          </button>
        ))}
      </div>
      <p className="text-piedra text-xs mb-5">
        En la página todas se muestran del mismo tamaño: el sistema recorta cada foto o video para que queden parejos.
      </p>

      {/* Estado de la conexión con Instagram */}
      {instagram && (
        instagram.conectado ? (
          <p className="flex items-center gap-2 text-sm text-verde bg-verde/10 rounded-md px-3 py-2 mb-5">
            <CheckCircle2 size={16} className="shrink-0" />
            Instagram conectado{instagram.usuario ? ` (@${instagram.usuario})` : ''}: lo que agregues con link se trae como archivo y se ve en la página con todos los controles.
          </p>
        ) : (
          <p className="flex items-start gap-2 text-sm text-texto/80 bg-arena/50 rounded-md px-3 py-2 mb-5">
            <IconoInstagram size={16} className="shrink-0 mt-0.5 text-terracota" />
            Instagram todavía no está conectado: lo que agregues con link se muestra con el recuadro de Instagram, sin pantalla completa ni sonido.
          </p>
        )
      )}

      <SeccionMedios key={pestana} clase={pestana} items={pestana === 'foto' ? fotos : reels} alCambiar={cargar} mostrarMsg={mostrarMsg}
        instagramConectado={!!instagram?.conectado} />
    </div>
  )
}

function SeccionMedios({ clase, items, alCambiar, mostrarMsg, instagramConectado }) {
  const c = CONFIG[clase]
  const [origen, setOrigen] = useState('ARCHIVO') // 'ARCHIVO' | 'INSTAGRAM'
  const [link, setLink] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [subiendo, setSubiendo] = useState(null) // { actual, total, progreso }
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const Singular = c.singular[0].toUpperCase() + c.singular.slice(1)

  // ── Agregar ──────────────────────────────
  const agregarInstagram = async () => {
    setError('')
    if (!esLinkInstagram(link)) return setError(`Pegá el link de ${c.articulo === 'la' ? 'una publicación' : 'un reel'} de Instagram (${c.ejemploLink}).`)
    setGuardando(true)
    try {
      await c.crear({ tipo: 'INSTAGRAM', url: link.trim(), descripcion })
      setLink('')
      setDescripcion('')
      mostrarMsg(`${Singular} de Instagram agregad${c.articulo === 'la' ? 'a' : 'o'}`)
      alCambiar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const subirArchivos = async (archivos) => {
    setError('')
    const lista = [...archivos].filter((a) => a.type.startsWith(c.tipoMime))
    if (lista.length === 0) return setError(`El archivo tiene que ser ${c.articulo === 'la' ? 'una imagen' : 'un video'}.`)
    let fallidas = 0
    for (let i = 0; i < lista.length; i++) {
      setSubiendo({ actual: i + 1, total: lista.length, progreso: 0 })
      try {
        if (lista[i].size > c.maxMB * MB) throw new Error(`pesa más de ${c.maxMB} MB`)
        const respuesta = await c.subir(lista[i], (p) => setSubiendo((s) => s && { ...s, progreso: p }))
        if (!respuesta?.url) throw new Error(respuesta?.error || 'no se pudo subir')
        await c.crear({ tipo: 'ARCHIVO', url: respuesta.url, descripcion: lista.length === 1 ? descripcion : '' })
      } catch (err) {
        fallidas++
        console.error(`No se pudo subir ${c.articulo} ${c.singular}:`, err.message)
      }
    }
    setSubiendo(null)
    setDescripcion('')
    if (fallidas === lista.length) {
      setError(`No se pudo subir. Revisá que no pese más de ${c.maxMB} MB y probá de nuevo.`)
    } else {
      mostrarMsg(fallidas
        ? `Se subieron ${lista.length - fallidas} de ${lista.length} ${c.plural} (las de más de ${c.maxMB} MB no se suben)`
        : lista.length === 1 ? `${Singular} subid${c.articulo === 'la' ? 'a' : 'o'}` : `${lista.length} ${c.plural} subidas`,
      fallidas ? 'alerta' : 'exito')
    }
    alCambiar()
  }

  // ── Editar ───────────────────────────────
  // Ejecuta un cambio y muestra el aviso; si falla, el cliente de la API ya avisa el error
  const aplicar = async (accion, mensaje) => {
    try {
      await accion()
      mostrarMsg(mensaje)
      alCambiar()
    } catch { /* aviso de error automático */ }
  }

  const mover = (i, paso) => aplicar(() => intercambiar(items, i, i + paso, c.actualizar), 'Orden actualizado')

  const editarDescripcion = async (item) => {
    const texto = await pedirTexto(`Descripción ${c.articulo === 'la' ? 'de la foto' : 'del video'} (opcional):`, item.descripcion || '')
    if (texto === null) return
    aplicar(() => c.actualizar(item.id, { descripcion: texto }), 'Descripción guardada')
  }

  const cambiarLink = async (item) => {
    const nuevo = await pedirTexto('Nuevo link de Instagram:', item.url)
    if (nuevo === null || nuevo.trim() === item.url) return
    if (!esLinkInstagram(nuevo)) return mostrarMsg('Ese link no es de Instagram', 'error')
    aplicar(() => c.actualizar(item.id, { url: nuevo.trim() }), 'Link actualizado')
  }

  // Pasa algo que está como recuadro de Instagram a archivo real
  const [trayendo, setTrayendo] = useState(null)
  const traerArchivo = async (item) => {
    setTrayendo(item.id)
    await aplicar(() => api.importarDeInstagram(clase === 'foto' ? 'fotos' : 'reels', item.id), 'Listo: ahora se ve en la página con todos los controles')
    setTrayendo(null)
  }

  const alternar = (item) => aplicar(
    () => c.actualizar(item.id, { activo: !item.activo }),
    item.activo ? `${Singular} ${c.oculta} del sitio` : `${Singular} ${c.visible} en el sitio`,
  )

  const eliminar = async (item) => {
    if (!(await confirmar(`¿Eliminar ${c.articulo === 'la' ? 'esta foto' : 'este video'}? No se puede deshacer.`, { textoConfirmar: 'Eliminar' }))) return
    aplicar(() => c.eliminar(item.id), `${Singular} eliminad${c.articulo === 'la' ? 'a' : 'o'}`)
  }

  return (
    <div className="card p-5 md:p-6">
      {/* Agregar */}
      <div className="bg-crema rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-texto mb-3">Agregar {c.singular}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[['ARCHIVO', 'Subir desde el equipo', Upload], ['INSTAGRAM', 'Link de Instagram', Link2]].map(([clave, texto, Icono]) => (
            <button key={clave} onClick={() => { setOrigen(clave); setError('') }}
              className={`btn btn-chico ${origen === clave ? 'btn-primario' : 'bg-blanco border border-verde text-verde'}`}>
              <Icono size={14} /> {texto}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {origen === 'INSTAGRAM' && (
            <div>
              <label className={estiloLabel}>Link de Instagram</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={c.ejemploLink} className="input bg-blanco" />
              <p className="text-piedra text-[11px] mt-1 px-1">
                En Instagram: tocá los tres puntitos de la publicación → Copiar enlace. La cuenta tiene que ser pública.
              </p>
            </div>
          )}
          <div>
            <label className={estiloLabel}>Descripción (opcional)</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="input bg-blanco" />
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 text-error text-sm bg-error/5 rounded-md px-3 py-2 mt-3">
            <AlertCircle size={15} className="shrink-0" />{error}
          </p>
        )}

        <div className="mt-4">
          {origen === 'INSTAGRAM' ? (
            <button onClick={agregarInstagram} disabled={guardando} className={botonVerde}>
              {guardando ? <><Loader2 size={14} className="animate-spin" /> {instagramConectado ? 'Trayendo de Instagram…' : 'Guardando…'}</> : <><Plus size={14} /> Agregar</>}
            </button>
          ) : (
            <>
              <label className={`${botonVerde} cursor-pointer ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
                {subiendo
                  ? <><Loader2 size={14} className="animate-spin" /> Subiendo{subiendo.total > 1 ? ` ${subiendo.actual} de ${subiendo.total}` : ''}… {subiendo.progreso ? `${subiendo.progreso}%` : ''}</>
                  : <><Upload size={14} /> Elegir {c.varios ? c.plural : c.singular}</>}
                <input type="file" accept={c.acepta} multiple={c.varios} className="hidden"
                  onChange={(e) => { subirArchivos(e.target.files); e.target.value = '' }} />
              </label>
              {subiendo && (
                <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden mt-3 max-w-xs">
                  <div className="h-full bg-verde rounded-full transition-[width] duration-300" style={{ width: `${subiendo.progreso || 5}%` }} />
                </div>
              )}
              <p className="text-piedra text-[11px] mt-2">{c.ayudaArchivo}</p>
            </>
          )}
        </div>
      </div>

      {/* Listado: se ve igual que en la página */}
      {items.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay {c.plural}.</p>
      ) : (
        <div className="medios-chicos flex flex-wrap gap-4 justify-center sm:justify-start">
          {items.map((item, i) => (
            <div key={item.id} className={`medio ${item.activo ? '' : 'opacity-50'}`}>
              <Medio item={{ ...item, descripcion: null }} clase={clase} />
              <p className="text-[11px] text-piedra mt-2 w-full truncate" title={item.descripcion || ''}>
                {item.tipo === 'INSTAGRAM' ? 'Recuadro de Instagram' : item.enlace ? 'De Instagram' : 'Subid' + (c.articulo === 'la' ? 'a' : 'o')}
                {item.descripcion ? ` · ${item.descripcion}` : ''}
                {!item.activo && ` · ${c.oculta[0].toUpperCase() + c.oculta.slice(1)}`}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                <button onClick={() => mover(i, -1)} disabled={i === 0} className={botonChico} title="Mover antes" aria-label="Mover antes"><ChevronLeft size={16} /></button>
                <button onClick={() => mover(i, 1)} disabled={i === items.length - 1} className={botonChico} title="Mover después" aria-label="Mover después"><ChevronRight size={16} /></button>
                <button onClick={() => editarDescripcion(item)} className={botonChico} title="Editar descripción" aria-label="Editar descripción"><Pencil size={14} /></button>
                {item.tipo === 'INSTAGRAM' && instagramConectado && (
                  <button onClick={() => traerArchivo(item)} disabled={trayendo === item.id} className={`${botonChico} text-verde`}
                    title="Traer el archivo de Instagram" aria-label="Traer el archivo de Instagram">
                    {trayendo === item.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  </button>
                )}
                {item.tipo === 'INSTAGRAM' && (
                  <button onClick={() => cambiarLink(item)} className={botonChico} title="Cambiar link" aria-label="Cambiar link"><Link2 size={14} /></button>
                )}
                <button onClick={() => alternar(item)} className={botonChico} title={item.activo ? 'Ocultar' : 'Mostrar'} aria-label={item.activo ? 'Ocultar' : 'Mostrar'}>
                  {item.activo ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => eliminar(item)} className={`${botonChico} text-error`} title="Eliminar" aria-label="Eliminar"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGaleria
