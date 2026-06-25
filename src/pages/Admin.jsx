import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Admin() {
  const [cursos, setCursos] = useState([])
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [seccion, setSeccion] = useState('cursos')
  const [form, setForm] = useState({ nivel: '', nombre: '', descripcion: '', precio: '', duracion: '', videos: '' })
  const [editando, setEditando] = useState(null)
  const [formClase, setFormClase] = useState({ nombre: '', descripcion: '', precio_vivo: '', precio_grabada: '', duracion: '' })
  const [editandoClase, setEditandoClase] = useState(null)
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
  }, [])

  const cargarCursos = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/cursos`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setCursos(data)
      setCargando(false)
    } catch (error) {
      setCargando(false)
    }
  }

  const cargarClases = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/clases`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setClases(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleChangeClase = (e) => {
    setFormClase({ ...formClase, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editando
        ? `${API_URL}/admin/cursos/${editando}`
        : `${API_URL}/admin/cursos`
      const method = editando ? 'PUT' : 'POST'

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      setForm({ nivel: '', nombre: '', descripcion: '', precio: '', duracion: '', videos: '' })
      setEditando(null)
      cargarCursos()
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitClase = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API_URL}/admin/clases/${editandoClase}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formClase)
      })
      setFormClase({ nombre: '', descripcion: '', precio_vivo: '', precio_grabada: '', duracion: '' })
      setEditandoClase(null)
      cargarClases()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEditar = (curso) => {
    setEditando(curso.id)
    setForm({
      nivel: curso.nivel,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      precio: curso.precio,
      duracion: curso.duracion,
      videos: curso.videos
    })
  }

  const handleEditarClase = (clase) => {
    setEditandoClase(clase.id)
    setFormClase({
      nombre: clase.nombre,
      descripcion: clase.descripcion,
      precio_vivo: clase.precio_vivo,
      precio_grabada: clase.precio_grabada,
      duracion: clase.duracion
    })
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Seguro que querés desactivar este curso?')) return
    await fetch(`${API_URL}/admin/cursos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    cargarCursos()
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    navigate('/')
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
      <main className="pt-20 bg-[#F5F0EB] min-h-screen md:pt-24">

        {/* Header del panel */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 py-4 md:px-16">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-[#7B9B77]">Panel de Administración</h1>
              <p className="text-[#A9A9A2] text-xs">Bienvenida, {usuario.nombre}</p>
            </div>
            <button
              onClick={cerrarSesion}
              className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b border-[#D8A48F]/20 px-6 md:px-16">
          <div className="flex gap-6">
            <button
              onClick={() => setSeccion('cursos')}
              className={`py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                seccion === 'cursos'
                  ? 'border-[#7B9B77] text-[#7B9B77]'
                  : 'border-transparent text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Cursos
            </button>
            <button
              onClick={() => setSeccion('clases')}
              className={`py-4 text-xs tracking-widest uppercase border-b-2 transition-colors ${
                seccion === 'clases'
                  ? 'border-[#7B9B77] text-[#7B9B77]'
                  : 'border-transparent text-[#A9A9A2] hover:text-[#7B9B77]'
              }`}
            >
              Clases
            </button>
          </div>
        </section>

        <section className="px-6 py-8 md:px-16">

          {/* SECCION CURSOS */}
          {seccion === 'cursos' && (
            <>
              {/* Formulario cursos */}
              <div className="bg-white rounded-2xl p-6 border border-[#D8A48F]/15 mb-6">
                <h2 className="text-lg font-semibold text-[#7B9B77] mb-4">
                  {editando ? 'Editar Curso' : 'Agregar Nuevo Curso'}
                </h2>
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
                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción del curso" rows={3} className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77] resize-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Precio</label>
                    <input name="precio" value={form.precio} onChange={handleChange} placeholder="15000" type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Duración</label>
                    <input name="duracion" value={form.duracion} onChange={handleChange} placeholder="4 semanas" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Videos</label>
                    <input name="videos" value={form.videos} onChange={handleChange} placeholder="12" type="number" className="bg-[#F5F0EB] border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7B9B77]" />
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

              {/* Tabla cursos */}
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Cursos ({cursos.length})</h2>
                </div>
                <div className="flex flex-col">
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
                        <button onClick={() => handleEliminar(curso.id)} className="text-xs text-[#A9A9A2] hover:text-red-400 transition-colors">Desactivar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* SECCION CLASES */}
          {seccion === 'clases' && (
            <>
              {/* Formulario editar clase */}
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
                    <div className="flex gap-3 md:col-span-2">
                      <button type="submit" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                        Guardar cambios
                      </button>
                      <button type="button" onClick={() => setEditandoClase(null)} className="text-xs text-[#A9A9A2] tracking-widest uppercase hover:text-[#D8A48F] transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Lista clases */}
              <div className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#D8A48F]/15">
                  <h2 className="text-lg font-semibold text-[#7B9B77]">Clases ({clases.length})</h2>
                </div>
                <div className="flex flex-col">
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </section>
      </main>
    </>
  )
}

export default Admin