import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Admin() {
  const [cursos, setCursos] = useState([])
  const [clases, setClases] = useState([])
  const [avisos, setAvisos] = useState([])
  const [fotos, setFotos] = useState([])
  const [videos, setVideos] = useState([])
  const [videosCurso, setVideosCurso] = useState([])
  const [cursoSeleccionado, setCursoSeleccionado] = useState('')
  const [fases, setFases] = useState([])
  const [niveles, setNiveles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [seccion, setSeccion] = useState('cursos')
  const [form, setForm] = useState({ nivel: '', nombre: '', descripcion: '', precio: '', duracion: '', videos: '' })
  const [editando, setEditando] = useState(null)
  const [formClase, setFormClase] = useState({ nombre: '', descripcion: '', precio_vivo: '', precio_grabada: '', duracion: '', videoUrl: '', zoomLink: '' })
  const [editandoClase, setEditandoClase] = useState(null)
  const [formAviso, setFormAviso] = useState({ titulo: '', descripcion: '' })
  const [formFoto, setFormFoto] = useState({ descripcion: '', fase: '', nivel: '', archivo: null })
  const [formVideo, setFormVideo] = useState({ titulo: '', descripcion: '', fase: '', nivel: '', duracion: '', archivo: null })
  const [formVideoCurso, setFormVideoCurso] = useState({ titulo: '', descripcion: '', orden: '', archivo: null })
  const [formFase, setFormFase] = useState({ numero: '', nombre: '', descripcion: '' })
  const [editandoFase, setEditandoFase] = useState(null)
  const [formNivel, setFormNivel] = useState({ numero: '', nombre: '', etiqueta: '', descripcion: '', para: '', incluye: '' })
  const [editandoNivel, setEditandoNivel] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    if (!token || usuario.rol !== 'admin') {
      navigate('/ingresar')
      return
    }
    cargarCursos()
    cargarClases()
    cargarAvisos()
    cargarFotos()
    cargarVideos()
    cargarFases()
    cargarNiveles()
  }, [])

  const cargarCursos = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cursos`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setCursos(data)
      setCargando(false)
    } catch (error) { setCargando(false) }
  }

  const cargarClases = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/clases`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setClases(data)
    } catch (error) { console.error(error) }
  }

  const cargarAvisos = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/avisos`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setAvisos(data)
    } catch (error) { console.error(error) }
  }

  const cargarFotos = async () => {
    try {
      const res = await fetch(`${API_URL}/media/fotos`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setFotos(data)
    } catch (error) { console.error(error) }
  }

  const cargarVideos = async () => {
    try {
      const res = await fetch(`${API_URL}/media/videos`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setVideos(data)
    } catch (error) { console.error(error) }
  }

  const cargarVideosCurso = async (cursoId) => {
    if (!cursoId) return
    try {
      const res = await fetch(`${API_URL}/videos/admin/curso/${cursoId}`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setVideosCurso(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) }
  }

  const cargarFases = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/fases`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setFases(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) }
  }

  const cargarNiveles = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/niveles`, { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      setNiveles(Array.isArray(data) ? data : [])
    } catch (error) { console.error(error) }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleChangeClase = (e) => setFormClase({ ...formClase, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editando ? `${API_URL}/admin/cursos/${editando}` : `${API_URL}/admin/cursos`
      const method = editando ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      setForm({ nivel: '', nombre: '', descripcion: '', precio: '', duracion: '', videos: '' })
      setEditando(null)
      cargarCursos()
    } catch (error) { console.error(error) }
  }

  const handleSubmitClase = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/admin/clases/${editandoClase}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formClase) })
      setFormClase({ nombre: '', descripcion: '', precio_vivo: '', precio_grabada: '', duracion: '', videoUrl: '', zoomLink: '' })
      setEditandoClase(null)
      cargarClases()
    } catch (error) { console.error(error) }
  }

  const handleSubmitAviso = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/admin/avisos`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formAviso) })
      setFormAviso({ titulo: '', descripcion: '' })
      cargarAvisos()
    } catch (error) { console.error(error) }
  }

  const handleSubmitFoto = async (e) => {
    e.preventDefault()
    if (!formFoto.archivo) return
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('archivo', formFoto.archivo)
      formData.append('descripcion', formFoto.descripcion)
      formData.append('fase', formFoto.fase)
      formData.append('nivel', formFoto.nivel)
      await fetch(`${API_URL}/media/fotos`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      setFormFoto({ descripcion: '', fase: '', nivel: '', archivo: null })
      cargarFotos()
    } catch (error) { console.error(error) }
    setSubiendo(false)
  }

  const handleSubmitVideo = async (e) => {
    e.preventDefault()
    if (!formVideo.archivo) return
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('archivo', formVideo.archivo)
      formData.append('titulo', formVideo.titulo)
      formData.append('descripcion', formVideo.descripcion)
      formData.append('fase', formVideo.fase)
      formData.append('nivel', formVideo.nivel)
      formData.append('duracion', formVideo.duracion)
      await fetch(`${API_URL}/media/videos`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      setFormVideo({ titulo: '', descripcion: '', fase: '', nivel: '', duracion: '', archivo: null })
      cargarVideos()
    } catch (error) { console.error(error) }
    setSubiendo(false)
  }

  const handleSubmitVideoCurso = async (e) => {
    e.preventDefault()
    if (!formVideoCurso.archivo || !cursoSeleccionado) return
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('archivo', formVideoCurso.archivo)
      formData.append('cursoId', cursoSeleccionado)
      formData.append('titulo', formVideoCurso.titulo)
      formData.append('descripcion', formVideoCurso.descripcion)
      formData.append('orden', formVideoCurso.orden)
      await fetch(`${API_URL}/videos`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      setFormVideoCurso({ titulo: '', descripcion: '', orden: '', archivo: null })
      cargarVideosCurso(cursoSeleccionado)
    } catch (error) { console.error(error) }
    setSubiendo(false)
  }

  const handleSubmitFase = async (e) => {
    e.preventDefault()
    try {
      const url = editandoFase ? `${API_URL}/admin/fases/${editandoFase}` : `${API_URL}/admin/fases`
      const method = editandoFase ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formFase) })
      setFormFase({ numero: '', nombre: '', descripcion: '' })
      setEditandoFase(null)
      cargarFases()
    } catch (error) { console.error(error) }
  }

  const handleSubmitNivel = async (e) => {
    e.preventDefault()
    try {
      const url = editandoNivel ? `${API_URL}/admin/niveles/${editandoNivel}` : `${API_URL}/admin/niveles`
      const method = editandoNivel ? 'PUT' : 'POST'
      await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formNivel) })
      setFormNivel({ numero: '', nombre: '', etiqueta: '', descripcion: '', para: '', incluye: '' })
      setEditandoNivel(null)
      cargarNiveles()
    } catch (error) { console.error(error) }
  }

  const handleEditar = (curso) => {
    setEditando(curso.id)
    setForm({ nivel: curso.nivel, nombre: curso.nombre, descripcion: curso.descripcion, precio: curso.precio, duracion: curso.duracion, videos: curso.videos })
  }

  const handleEditarClase = (clase) => {
    setEditandoClase(clase.id)
    setFormClase({ nombre: clase.nombre, descripcion: clase.descripcion, precio_vivo: clase.precio_vivo, precio_grabada: clase.precio_grabada, duracion: clase.duracion, videoUrl: clase.videoUrl || '', zoomLink: clase.zoomLink || '' })
  }

  const handleEditarFase = (fase) => {
    setEditandoFase(fase.id)
    setFormFase({ numero: fase.numero, nombre: fase.nombre, descripcion: fase.descripcion })
  }

  const handleEditarNivel = (nivel) => {
    setEditandoNivel(nivel.id)
    setFormNivel({ numero: nivel.numero, nombre: nivel.nombre, etiqueta: nivel.etiqueta, descripcion: nivel.descripcion, para: nivel.para, incluye: nivel.incluye })
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés desactivar este curso?')) return
    await fetch(`${API_URL}/admin/cursos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarCursos()
  }

  const handleActivar = async (id) => {
    await fetch(`${API_URL}/admin/cursos/${id}/activar`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    cargarCursos()
  }

  const handleDesactivarClase = async (id) => {
    if (!confirm('¿Seguro que querés desactivar esta clase?')) return
    await fetch(`${API_URL}/admin/clases/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarClases()
  }

  const handleActivarClase = async (id) => {
    await fetch(`${API_URL}/admin/clases/${id}/activar`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
    cargarClases()
  }

  const handleEliminarAviso = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este aviso?')) return
    await fetch(`${API_URL}/admin/avisos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarAvisos()
  }

  const handleEliminarFoto = async (id) => {
    if (!confirm('¿Seguro que querés eliminar esta foto?')) return
    await fetch(`${API_URL}/media/fotos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarFotos()
  }

  const handleEliminarVideo = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este video?')) return
    await fetch(`${API_URL}/media/videos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarVideos()
  }

  const handleEliminarVideoCurso = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este video?')) return
    await fetch(`${API_URL}/videos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarVideosCurso(cursoSeleccionado)
  }

  const handleEliminarFase = async (id) => {
    if (!confirm('¿Seguro que querés eliminar esta fase?')) return
    await fetch(`${API_URL}/admin/fases/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarFases()
  }

  const handleEliminarNivel = async (id) => {
    if (!confirm('¿Seguro que querés eliminar este nivel?')) return
    await fetch(`${API_URL}/admin/niveles/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    cargarNiveles()
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/'
  }

  if (cargando) {
    return (
      <main className="pt-20 bg-[#F5F0EB] min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#7B9B77] border-t-transparent rounded-full" />
      </main>
    )
  }

  return (
    <>
      <SEO titulo="Panel de Administración" descripcion="Panel de administración de Flowness" url="/admin" />
      <main className="pt-28 bg-[#F5F0EB] min-h-screen md:pt-32">

        {/* Header */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 py-4 md:px-16">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-[#7B9B77]">Panel de Administración</h1>
              <p className="text-[#A9A9A2] text-xs">Bienvenida, {usuario.nombre}</p>
            </div>
            <button onClick={cerrarSesion} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">
              Cerrar sesión
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 md:px-16 overflow-x-auto">
          <div className="flex gap-6 min-w-max">
            {['cursos', 'clases', 'avisos', 'fotos', 'videos', 'videos-cursos', 'fases', 'niveles'].map((tab) => (
              <button key={tab} onClick={() => setSeccion(tab)}
                className={`py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${seccion === tab ? 'border-[#7B9B77] text-[#7B9B77]' : 'border-transparent text-[#A9A9A2] hover:text-[#7B9B77]'}`}>
                {tab === 'videos-cursos' ? 'Videos Cursos' : tab}
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 py-8 md:px-16">

          {/* CURSOS */}
          {seccion === 'cursos' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">{editando ? 'Editar Curso' : 'Agregar Nuevo Curso'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nivel</label>
                    <input name="nivel" value={form.nivel} onChange={handleChange} placeholder="01" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre</label>
                    <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Flowness Esencial" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Precio</label>
                    <input name="precio" value={form.precio} onChange={handleChange} type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Duración</label>
                    <input name="duracion" value={form.duracion} onChange={handleChange} placeholder="4 semanas" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Videos</label>
                    <input name="videos" value={form.videos} onChange={handleChange} type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex gap-3 md:col-span-2">
                    <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                      {editando ? 'Guardar cambios' : 'Agregar curso'}
                    </button>
                    {editando && (
                      <button type="button" onClick={() => { setEditando(null); setForm({ nivel: '', nombre: '', descripcion: '', precio: '', duracion: '', videos: '' }) }} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Cursos ({cursos.length})</h2>
                </div>
                {cursos.map((curso) => (
                  <div key={curso.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[#A9A9A2] text-xs">NIVEL {curso.nivel}</p>
                      <p className="text-[#555] font-medium">{curso.nombre}</p>
                      <p className="text-[#7B9B77] text-sm">${curso.precio.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${curso.activo ? 'bg-[#7B9B77]/10 text-[#7B9B77]' : 'bg-red-100 text-red-400'}`}>
                        {curso.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <button onClick={() => handleEditar(curso)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Editar</button>
                      {curso.activo ? (
                        <button onClick={() => handleEliminar(curso.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Desactivar</button>
                      ) : (
                        <button onClick={() => handleActivar(curso.id)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Activar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* CLASES */}
          {seccion === 'clases' && (
            <>
              {editandoClase && (
                <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                  <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">Editar Clase</h2>
                  <form onSubmit={handleSubmitClase} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre</label>
                      <input name="nombre" value={formClase.nombre} onChange={handleChangeClase} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Duración</label>
                      <input name="duracion" value={formClase.duracion} onChange={handleChangeClase} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                      <textarea name="descripcion" value={formClase.descripcion} onChange={handleChangeClase} rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Precio en vivo</label>
                      <input name="precio_vivo" value={formClase.precio_vivo} onChange={handleChangeClase} type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Precio grabada</label>
                      <input name="precio_grabada" value={formClase.precio_grabada} onChange={handleChangeClase} type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Link de Zoom (clase en vivo)</label>
                      <input name="zoomLink" value={formClase.zoomLink || ''} onChange={handleChangeClase} placeholder="https://zoom.us/j/..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Video grabada (URL)</label>
                      <input name="videoUrl" value={formClase.videoUrl || ''} onChange={handleChangeClase} placeholder="https://res.cloudinary.com/..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-3 md:flex-row md:col-span-2">
                      <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">Guardar cambios</button>
                      <button type="button" onClick={() => setEditandoClase(null)} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">Cancelar</button>
                    </div>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Clases ({clases.length})</h2>
                </div>
                {clases.map((clase) => (
                  <div key={clase.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[#A9A9A2] text-xs">FASE {clase.fase}</p>
                      <p className="text-[#555] font-medium">{clase.nombre}</p>
                      <p className="text-[#7B9B77] text-sm">Vivo: ${clase.precio_vivo.toLocaleString()} | Grabada: ${clase.precio_grabada.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full ${clase.activo ? 'bg-[#7B9B77]/10 text-[#7B9B77]' : 'bg-red-100 text-red-400'}`}>
                        {clase.activo ? 'Activo' : 'Inactivo'}
                      </span>
                      <button onClick={() => handleEditarClase(clase)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Editar</button>
                      {clase.activo ? (
                        <button onClick={() => handleDesactivarClase(clase.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Desactivar</button>
                      ) : (
                        <button onClick={() => handleActivarClase(clase.id)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Activar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* AVISOS */}
          {seccion === 'avisos' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">Publicar Aviso</h2>
                <form onSubmit={handleSubmitAviso} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Título</label>
                    <input value={formAviso.titulo} onChange={(e) => setFormAviso({ ...formAviso, titulo: e.target.value })} placeholder="Título del aviso" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <textarea value={formAviso.descripcion} onChange={(e) => setFormAviso({ ...formAviso, descripcion: e.target.value })} rows={4} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors w-fit">Publicar aviso</button>
                </form>
              </div>
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Avisos publicados ({avisos.length})</h2>
                </div>
                {avisos.length === 0 && <p className="text-[#A9A9A2] text-sm text-center py-8">No hay avisos publicados</p>}
                {avisos.map((aviso) => (
                  <div key={aviso.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[#555] font-medium">{aviso.titulo}</p>
                      <p className="text-[#888] text-sm">{aviso.descripcion}</p>
                      <p className="text-[#A9A9A2] text-xs mt-1">{new Date(aviso.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleEliminarAviso(aviso.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Eliminar</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* FOTOS */}
          {seccion === 'fotos' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">Subir Foto</h2>
                <form onSubmit={handleSubmitFoto} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Archivo</label>
                    <input type="file" accept="image/*" onChange={(e) => setFormFoto({ ...formFoto, archivo: e.target.files[0] })} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <input value={formFoto.descripcion} onChange={(e) => setFormFoto({ ...formFoto, descripcion: e.target.value })} placeholder="Descripción de la foto" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Fase (opcional)</label>
                    <input value={formFoto.fase} onChange={(e) => setFormFoto({ ...formFoto, fase: e.target.value })} placeholder="01, 02, 03..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={subiendo} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50">
                      {subiendo ? 'Subiendo...' : 'Subir foto'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {fotos.length === 0 && <p className="text-[#A9A9A2] text-sm col-span-4 text-center py-8">No hay fotos subidas</p>}
                {fotos.map((foto) => (
                  <div key={foto.id} className="relative rounded-2xl overflow-hidden border border-[#D8A48F]/15">
                    <img src={foto.url} alt={foto.descripcion} className="w-full h-40 object-cover" />
                    <div className="p-2 bg-white">
                      <p className="text-[#555] text-xs">{foto.descripcion}</p>
                      <button onClick={() => handleEliminarFoto(foto.id)} className="text-red-400 text-xs mt-1 hover:opacity-70">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VIDEOS MUESTRA */}
          {seccion === 'videos' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">Subir Video de Muestra</h2>
                <form onSubmit={handleSubmitVideo} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Archivo de video</label>
                    <input type="file" accept="video/*" onChange={(e) => setFormVideo({ ...formVideo, archivo: e.target.files[0] })} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Título</label>
                    <input value={formVideo.titulo} onChange={(e) => setFormVideo({ ...formVideo, titulo: e.target.value })} placeholder="Título del video" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Duración</label>
                    <input value={formVideo.duracion} onChange={(e) => setFormVideo({ ...formVideo, duracion: e.target.value })} placeholder="60 seg" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <textarea value={formVideo.descripcion} onChange={(e) => setFormVideo({ ...formVideo, descripcion: e.target.value })} rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={subiendo} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50">
                      {subiendo ? 'Subiendo...' : 'Subir video'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex flex-col gap-4">
                {videos.length === 0 && <p className="text-[#A9A9A2] text-sm text-center py-8">No hay videos subidos</p>}
                {videos.map((video) => (
                  <div key={video.id} className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                    <video src={video.url} controls className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <p className="text-[#555] font-medium">{video.titulo}</p>
                      <p className="text-[#888] text-sm">{video.descripcion}</p>
                      <button onClick={() => handleEliminarVideo(video.id)} className="text-red-400 text-xs mt-2 hover:opacity-70">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* VIDEOS CURSOS */}
          {seccion === 'videos-cursos' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">Subir Video de Curso</h2>
                <div className="flex flex-col gap-1 mb-4">
                  <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Seleccioná el curso</label>
                  <select value={cursoSeleccionado} onChange={(e) => { setCursoSeleccionado(e.target.value); cargarVideosCurso(e.target.value) }} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]">
                    <option value="">Elegí un curso</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                {cursoSeleccionado && (
                  <form onSubmit={handleSubmitVideoCurso} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Archivo de video</label>
                      <input type="file" accept="video/*" onChange={(e) => setFormVideoCurso({ ...formVideoCurso, archivo: e.target.files[0] })} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Título</label>
                      <input value={formVideoCurso.titulo} onChange={(e) => setFormVideoCurso({ ...formVideoCurso, titulo: e.target.value })} placeholder="Clase 01 - Introducción" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Orden</label>
                      <input value={formVideoCurso.orden} onChange={(e) => setFormVideoCurso({ ...formVideoCurso, orden: e.target.value })} placeholder="1, 2, 3..." type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                    </div>
                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                      <textarea value={formVideoCurso.descripcion} onChange={(e) => setFormVideoCurso({ ...formVideoCurso, descripcion: e.target.value })} rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                    </div>
                    <div className="md:col-span-2">
                      <button type="submit" disabled={subiendo} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors disabled:opacity-50">
                        {subiendo ? 'Subiendo...' : 'Subir video al curso'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {cursoSeleccionado && (
                <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                    <h2 className="text-lg font-semibold text-[#7B9B77]">Videos del curso ({videosCurso.length})</h2>
                  </div>
                  {videosCurso.length === 0 && <p className="text-[#A9A9A2] text-sm text-center py-8">No hay videos subidos para este curso</p>}
                  {videosCurso.map((video) => (
                    <div key={video.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[#A9A9A2] text-xs">CLASE {video.orden}</p>
                        <p className="text-[#555] font-medium">{video.titulo}</p>
                        <p className="text-[#888] text-sm">{video.descripcion}</p>
                      </div>
                      <button onClick={() => handleEliminarVideoCurso(video.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Eliminar</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FASES */}
          {seccion === 'fases' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">{editandoFase ? 'Editar Fase' : 'Agregar Nueva Fase'}</h2>
                <form onSubmit={handleSubmitFase} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Número</label>
                    <input value={formFase.numero} onChange={(e) => setFormFase({ ...formFase, numero: e.target.value })} placeholder="01, 02, 03..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre</label>
                    <input value={formFase.nombre} onChange={(e) => setFormFase({ ...formFase, nombre: e.target.value })} placeholder="Consciencia Corporal" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <textarea value={formFase.descripcion} onChange={(e) => setFormFase({ ...formFase, descripcion: e.target.value })} placeholder="Descripción de la fase..." rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <div className="flex gap-3 md:col-span-2">
                    <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                      {editandoFase ? 'Guardar cambios' : 'Agregar fase'}
                    </button>
                    {editandoFase && (
                      <button type="button" onClick={() => { setEditandoFase(null); setFormFase({ numero: '', nombre: '', descripcion: '' }) }} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">Cancelar</button>
                    )}
                  </div>
                </form>
              </div>
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Fases del método ({fases.length})</h2>
                </div>
                {fases.length === 0 && <p className="text-[#A9A9A2] text-sm text-center py-8">No hay fases cargadas todavía</p>}
                {fases.map((fase) => (
                  <div key={fase.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[#A9A9A2] text-xs">FASE {fase.numero}</p>
                      <p className="text-[#555] font-medium">{fase.nombre}</p>
                      <p className="text-[#888] text-sm">{fase.descripcion}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditarFase(fase)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Editar</button>
                      <button onClick={() => handleEliminarFase(fase.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NIVELES */}
          {seccion === 'niveles' && (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">{editandoNivel ? 'Editar Nivel' : 'Agregar Nuevo Nivel'}</h2>
                <form onSubmit={handleSubmitNivel} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Número</label>
                    <input value={formNivel.numero} onChange={(e) => setFormNivel({ ...formNivel, numero: e.target.value })} placeholder="01, 02, 03..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre</label>
                    <input value={formNivel.nombre} onChange={(e) => setFormNivel({ ...formNivel, nombre: e.target.value })} placeholder="Flowness Esencial" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Etiqueta</label>
                    <input value={formNivel.etiqueta} onChange={(e) => setFormNivel({ ...formNivel, etiqueta: e.target.value })} placeholder="Básico, Intermedio, Avanzado" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Para quién es</label>
                    <input value={formNivel.para} onChange={(e) => setFormNivel({ ...formNivel, para: e.target.value })} placeholder="Personas sin experiencia previa..." className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Descripción</label>
                    <textarea value={formNivel.descripcion} onChange={(e) => setFormNivel({ ...formNivel, descripcion: e.target.value })} placeholder="Descripción del nivel..." rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Qué incluye (separado por comas)</label>
                    <textarea value={formNivel.incluye} onChange={(e) => setFormNivel({ ...formNivel, incluye: e.target.value })} placeholder="Acceso a las 6 fases,Videos explicativos,Acceso de por vida" rows={2} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                    <p className="text-[#A9A9A2] text-xs">Separar cada ítem con una coma. Ej: Videos explicativos,Guía semanal,Acceso de por vida</p>
                  </div>
                  <div className="flex gap-3 md:col-span-2">
                    <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                      {editandoNivel ? 'Guardar cambios' : 'Agregar nivel'}
                    </button>
                    {editandoNivel && (
                      <button type="button" onClick={() => { setEditandoNivel(null); setFormNivel({ numero: '', nombre: '', etiqueta: '', descripcion: '', para: '', incluye: '' }) }} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">Cancelar</button>
                    )}
                  </div>
                </form>
              </div>
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Niveles de formación ({niveles.length})</h2>
                </div>
                {niveles.length === 0 && <p className="text-[#A9A9A2] text-sm text-center py-8">No hay niveles cargados todavía</p>}
                {niveles.map((nivel) => (
                  <div key={nivel.id} className="flex flex-col gap-2 px-6 py-4 border-b border-[#D8A48F]/10 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[#A9A9A2] text-xs">NIVEL {nivel.numero} — {nivel.etiqueta}</p>
                      <p className="text-[#555] font-medium">{nivel.nombre}</p>
                      <p className="text-[#888] text-sm">{nivel.descripcion}</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleEditarNivel(nivel)} className="text-xs text-[#A9A9A2] hover:text-[#7B9B77] transition-colors">Editar</button>
                      <button onClick={() => handleEliminarNivel(nivel.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </section>
      </main>
    </>
  )
}

export default Admin