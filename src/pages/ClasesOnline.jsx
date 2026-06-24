import { useState } from 'react'
import clases from '../data/clases.json'

function ClasesOnline() {
  const [seleccionada, setSeleccionada] = useState(null)

  return (
    <main className="pt-16 bg-[#F5F0EB] min-h-screen">

      {/* HERO */}
      <section className="px-6 py-16 text-center md:px-16">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
          Clases online
        </p>
        <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
          Aprendé el método{' '}
          <span className="text-[#7B9B77] font-semibold">en vivo</span>
        </h1>
        <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
          Reservá tu lugar en una clase en vivo o comprá la clase grabada para verla cuando quieras.
        </p>
      </section>

      {/* CLASES */}
      <section className="px-6 pb-16 md:px-16">
        <div className="flex flex-col gap-6">
          {clases.map((clase) => (
            <div
              key={clase.id}
              className="bg-white rounded-2xl border border-[#D8A48F]/15 overflow-hidden"
            >
              {/* Header de la card */}
              <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-light text-[#7B9B77]/20">{clase.fase}</span>
                    <div>
                      <h2 className="text-lg font-semibold text-[#7B9B77]">{clase.nombre}</h2>
                      <p className="text-[#A9A9A2] text-xs">Duración: {clase.duracion}</p>
                    </div>
                  </div>
                  <p className="text-[#888] text-sm leading-relaxed">{clase.descripcion}</p>
                </div>

                {/* Precios */}
                <div className="flex flex-row gap-3 md:flex-col md:items-end md:shrink-0">
                  <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl px-4 py-3">
                    <span className="text-[#7B9B77] text-xl font-light">${clase.precio_vivo.toLocaleString()}</span>
                    <span className="text-[#A9A9A2] text-[10px] tracking-widest uppercase">Clase en vivo</span>
                  </div>
                  <div className="flex flex-col items-center bg-[#F5F0EB] rounded-xl px-4 py-3">
                    <span className="text-[#7B9B77] text-xl font-light">${clase.precio_grabada.toLocaleString()}</span>
                    <span className="text-[#A9A9A2] text-[10px] tracking-widests uppercase">Clase grabada</span>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="border-t border-[#D8A48F]/15 px-6 py-4">
                <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-3">
                  Próximos horarios disponibles
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {clase.horarios.map((horario, i) => (
                    <button
                      key={i}
                      onClick={() => setSeleccionada(`${clase.id}-${i}`)}
                      className={`text-xs px-4 py-2 rounded-full border transition-colors ${
                        seleccionada === `${clase.id}-${i}`
                          ? 'bg-[#7B9B77] text-white border-[#7B9B77]'
                          : 'bg-white text-[#7B9B77] border-[#7B9B77]/30 hover:border-[#7B9B77]'
                      }`}
                    >
                      {horario}
                    </button>
                  ))}
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-2 md:flex-row">
                  <button className="flex-1 bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-3 rounded-full hover:bg-[#5a7a56] transition-colors">
                    Reservar clase en vivo
                  </button>
                  <button className="flex-1 bg-white text-[#7B9B77] text-xs tracking-widest uppercase py-3 rounded-full border border-[#7B9B77]/30 hover:border-[#7B9B77] transition-colors">
                    Comprar clase grabada
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

    </main>
  )
}

export default ClasesOnline