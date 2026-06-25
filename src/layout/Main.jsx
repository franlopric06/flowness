import { Link } from 'react-router-dom'
function Main() {
  const fases = [
    { num: "01", nombre: "Consciencia Corporal", desc: "Reconocimiento del cuerpo y sus límites actuales como punto de partida." },
    { num: "02", nombre: "Movilidad Articular", desc: "Trabajo progresivo sobre el rango de movimiento de cada articulación." },
    { num: "03", nombre: "Flexibilidad Activa", desc: "Desarrollo de la flexibilidad desde la fuerza muscular controlada." },
    { num: "04", nombre: "Control y Estabilidad", desc: "Integración del movimiento con el control postural y la estabilidad." },
    { num: "05", nombre: "Fluidez de Movimiento", desc: "Conexión entre fases para lograr un movimiento natural y fluido." },
    { num: "06", nombre: "Mindfulness en Movimiento", desc: "Integración de la conciencia plena con cada patrón de movimiento." },
  ]

  return (
    <main className="pt-16">

      {/* HERO */}
      <section className="bg-[#F5F0EB] flex items-center justify-center px-6 py-16 text-center md:min-h-screen md:px-16">
        <div className="flex flex-col items-center max-w-2xl">
          <span className="bg-[#7B9B77]/10 border border-[#7B9B77]/30 text-[#7B9B77] text-[10px] tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            Método registrado a nivel nacional
          </span>
          <h1 className="text-4xl font-light text-gray-800 leading-tight mb-6 md:text-6xl">
            Movilidad y <br />
            <span className="text-[#7B9B77] font-semibold">Flexibilidad</span><br />
            desde <span className="text-[#D8A48F]">adentro</span>
          </h1>
          <p className="text-[#A9A9A2] text-sm leading-relaxed mb-10 max-w-md md:text-base">
            Flowness es un método occidental de movilidad, flexibilidad y mindfulness estructurado en seis fases progresivas.
          </p>
          <div className="flex flex-col gap-4 w-full md:flex-row md:w-auto">
            <Link to="/formacion" className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full text-center hover:bg-[#5a7a56] transition-colors">
              Explorar cursos
            </Link>
            <Link to="/clases" className="text-[#D8A48F] text-xs tracking-widest uppercase text-center py-4 hover:opacity-70 transition-opacity">
              Ver el método →
            </Link>
          </div>
        </div>
      </section>

    {/* STATS */}
<section className="bg-[#E6D5B8]/30 border-t border-b border-[#D8A48F]/20">
  <div className="grid grid-cols-1 md:grid-cols-3">
    
    {/* 6 Fases */}
    <Link to="/clases" className="py-8 text-center border-b border-[#D8A48F]/20 md:border-b-0 md:border-r hover:bg-[#E6D5B8]/50 transition-colors cursor-pointer">
      <p className="text-4xl font-light text-[#7B9B77]">6</p>
      <p className="text-[10px] tracking-widest uppercase text-[#A9A9A2] mt-2">Fases del método</p>
      <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mt-1">Ver clases →</p>
    </Link>

    {/* 3 Niveles */}
    <Link to="/formacion" className="py-8 text-center border-b border-[#D8A48F]/20 md:border-b-0 md:border-r hover:bg-[#E6D5B8]/50 transition-colors cursor-pointer">
      <p className="text-4xl font-light text-[#7B9B77]">3</p>
      <p className="text-[10px] tracking-widest uppercase text-[#A9A9A2] mt-2">Niveles de formación</p>
      <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mt-1">Ver cursos →</p>
    </Link>

    {/* 100% Registrado */}
    <Link to="/formacion" className="py-8 text-center hover:bg-[#E6D5B8]/50 transition-colors cursor-pointer">
      <p className="text-4xl font-light text-[#7B9B77]">100%</p>
      <p className="text-[10px] tracking-widest uppercase text-[#A9A9A2] mt-2">Método registrado</p>
      <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mt-1">Conocer más →</p>
    </Link>

  </div>
</section>

     {/* FASES */}
<section className="bg-white px-6 py-16 md:px-16">
  <p className="text-[10px] tracking-widest uppercase text-[#D8A48F] mb-3 text-center">El método</p>
  <h2 className="text-3xl font-light text-gray-800 text-center mb-12 md:text-4xl">
    Seis fases hacia el <span className="text-[#7B9B77] font-semibold">bienestar</span>
  </h2>
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {fases.map((fase) => (
      <Link
        key={fase.num}
        to="/clases"
        className="bg-[#F5F0EB] rounded-2xl p-8 border border-[#D8A48F]/15 hover:shadow-lg hover:border-[#7B9B77]/30 transition-all cursor-pointer"
      >
        <p className="text-5xl font-light text-[#7B9B77]/20 mb-4">{fase.num}</p>
        <p className="text-[#7B9B77] font-semibold mb-2">{fase.nombre}</p>
        <p className="text-[#A9A9A2] text-sm leading-relaxed">{fase.desc}</p>
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mt-4 hover:opacity-70">
          Ver clases →
        </p>
      </Link>
    ))}
  </div>
</section>

    </main>
  )
}

export default Main