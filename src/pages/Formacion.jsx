import { Link } from 'react-router-dom'

function ElMetodo() {
  const niveles = [
    {
      num: "01",
      nombre: "Flowness Esencial",
      nivel: "Básico",
      desc: "Diseñado para personas que se inician en el movimiento consciente. No se requieren conocimientos previos. Aprendés los fundamentos del método Flowness desde cero, trabajando la consciencia corporal y la movilidad básica.",
      incluye: ["Acceso a las 6 fases en nivel básico", "Videos explicativos de cada ejercicio", "Guía de práctica semanal", "Acceso de por vida"],
      para: "Personas sin experiencia previa en kinesiología o educación física"
    },
    {
      num: "02",
      nombre: "Flowness Avanza",
      nivel: "Intermedio",
      desc: "Para quienes ya tienen una base de movimiento y quieren profundizar en el método. Trabajamos flexibilidad activa, control postural y fluidez de movimiento con mayor complejidad técnica.",
      incluye: ["Progresión de las 6 fases nivel intermedio", "Videos de corrección técnica", "Rutinas de práctica avanzadas", "Acceso de por vida"],
      para: "Personas con experiencia básica en movimiento o que completaron el Nivel 01"
    },
    {
      num: "03",
      nombre: "Flowness Pro",
      nivel: "Avanzado",
      desc: "Formación completa orientada a profesionales de la salud y el movimiento. Incluye la metodología completa de Flowness con profundidad técnica y científica para aplicar en la práctica profesional.",
      incluye: ["Metodología completa del método Flowness", "Fundamentos anatómicos y fisiológicos", "Protocolo de aplicación profesional", "Certificación de instructor Flowness"],
      para: "Kinesiólogos, profesores de educación física y profesionales de la salud"
    }
  ]

  return (
    <main className="pt-14 bg-[#F5F0EB] min-h-screen md:pt-22">
     
      {/* HERO */}
      <section className="px-6 py-16 text-center md:px-16">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
          Formación Flowness
        </p>
        <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
          Tres niveles de{' '}
          <span className="text-[#7B9B77] font-semibold">formación</span>
        </h1>
        <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
          Flowness ofrece una formación progresiva en tres niveles, desde los fundamentos hasta la certificación profesional. Cada nivel está diseñado para acompañar tu crecimiento de forma gradual y sostenible.
        </p>
      </section>

      {/* NIVELES */}
      <section className="px-6 pb-16 md:px-16">
        <div className="flex flex-col gap-6">
          {niveles.map((nivel, index) => (
            <div
              key={nivel.num}
              className={`rounded-2xl p-8 border border-[#D8A48F]/15 ${
                index % 2 === 0 ? 'bg-white' : 'bg-[#E6D5B8]/30'
              }`}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">

                {/* Numero */}
                <div className="md:w-24 md:shrink-0">
                  <p className="text-6xl font-light text-[#7B9B77]/20">{nivel.num}</p>
                  <span className="text-[#D8A48F] text-xs tracking-widest uppercase">{nivel.nivel}</span>
                </div>

                {/* Contenido */}
                <div className="flex flex-col gap-4 flex-1">
                  <h2 className="text-xl font-semibold text-[#7B9B77]">{nivel.nombre}</h2>
                  <p className="text-[#888] text-sm leading-relaxed">{nivel.desc}</p>

                  {/* Para quien es */}
                  <p className="text-[#A9A9A2] text-xs italic">
                    👤 {nivel.para}
                  </p>

                  {/* Incluye */}
                  <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:flex-wrap">
                    {nivel.incluye.map((item, i) => (
                      <span
                        key={i}
                        className="bg-[#7B9B77]/10 text-[#7B9B77] text-xs tracking-wide px-4 py-2 rounded-full"
                      >
                        ✓ {item}
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
        <Link
          to="/cursos"
          className="inline-block bg-white text-[#7B9B77] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#F5F0EB] transition-colors"
        >
          Ver precios y comprar →
        </Link>
      </section>

    </main>
  )
}

export default ElMetodo