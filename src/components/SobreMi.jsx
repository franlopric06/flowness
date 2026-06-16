function SobreMi() {
  return (
    <section className="bg-white px-6 py-12 md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Sobre mí
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        Quién está detrás de{' '}
        <span className="text-[#7B9B77] font-semibold">Flowness</span>
      </h2>

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">

        {/* Foto */}
        <div className="bg-[#E6D5B8] rounded-2xl h-64 flex items-center justify-center md:w-1/3 md:h-80 border border-[#D8A48F]/20">
          <p className="text-[#A9A9A2] text-xs text-center px-4">
            [ Foto de Flor Verazay ]
          </p>
        </div>

        {/* Texto */}
        <div className="md:w-2/3">
          <h3 className="text-[#7B9B77] font-semibold text-xl mb-1">
            Flor Verazay
          </h3>
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-6">
            Kinesióloga — Creadora del método Flowness
          </p>
          <p className="text-[#888] text-sm leading-relaxed mb-4">
            Flor es kinesióloga de la ciudad de Tinogasta, Catamarca. A lo largo de su trayectoria profesional desarrolló un método propio de movilidad, flexibilidad y mindfulness estructurado en seis fases progresivas, registrado a nivel nacional en las categorías de fitness, salud, formación y educación.
          </p>
          <p className="text-[#888] text-sm leading-relaxed mb-8">
            Su método nació de la necesidad de ofrecer una alternativa accesible y efectiva para mejorar la calidad de movimiento y el bienestar integral, combinando técnicas de fisioterapia, movimiento funcional y atención plena.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:gap-6">
            <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl py-4 px-6">
              <span className="text-[#7B9B77] text-2xl font-light">6</span>
              <span className="text-[#A9A9A2] text-xs tracking-widest uppercase">Fases del método</span>
            </div>
            <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl py-4 px-6">
              <span className="text-[#7B9B77] text-2xl font-light">3</span>
              <span className="text-[#A9A9A2] text-xs tracking-widest uppercase">Niveles de formación</span>
            </div>
            <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl py-4 px-6">
              <span className="text-[#7B9B77] text-2xl font-light">100%</span>
              <span className="text-[#A9A9A2] text-xs tracking-widest uppercase">Método registrado</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default SobreMi