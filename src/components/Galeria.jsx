import galeria from '../data/galeria.json'

function Galeria() {
  return (
    <section className="bg-[#F5F0EB] px-6 py-12 md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Galería
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        Conocé el <span className="text-[#7B9B77] font-semibold">método</span>
      </h2>

      {/* FOTOS */}
      <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-4">Fotos</p>
      <div className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-3">
        {galeria
          .filter((item) => item.tipo === 'foto')
          .map((item) => (
            <div
              key={item.id}
              className="bg-[#E6D5B8] rounded-2xl h-48 flex items-center justify-center border border-[#D8A48F]/20"
            >
              <p className="text-[#A9A9A2] text-xs text-center px-4">
                [ {item.descripcion} ]
              </p>
            </div>
          ))}
      </div>

      {/* VIDEOS DE MUESTRA */}
      <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-4">
        Videos de muestra gratuitos
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {galeria
          .filter((item) => item.tipo === 'video')
          .map((item) => (
            <div
              key={item.id}
              className="bg-[#E6D5B8] rounded-2xl h-48 flex flex-col items-center justify-center border border-[#D8A48F]/20 gap-3"
            >
              <span className="text-4xl text-[#A9A9A2]"></span>
              <p className="text-[#A9A9A2] text-xs text-center px-4">
                {item.descripcion}
              </p>
            </div>
          ))}
      </div>
    </section>
  )
}

export default Galeria