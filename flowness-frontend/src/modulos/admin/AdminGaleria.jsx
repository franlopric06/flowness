import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Eye, EyeOff, Trash2, Upload, Plus, Loader2, Images, Film, Link2, AlertCircle } from 'lucide-react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import Reel from '../../compartido/componentes/Reel'
import { imagenReducida, esLinkInstagram } from '../../compartido/utilidades/medios'
import { confirmar, pedirTexto } from '../../compartido/utilidades/dialogos'
import * as api from './admin.servicio'

const estiloInput = 'input'
const estiloLabel = 'text-piedra text-[0.68rem] font-semibold tracking-[0.16em] uppercase block mb-1.5'
const botonVerde = 'btn btn-primario btn-chico'
const botonChico = 'w-8 h-8 inline-flex items-center justify-center rounded-full border border-piedra/40 text-texto hover:bg-crema transition-colors disabled:opacity-30'
const MB = 1024 * 1024

// Intercambia el orden de dos elementos y guarda los dos
const intercambiar = async (lista, i, j, guardar) => {
  const a = lista[i]
  const b = lista[j]
  if (!a || !b) return
  const ordenA = a.orden === b.orden ? a.orden + (j > i ? 1 : -1) : b.orden
  await Promise.all([guardar(a.id, { orden: ordenA }), guardar(b.id, { orden: a.orden })])
}

// Sección "Galería" del panel: fotos y videos cortos (reels)
function AdminGaleria({ mostrarMsg }) {
  const [fotos, setFotos] = useState([])
  const [reels, setReels] = useState([])
  const [pestana, setPestana] = useState('fotos')
  const vibrar = useVibrar()

  const cargar = useCallback(() =>
    api.obtenerGaleriaAdmin()
      .then((datos) => { setFotos(datos.fotos); setReels(datos.reels) })
      .catch(() => mostrarMsg('No se pudo cargar la galería', 'error')), [mostrarMsg])

  useEffect(() => { cargar() }, [cargar])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <h2 className="titulo text-verde text-3xl mr-2">Galería</h2>
        {[['fotos', `Fotos · ${fotos.length}`, Images], ['videos', `Videos · ${reels.length}`, Film]].map(([clave, texto, Icono]) => (
          <button key={clave} onClick={() => { vibrar(); setPestana(clave) }}
            className={`btn btn-chico ${pestana === clave ? 'btn-acento' : 'border border-terracota text-terracota hover:bg-terracota/10'}`}>
            <Icono size={14} /> {texto}
          </button>
        ))}
      </div>

      {pestana === 'fotos'
        ? <SeccionFotos fotos={fotos} alCambiar={cargar} mostrarMsg={mostrarMsg} />
        : <SeccionReels reels={reels} alCambiar={cargar} mostrarMsg={mostrarMsg} />}
    </div>
  )
}

