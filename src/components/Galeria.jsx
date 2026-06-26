import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Galeria() {
  const [fotos, setFotos] = useState([])
  const [videos, setVideos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/galeria/fotos`).then(res => res.json()),
      fetch(`${API_URL}/galeria/videos`).then(res => res.json())
    ]).then(([fotosData, videosData]) => {
      setFotos(fotosData)
      setVideos(videosData)
      setCargando(false)
    }).catch(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <section className="bg-[#F5F0EB] px-6 py-12 md:px-16 md:py-16 flex items-center justify-center min-h-64">
        <div className="animate-spin w-10 h-10 border-4 border-[#7B9B77] border-t-transparent rounded-full" />
      </section>
    )
  }

  return (
    <section className="bg-[#F5F0EB] px-6 py-12 md:px-16 md:py-16">
      <p className="text-[#D8A48F] text-xs tracking-widest uppercase mb-2 text-center">
        Galería
      </p>
      <h2 className="text-3xl font-light text-gray-700 mb-10 text-center md:text-4xl">
        Conocé el <span className="text-[#7B9B77] font-semibold">método</span>
      </h2>

      {/* FOTOS */}
      {fotos.length > 0 && (
        <>
          <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-4">Fotos</p>
          <div className="grid grid-cols-1 gap-4 mb-12 md:grid-cols-3">
            {fotos.map((foto) => (
              <div key={foto.id} className="rounded-2xl overflow-hidden border border-[#D8A48F]/20">
                <img
                  src={foto.url}
                  alt={foto.descripcion}
                  className="w-full h-48 object-cover"
                />
                {foto.descripcion && (
                  <div className="bg-white px-4 py-2">
                    <p className="text-[#A9A9A2] text-xs">{foto.descripcion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <>
          <p className="text-[#A9A9A2] text-xs tracking-widest uppercase mb-4">
            Videos de muestra gratuitos
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id} className="rounded-2xl overflow-hidden border border-[#D8A48F]/20">
                <video
                  src={video.url}
                  controls
                  className="w-full h-48 object-cover"
                />
                <div className="bg-white px-4 py-2">
                  <p className="text-[#7B9B77] text-xs font-medium">{video.titulo}</p>
                  {video.descripcion && (
                    <p className="text-[#A9A9A2] text-xs">{video.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sin contenido */}
      {fotos.length === 0 && videos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#A9A9A2] text-sm">Pronto habrá contenido disponible aquí.</p>
        </div>
      )}

    </section>
  )
}

export default Galeria