import cursos from '../data/cursos.json'

function Catalogo() {
  return (
    <section className="bg-white px-6 py-12 text-center md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">
        Formación online
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 md:text-4xl">
        Aprendé el método <span className="text-[#7B9B77] font-semibold">Flowness</span>
      </h2>

      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        {cursos.map((curso) => (
          <div key={curso.id} className="bg-[#F5F0EB] rounded-2xl overflow-hidden border border-[#D8A48F]/20 flex-1">
            <div className="bg-[#E6D5B8] px-6 py-8">
              <p className="text-[#A9A9A2] text-[10px] tracking-widest uppercase mb-2">
                NIVEL {curso.nivel}
              </p>
              <h3 className="text-[#555] text-xl font-semibold mb-2">{curso.nombre}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{curso.descripcion}</p>
            </div>
            <div className="px-6 py-8">
              <p className="text-[#7B9B77] text-4xl font-light mb-1">
                ${curso.precio.toLocaleString()}
              </p>
              <p className="text-[#A9A9A2] text-xs mb-6">/ {curso.acceso}</p>
              <ul className="text-left flex flex-col gap-2 mb-6">
                <li className="text-[#888] text-sm">✓ {curso.videos} videos</li>
                <li className="text-[#888] text-sm">✓ {curso.duracion}</li>
                <li className="text-[#888] text-sm">✓ Acceso de por vida</li>
              </ul>
              <button className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                Comenzar ahora
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Catalogo