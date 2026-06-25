import { Link } from 'react-router-dom'
import cursos from '../data/cursos.json'

function Cursos() {
  return (
    <main className="pt-12 min-hscreen md:pt-24 bg-[#F5F0EB] min-h-screen">

      {/* HERO */}
      <section className="px-6 py-16 text-center md:px-16">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-3">
          Formación online
        </p>
        <h1 className="text-4xl font-light text-gray-800 mb-6 md:text-5xl">
          Elegí tu <span className="text-[#7B9B77] font-semibold">nivel</span>
        </h1>
        <p className="text-[#A9A9A2] text-sm leading-relaxed max-w-xl mx-auto md:text-base">
          Accedé a los cursos grabados de Flowness y aprendé a tu ritmo desde cualquier lugar.
        </p>
      </section>

      {/* CURSOS */}
      <section className="px-6 pb-16 md:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#D8A48F]/15 flex flex-col flex-1"
            >
              {/* Header */}
              <div className="bg-[#E6D5B8] px-6 py-8">
                <p className="text-[#A9A9A2] text-[10px] tracking-widest uppercase mb-2">
                  NIVEL {curso.nivel}
                </p>
                <h2 className="text-xl font-semibold text-[#555] mb-2">{curso.nombre}</h2>
                <p className="text-[#888] text-sm leading-relaxed">{curso.descripcion}</p>
              </div>

              {/* Body */}
              <div className="px-6 py-8 flex flex-col flex-1">

                {/* Info */}
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-[#D8A48F]/15">
                    <span className="text-[#A9A9A2] text-xs">Duración</span>
                    <span className="text-[#555] text-xs font-medium">{curso.duracion}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#D8A48F]/15">
                    <span className="text-[#A9A9A2] text-xs">Videos</span>
                    <span className="text-[#555] text-xs font-medium">{curso.videos} clases</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[#A9A9A2] text-xs">Acceso</span>
                    <span className="text-[#555] text-xs font-medium">{curso.acceso}</span>
                  </div>
                </div>

                {/* Precio */}
                <div className="text-center mb-6">
                  <p className="text-4xl font-light text-[#7B9B77]">
                    ${curso.precio.toLocaleString()}
                  </p>
                  <p className="text-[#A9A9A2] text-xs mt-1">pago único</p>
                </div>

                {/* Boton */}
                <div className="mt-auto flex flex-col gap-3">
                  <button className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
                    Comprar ahora
                  </button>
                  <Link
                    to="/clases"
                    className="w-full text-center text-[#A9A9A2] text-xs tracking-widest uppercase py-2 hover:text-[#7B9B77] transition-colors"
                  >
                    Ver clases online →
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INFO */}
      <section className="px-6 py-12 bg-white md:px-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">📱</span>
            <p className="text-[#7B9B77] font-semibold text-sm">Acceso desde cualquier dispositivo</p>
            <p className="text-[#A9A9A2] text-xs leading-relaxed">Celular, tablet o computadora</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">♾️</span>
            <p className="text-[#7B9B77] font-semibold text-sm">Acceso de por vida</p>
            <p className="text-[#A9A9A2] text-xs leading-relaxed">Comprás una vez y es tuyo para siempre</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">🎓</span>
            <p className="text-[#7B9B77] font-semibold text-sm">Certificación incluida</p>
            <p className="text-[#A9A9A2] text-xs leading-relaxed">Al completar el nivel 03</p>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Cursos