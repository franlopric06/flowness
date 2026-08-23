import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVibrar } from '../hooks/useVibrar'
import { obtenerDatosPublicos } from '../servicios/api'

function Inicio() {
  const [datos, setDatos] = useState({ fases: [], sobreMi: null, fotos: [], avisos: [], configuracion: {} })
  const vibrar = useVibrar()

  useEffect(() => {
    obtenerDatosPublicos().then(setDatos).catch(() => {})
  }, [])

  const { fases, sobreMi, fotos, avisos, configuracion } = datos
  const heroTitulo = configuracion.hero_titulo || 'Flowness'
  const heroSubtitulo = configuracion.hero_subtitulo || 'Movilidad · Flexibilidad · Mindfulness'
  const heroDescripcion = configuracion.hero_descripcion || 'Un método occidental de bienestar estructurado en seis fases progresivas.'

  return (
    <main className="pt-20">

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#F5F0EB]">
        <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-4">{heroSubtitulo}</p>
        <h1 className="text-[#7B9B77] text-5xl md:text-7xl font-bold tracking-widest mb-6">{heroTitulo}</h1>
        <p className="text-[#A9A9A2] text-sm md:text-base max-w-lg leading-relaxed mb-10">{heroDescripcion}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/clases" onClick={vibrar} className="bg-[#7B9B77] text-white text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#5a7a56] transition-colors">
            Ver clases
          </Link>
          <Link to="/sobre-mi" onClick={vibrar} className="border border-[#D8A48F] text-[#D8A48F] text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-[#D8A48F]/10 transition-colors">
            Sobre mí
          </Link>
        </div>
      </section>

      {/* AVISOS */}
      {avisos.length > 0 && (
        <section className="bg-[#7B9B77]/10 border-t border-b border-[#7B9B77]/20 px-6 py-8 md:px-16">
          <p className="text-[#7B9B77] text-xs tracking-widest uppercase mb-4">📢 Novedades</p>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="bg-white rounded-2xl p-5 border border-[#7B9B77]/20 flex-1 md:min-w-64">
                <p className="text-[#555] font-medium mb-1">{aviso.titulo}</p>
                <p className="text-[#888] text-sm">{aviso.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LAS 6 FASES DEL MÉTODO */}
      {fases.length > 0 && (
        <section className="px-6 py-16 md:px-16 bg-white">
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">El método</p>
          <h2 className="text-[#7B9B77] text-2xl md:text-3xl font-bold text-center tracking-widest mb-10">Las 6 fases de Flowness</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {fases.map((fase) => (
              <div key={fase.id} className="bg-[#F5F0EB] rounded-2xl overflow-hidden border border-[#D8A48F]/20">
                {fase.videoUrl && (
                  <video
                    src={fase.videoUrl}
                    className="w-full h-40 object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}
                <div className="p-5">
                  <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">Fase {fase.numero}</p>
                  <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase mb-2">{fase.nombre}</h3>
                  <p className="text-[#A9A9A2] text-xs leading-relaxed">{fase.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SOBRE MÍ */}
      {sobreMi && (
        <section className="px-6 py-16 md:px-16 bg-[#F5F0EB]">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
            {sobreMi.fotoUrl && (
              <img src={sobreMi.fotoUrl} alt={sobreMi.nombre} className="w-48 h-48 rounded-full object-cover border-4 border-[#D8A48F]/30" />
            )}
            <div>
              <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2">Sobre mí</p>
              <h2 className="text-[#7B9B77] text-2xl font-bold tracking-widest mb-2">{sobreMi.nombre}</h2>
              <p className="text-[#A9A9A2] text-sm mb-3">{sobreMi.titulo}</p>
              <p className="text-[#555] text-sm leading-relaxed mb-3">{sobreMi.descripcion1}</p>
              <p className="text-[#555] text-sm leading-relaxed">{sobreMi.descripcion2}</p>
            </div>
          </div>
        </section>
      )}

      {/* GALERÍA */}
      {fotos.length > 0 && (
        <section className="px-6 py-16 md:px-16 bg-white">
          <p className="text-[#D8A48F] text-xs tracking-widest uppercase text-center mb-2">Galería</p>
          <h2 className="text-[#7B9B77] text-2xl font-bold text-center tracking-widest mb-10">Momentos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {fotos.map((foto) => (
              <img key={foto.id} src={foto.url} alt={foto.descripcion || ''} className="w-full h-40 object-cover rounded-xl" />
            ))}
          </div>
        </section>
      )}

    </main>
  )
}

export default Inicio
