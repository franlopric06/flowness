import { useState } from 'react'

function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const validar = () => {
    const nuevosErrores = {}

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido'
    } else if (form.nombre.trim().length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!form.email.trim()) {
      nuevosErrores.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nuevosErrores.email = 'El email no es válido'
    }

    if (!form.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es requerido'
    } else if (form.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }

    return nuevosErrores
  }

  const sanitizar = (texto) => {
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: '' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const erroresValidacion = validar()

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion)
      return
    }

    const datosSanitizados = {
      nombre: sanitizar(form.nombre),
      email: sanitizar(form.email),
      mensaje: sanitizar(form.mensaje)
    }

    console.log('Datos enviados:', datosSanitizados)
    setEnviado(true)
    setForm({ nombre: '', email: '', mensaje: '' })
  }

  return (
    <section className="bg-white px-6 py-12 md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Contacto
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        ¿Tenés alguna <span className="text-[#7B9B77] font-semibold">consulta?</span>
      </h2>

      {enviado ? (
        <div className="max-w-lg mx-auto text-center bg-[#7B9B77]/10 border border-[#7B9B77]/30 rounded-2xl p-8">
          <p className="text-4xl mb-4">✓</p>
          <p className="text-[#7B9B77] font-semibold text-lg mb-2">¡Mensaje enviado!</p>
          <p className="text-[#A9A9A2] text-sm">Nos pondremos en contacto a la brevedad.</p>
          <button
            onClick={() => setEnviado(false)}
            className="mt-6 text-[#A9A9A2] text-xs tracking-widest uppercase hover:text-[#7B9B77] transition-colors"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-4">

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className={`bg-[#F5F0EB] border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition-colors ${
                errores.nombre ? 'border-red-400' : 'border-[#D8A48F]/30 focus:border-[#7B9B77]'
              }`}
            />
            {errores.nombre && <p className="text-red-400 text-xs">{errores.nombre}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className={`bg-[#F5F0EB] border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition-colors ${
                errores.email ? 'border-red-400' : 'border-[#D8A48F]/30 focus:border-[#7B9B77]'
              }`}
            />
            {errores.email && <p className="text-red-400 text-xs">{errores.email}</p>}
          </div>

          {/* Mensaje */}
          <div className="flex flex-col gap-1">
            <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">Mensaje</label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Escribí tu consulta acá..."
              rows={5}
              className={`bg-[#F5F0EB] border rounded-xl px-4 py-3 text-sm text-gray-600 outline-none transition-colors resize-none ${
                errores.mensaje ? 'border-red-400' : 'border-[#D8A48F]/30 focus:border-[#7B9B77]'
              }`}
            />
            {errores.mensaje && <p className="text-red-400 text-xs">{errores.mensaje}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors mt-2"
          >
            Enviar consulta
          </button>

          <p className="text-center text-[#A9A9A2] text-xs mt-2">
            También podés escribirnos por Instagram{' '}
            
             <a href="https://instagram.com/flownessargentina"
              target="_blank"
              rel="noreferrer"
              className="text-[#D8A48F] hover:opacity-70 transition-opacity"
            >
              @flownessargentina
            </a>
          </p>

        </form>
      )}
    </section>
  )
}

export default Contacto