// ─────────────────────────────────────────────
// Fotos
// ─────────────────────────────────────────────
function SeccionFotos({ fotos, alCambiar, mostrarMsg }) {
  const [subiendo, setSubiendo] = useState(null) // { actual, total }
  const vibrar = useVibrar()

  const subir = async (archivos) => {
    const lista = [...archivos].filter((a) => a.type.startsWith('image/'))
    if (lista.length === 0) return
    let fallidas = 0
    for (let i = 0; i < lista.length; i++) {
      setSubiendo({ actual: i + 1, total: lista.length })
      try {
        if (lista[i].size > 10 * MB) throw new Error('muy pesada')
        const respuesta = await api.subirImagen(lista[i])
        if (!respuesta?.url) throw new Error(respuesta?.error || 'sin url')
        await api.crearFoto({ url: respuesta.url })
      } catch (err) {
        fallidas++
        console.error('No se pudo subir la foto:', err.message)
      }
    }
    setSubiendo(null)
    mostrarMsg(fallidas ? `Se subieron ${lista.length - fallidas} de ${lista.length} fotos (las de más de 10 MB no se suben)` : lista.length === 1 ? 'Foto subida' : `${lista.length} fotos subidas`, fallidas ? 'alerta' : 'exito')
    alCambiar()
  }

  const guardar = (id, datos) => api.actualizarFoto(id, datos)

  const mover = async (i, paso) => {
    vibrar()
    try {
      await intercambiar(fotos, i, i + paso, guardar)
      mostrarMsg('Orden actualizado')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  const editarDescripcion = async (foto) => {
    const texto = await pedirTexto('Descripción de la foto (opcional):', foto.descripcion || '')
    if (texto === null) return
    try {
      await guardar(foto.id, { descripcion: texto })
      mostrarMsg('Descripción guardada')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  const alternar = async (foto) => {
    vibrar()
    try {
      await guardar(foto.id, { activo: !foto.activo })
      mostrarMsg(foto.activo ? 'Foto oculta del sitio' : 'Foto visible en el sitio')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  const eliminar = async (foto) => {
    if (!(await confirmar('¿Eliminar esta foto? No se puede deshacer.', { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarFoto(foto.id)
      mostrarMsg('Foto eliminada')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  return (
    <div className="card p-5 md:p-6">
      <label className={`${botonVerde} cursor-pointer mb-2 ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
        {subiendo ? <><Loader2 size={14} className="animate-spin" /> Subiendo {subiendo.actual} de {subiendo.total}…</> : <><Upload size={14} /> Subir fotos</>}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
          onChange={(e) => { subir(e.target.files); e.target.value = '' }} />
      </label>
      <p className="text-piedra text-[11px] mb-5">Podés elegir varias a la vez. Máximo 10 MB cada una.</p>

      {fotos.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay fotos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, i) => (
            <div key={foto.id} className={`border border-terracota/20 rounded-xl overflow-hidden bg-blanco ${foto.activo ? '' : 'opacity-50'}`}>
              <img src={imagenReducida(foto.url, 400)} alt="" className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-[11px] text-piedra truncate mb-2" title={foto.descripcion || ''}>
                  {foto.descripcion || 'Sin descripción'}{!foto.activo && ' · Oculta'}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => mover(i, -1)} disabled={i === 0} className={botonChico} title="Mover antes" aria-label="Mover antes"><ChevronLeft size={16} /></button>
                  <button onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} className={botonChico} title="Mover después" aria-label="Mover después"><ChevronRight size={16} /></button>
                  <button onClick={() => editarDescripcion(foto)} className={botonChico} title="Descripción" aria-label="Editar descripción"><Pencil size={14} /></button>
                  <button onClick={() => alternar(foto)} className={botonChico} title={foto.activo ? 'Ocultar' : 'Mostrar'}>{foto.activo ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                  <button onClick={() => eliminar(foto)} className={`${botonChico} text-error`} title="Eliminar" aria-label="Eliminar"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Videos cortos (reels)
// ─────────────────────────────────────────────
function SeccionReels({ reels, alCambiar, mostrarMsg }) {
  const [origen, setOrigen] = useState('INSTAGRAM') // 'INSTAGRAM' | 'ARCHIVO'
  const [link, setLink] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState(0)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const vibrar = useVibrar()

  const guardar = (id, datos) => api.actualizarReel(id, datos)

  const agregarInstagram = async () => {
    vibrar()
    setError('')
    if (!esLinkInstagram(link)) return setError('Pegá el link de un reel de Instagram (instagram.com/reel/...).')
    setGuardando(true)
    try {
      await api.crearReel({ tipo: 'INSTAGRAM', url: link, descripcion })
      setLink('')
      setDescripcion('')
      mostrarMsg('Reel agregado')
      alCambiar()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const subirArchivo = async (archivo) => {
    if (!archivo) return
    setError('')
    if (!archivo.type.startsWith('video/')) return setError('El archivo tiene que ser un video.')
    if (archivo.size > 100 * MB) return setError('El video pesa más de 100 MB. Recortalo o bajale la calidad.')
    setSubiendo(true)
    setProgreso(0)
    try {
      const respuesta = await api.subirVideo(archivo, setProgreso)
      if (!respuesta?.url) throw new Error(respuesta?.error)
      await api.crearReel({ tipo: 'ARCHIVO', url: respuesta.url, descripcion })
      setDescripcion('')
      mostrarMsg('Video subido')
      alCambiar()
    } catch (err) {
      setError(err.message ? `No se pudo subir el video. ${err.message}` : 'No se pudo subir el video. Probá de nuevo.')
    } finally {
      setSubiendo(false)
    }
  }

  const mover = async (i, paso) => {
    vibrar()
    try {
      await intercambiar(reels, i, i + paso, guardar)
      mostrarMsg('Orden actualizado')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  const alternar = async (reel) => {
    vibrar()
    try {
      await guardar(reel.id, { activo: !reel.activo })
      mostrarMsg(reel.activo ? 'Video oculto del sitio' : 'Video visible en el sitio')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  const eliminar = async (reel) => {
    if (!(await confirmar('¿Eliminar este video de la galería?', { textoConfirmar: 'Eliminar' }))) return
    try {
      await api.eliminarReel(reel.id)
      mostrarMsg('Video eliminado')
      alCambiar()
    } catch { /* el aviso de error lo muestra el cliente */ }
  }

  return (
    <div className="card p-5 md:p-6">
      {/* Agregar */}
      <div className="bg-crema rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-texto mb-3">Agregar video</p>
        <div className="flex gap-2 mb-4">
          {[['INSTAGRAM', 'Link de Instagram'], ['ARCHIVO', 'Subir desde el equipo']].map(([clave, texto]) => (
            <button key={clave} onClick={() => { setOrigen(clave); setError('') }}
              className={`btn btn-chico ${origen === clave ? 'btn-primario' : 'bg-blanco border border-verde text-verde'}`}>
              {clave === 'INSTAGRAM' ? <Link2 size={14} /> : <Upload size={14} />} {texto}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {origen === 'INSTAGRAM' && (
            <div className="md:col-span-2">
              <label className={estiloLabel}>Link del reel</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.instagram.com/reel/..." className={`${estiloInput} bg-blanco`} />
              <p className="text-piedra text-[11px] mt-1 px-2">En Instagram: tocá los tres puntitos del reel → Copiar enlace.</p>
            </div>
          )}
          <div className="md:col-span-2">
            <label className={estiloLabel}>Descripción (opcional)</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={`${estiloInput} bg-blanco`} />
          </div>
        </div>

        {error && <p className="flex items-center gap-2 text-error text-sm bg-error/5 rounded-md px-3 py-2 mt-3"><AlertCircle size={15} className="shrink-0" />{error}</p>}

        <div className="mt-4">
          {origen === 'INSTAGRAM' ? (
            <button onClick={agregarInstagram} disabled={guardando} className={botonVerde}>
              {guardando ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : <><Plus size={14} /> Agregar reel</>}
            </button>
          ) : (
            <>
              <label className={`${botonVerde} cursor-pointer ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
                {subiendo ? <><Loader2 size={14} className="animate-spin" /> Subiendo video… {progreso}%</> : <><Upload size={14} /> Elegir video</>}
                <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
                  onChange={(e) => { subirArchivo(e.target.files[0]); e.target.value = '' }} />
              </label>
              {subiendo && (
                <div className="h-1.5 rounded-full bg-arena/60 overflow-hidden mt-3 max-w-xs">
                  <div className="h-full bg-verde rounded-full transition-[width] duration-300" style={{ width: `${progreso}%` }} />
                </div>
              )}
              <p className="text-piedra text-[11px] mt-2">Máximo 100 MB. Ideal: videos verticales de menos de 1 minuto.</p>
            </>
          )}
        </div>
      </div>

      {/* Listado */}
      {reels.length === 0 ? (
        <p className="text-piedra text-sm">Todavía no hay videos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reels.map((reel, i) => (
            <div key={reel.id} className={reel.activo ? '' : 'opacity-50'}>
              <Reel reel={reel} />
              <p className="text-[11px] text-piedra mt-2">
                {reel.tipo === 'ARCHIVO' ? 'Video subido' : 'Instagram'}
                {reel.descripcion && ` · ${reel.descripcion}`}
                {!reel.activo && ' · Oculto'}
              </p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => mover(i, -1)} disabled={i === 0} className={botonChico} title="Mover antes" aria-label="Mover antes"><ChevronLeft size={16} /></button>
                <button onClick={() => mover(i, 1)} disabled={i === reels.length - 1} className={botonChico} title="Mover después" aria-label="Mover después"><ChevronRight size={16} /></button>
                <button onClick={() => alternar(reel)} className={botonChico} title={reel.activo ? 'Ocultar' : 'Mostrar'}>{reel.activo ? <Eye size={15} /> : <EyeOff size={15} />}</button>
                <button onClick={() => eliminar(reel)} className={`${botonChico} text-error`} title="Eliminar" aria-label="Eliminar"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGaleria
