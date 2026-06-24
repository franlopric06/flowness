function ElMetodo() {
  const fases = [
    { num: "01", nombre: "Consciencia Corporal", desc: "Reconocimiento del cuerpo y sus límites actuales como punto de partida. Aprendemos a escuchar las señales internas y a identificar patrones de tensión y compensación.", beneficios: ["Mayor autoconocimiento corporal", "Identificación de zonas de tensión", "Base para el trabajo progresivo"] },
    { num: "02", nombre: "Movilidad Articular", desc: "Trabajo progresivo sobre el rango de movimiento de cada articulación. Exploramos los límites actuales del cuerpo de forma segura y consciente.", beneficios: ["Mayor rango de movimiento", "Lubricación articular", "Reducción de rigidez"] },
    { num: "03", nombre: "Flexibilidad Activa", desc: "Desarrollo de la flexibilidad desde la fuerza muscular controlada. No se trata de forzar el cuerpo sino de ganar amplitud desde adentro.", beneficios: ["Flexibilidad sostenible", "Mayor fuerza en el rango amplio", "Menor riesgo de lesiones"] },
    { num: "04", nombre: "Control y Estabilidad", desc: "Integración del movimiento con el control postural y la estabilidad. Aprendemos a movernos con precisión y eficiencia.", beneficios: ["Mejor postura", "Mayor control motor", "Estabilidad en el movimiento"] },
    { num: "05", nombre: "Fluidez de Movimiento", desc: "Conexión entre fases para lograr un movimiento natural y fluido. El cuerpo comienza a moverse como una unidad integrada.", beneficios: ["Movimiento más natural", "Coordinación mejorada", "Mayor economía de movimiento"] },
    { num: "06", nombre: "Mindfulness en Movimiento", desc: "Integración de la conciencia plena con cada patrón de movimiento. La mente y el cuerpo trabajan en completa sincronía.", beneficios: ["Mayor concentración", "Reducción del estrés", "Bienestar integral"] },
  ]

  return (
    <main className="pt-16 bg-[#F5F0EB] min-h-screen">

      {/* HERO */}
      <section className="px-6 py-16 text-center md:px-16">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
          El método
        </p>
        <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
          Seis fases hacia el{' '}
          <span className="text-[#7B9B77] font-semibold">bienestar</span>
        </h1>
        <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
          Flowness es un método occidental de movilidad, flexibilidad y mindfulness estructurado en seis fases progresivas, diseñado para transformar la relación con tu cuerpo de forma gradual y sostenible.
        </p>
      </section>

      {/* FASES */}
      <section className="px-6 pb-16 md:px-16">
        <div className="flex flex-col gap-6">
          {fases.map((fase, index) => (
            <div
              key={fase.num}
              className={`rounded-2xl p-8 border border-[#D8A48F]/15 ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#E6D5B8]/30'
              }`}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">

                {/* Numero */}
                <div className="md:w-24 md:shrink-0">
                  <p className="text-6xl font-light text-[#7B9B77]/20">{fase.num}</p>
                </div>

                {/* Contenido */}
                <div className="flex flex-col gap-4 flex-1">
                  <h2 className="text-xl font-semibold text-[#7B9B77]">{fase.nombre}</h2>
                  <p className="text-[#888] text-sm leading-relaxed">{fase.desc}</p>

                  {/* Beneficios */}
                  <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:flex-wrap">
                    {fase.beneficios.map((b, i) => (
                      <span
                        key={i}
                        className="bg-[#7B9B77]/10 text-[#7B9B77] text-xs tracking-wide px-4 py-2 rounded-full"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center bg-[#7B9B77] md:px-16">
        <h2 className="text-3xl font-light text-white mb-4">
          ¿Listo para empezar?
        </h2>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
          Elegí el nivel que más se adapta a tu momento y comenzá tu camino con Flowness.
        </p>
        
          <a href="/cursos"
          className="inline-block bg-white text-[#7B9B77] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#F5F0EB] transition-colors"
        >
          Ver cursos →
        </a>
      </section>

    </main>
  )
}

export default ElMetodo