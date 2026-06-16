function Contacto() {
  return (
    <section className="bg-white px-6 py-12 md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Contacto
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        ¿Tenés alguna <span className="text-[#7B9B77] font-semibold">consulta?</span>
      </h2>

      <div className="max-w-lg mx-auto flex flex-col gap-4">

        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">
            Nombre
          </label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            className="bg-white border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">
            Email
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            className="bg-white border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors"
          />
        </div>

        {/* Mensaje */}
        <div className="flex flex-col gap-1">
          <label className="text-[#A9A9A2] text-xs tracking-widest uppercase">
            Mensaje
          </label>
          <textarea
            placeholder="Escribí tu consulta acá..."
            rows={5}
            className="bg-white border border-[#D8A48F]/30 rounded-xl px-4 py-3 text-sm text-gray-600 outline-none focus:border-[#7B9B77] transition-colors resize-none"
          />
        </div>

        {/* Boton */}
        <button className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors mt-2">
          Enviar consulta
        </button>

        {/* Instagram */}
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

      </div>
    </section>
  )
}

export default Contacto