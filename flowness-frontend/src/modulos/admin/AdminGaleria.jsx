import { useState, useEffect } from 'react'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import Reel from '../../compartido/componentes/Reel'
import { imagenReducida, esLinkInstagram } from '../../compartido/utilidades/medios'
import * as api from './admin.servicio'

const estiloInput = 'w-full border border-[#D8A48F]/30 rounded-full px-4 py-2 text-sm outline-none focus:border-[#7B9B77]'
const estiloLabel = 'text-[#A9A9A2] text-[11px] tracking-widest uppercase block mb-1'
const botonVerde = 'bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-5 py-2 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50'
const botonChico = 'border border-[#A9A9A2]/60 text-[#555] text-xs w-8 h-8 rounded-full hover:bg-[#F5F0EB] disabled:opacity-30'
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

  const cargar = () =>
    api.obtenerGaleriaAdmin()
      .then((datos) => { setFotos(datos.fotos); setReels(datos.reels) })
      .catch(() => mostrarMsg('No se pudo cargar la galería'))

  useEffect(() => { cargar() }, [])

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-[#7B9B77] font-semibold mr-2">Galería</h2>
        {[['fotos', `Fotos · ${fotos.length}`], ['videos', `Videos · ${reels.length}`]].map(([clave, texto]) => (
          <button key={clave} onClick={() => { vibrar(); setPestana(clave) }}
            className={`text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full ${
              pestana === clave ? 'bg-[#D8A48F] text-white' : 'border border-[#D8A48F] text-[#D8A48F]'
            }`}>
            {texto}
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
    mostrarMsg(fallidas ? `Se subieron ${lista.length - fallidas} de ${lista.length} fotos (las de más de 10 MB no se suben)` : 'Fotos subidas')
    alCambiar()
  }

  const guardar = (id, datos) => api.actualizarFoto(id, datos)

  const mover = async (i, paso) => {
    vibrar()
    await intercambiar(fotos, i, i + paso, guardar)
    alCambiar()
  }

  const editarDescripcion = async (foto) => {
    const texto = window.prompt('Descripción de la foto (opcional):', foto.descripcion || '')
    if (texto === null) return
    await guardar(foto.id, { descripcion: texto })
    alCambiar()
  }

  const alternar = async (foto) => {
    vibrar()
    await guardar(foto.id, { activo: !foto.activo })
    alCambiar()
  }

  const eliminar = async (foto) => {
    if (!window.confirm('¿Eliminar esta foto? No se puede deshacer.')) return
    vibrar()
    await api.eliminarFoto(foto.id)
    mostrarMsg('Foto eliminada')
    alCambiar()
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
      <label className={`${botonVerde} inline-block cursor-pointer mb-2 ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
        {subiendo ? `Subiendo ${subiendo.actual} de ${subiendo.total}…` : '+ Subir fotos'}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
          onChange={(e) => { subir(e.target.files); e.target.value = '' }} />
      </label>
      <p className="text-[#A9A9A2] text-[11px] mb-5">Podés elegir varias a la vez. Máximo 10 MB cada una.</p>

      {fotos.length === 0 ? (
        <p className="text-[#A9A9A2] text-sm">Todavía no hay fotos.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, i) => (
            <div key={foto.id} className={`border border-[#D8A48F]/20 rounded-xl overflow-hidden ${foto.activo ? '' : 'opacity-50'}`}>
              <img src={imagenReducida(foto.url, 400)} alt="" className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-[11px] text-[#A9A9A2] truncate mb-2" title={foto.descripcion || ''}>
                  {foto.descripcion || 'Sin descripción'}{!foto.activo && ' · Oculta'}
                </p>
                <div className="flex flex-wrap gap-1">
                  <button onClick={() => mover(i, -1)} disabled={i === 0} className={botonChico} title="Mover antes">‹</button>
                  <button onClick={() => mover(i, 1)} disabled={i === fotos.length - 1} className={botonChico} title="Mover después">›</button>
                  <button onClick={() => editarDescripcion(foto)} className={botonChico} title="Descripción">✎</button>
                  <button onClick={() => alternar(foto)} className={botonChico} title={foto.activo ? 'Ocultar' : 'Mostrar'}>{foto.activo ? '👁' : '◌'}</button>
                  <button onClick={() => eliminar(foto)} className={`${botonChico} text-red-400`} title="Eliminar">✕</button>
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
    await intercambiar(reels, i, i + paso, guardar)
    alCambiar()
  }

  const alternar = async (reel) => {
    vibrar()
    await guardar(reel.id, { activo: !reel.activo })
    alCambiar()
  }

  const eliminar = async (reel) => {
    if (!window.confirm('¿Eliminar este video de la galería?')) return
    vibrar()
    await api.eliminarReel(reel.id)
    mostrarMsg('Video eliminado')
    alCambiar()
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D8A48F]/20">
      {/* Agregar */}
      <div className="bg-[#F5F0EB] rounded-2xl p-4 mb-6">
        <p className="text-sm font-semibold text-[#555] mb-3">Agregar video</p>
        <div className="flex gap-2 mb-4">
          {[['INSTAGRAM', 'Link de Instagram'], ['ARCHIVO', 'Subir desde el equipo']].map(([clave, texto]) => (
            <button key={clave} onClick={() => { setOrigen(clave); setError('') }}
              className={`text-[11px] tracking-widest uppercase px-4 py-1.5 rounded-full ${
                origen === clave ? 'bg-[#7B9B77] text-white' : 'bg-white border border-[#7B9B77] text-[#7B9B77]'
              }`}>
              {texto}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {origen === 'INSTAGRAM' && (
            <div className="md:col-span-2">
              <label className={estiloLabel}>Link del reel</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.instagram.com/reel/..." className={`${estiloInput} bg-white`} />
              <p className="text-[#A9A9A2] text-[11px] mt-1 px-2">En Instagram: tocá los tres puntitos del reel → Copiar enlace.</p>
            </div>
          )}
          <div className="md:col-span-2">
            <label className={estiloLabel}>Descripción (opcional)</label>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className={`${estiloInput} bg-white`} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <div className="mt-4">
          {origen === 'INSTAGRAM' ? (
            <button onClick={agregarInstagram} disabled={guardando} className={botonVerde}>
              {guardando ? 'Guardando…' : 'Agregar reel'}
            </button>
          ) : (
            <>
              <label className={`${botonVerde} inline-block cursor-pointer ${subiendo ? 'opacity-50 pointer-events-none' : ''}`}>
                {subiendo ? `Subiendo video… ${progreso}%` : 'Elegir video'}
                <input type="file" accept="video/mp4,video/quicktime,video/webm" className="hidden"
                  onChange={(e) => { subirArchivo(e.target.files[0]); e.target.value = '' }} />
              </label>
              <p className="text-[#A9A9A2] text-[11px] mt-2">Máximo 100 MB. Ideal: videos verticales de menos de 1 minuto.</p>
            </>
          )}
        </div>
      </div>

      {/* Listado */}
      {reels.length === 0 ? (
        <p className="text-[#A9A9A2] text-sm">Todavía no hay videos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reels.map((reel, i) => (
            <div key={reel.id} className={reel.activo ? '' : 'opacity-50'}>
              <Reel reel={reel} />
              <p className="text-[11px] text-[#A9A9A2] mt-2">
                {reel.tipo === 'ARCHIVO' ? 'Video subido' : 'Instagram'}
                {reel.descripcion && ` · ${reel.descripcion}`}
                {!reel.activo && ' · Oculto'}
              </p>
              <div className="flex gap-1 mt-2">
                <button onClick={() => mover(i, -1)} disabled={i === 0} className={botonChico} title="Mover antes">‹</button>
                <button onClick={() => mover(i, 1)} disabled={i === reels.length - 1} className={botonChico} title="Mover después">›</button>
                <button onClick={() => alternar(reel)} className={botonChico} title={reel.activo ? 'Ocultar' : 'Mostrar'}>{reel.activo ? '👁' : '◌'}</button>
                <button onClick={() => eliminar(reel)} className={`${botonChico} text-red-400`} title="Eliminar">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminGaleria
