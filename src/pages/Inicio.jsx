import { useState, useEffect } from 'react'
import Main from '../layout/Main'
import SobreMiComponent from '../components/SobreMi'
import Cursos from './Cursos'
import GaleriaComponent from '../components/Galeria'
import ContactoComponent from '../components/Contacto'
import SEO from '../components/SEO'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function Inicio() {
  const [avisos, setAvisos] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/avisos`)
      .then(res => res.json())
      .then(data => setAvisos(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  return (
    <>
      <SEO
        titulo="Inicio"
        descripcion="Flowness es un método occidental de movilidad, flexibilidad y mindfulness estructurado en seis fases progresivas. Registrado a nivel nacional."
        url="/"
      />
      <Main />

      {/* AVISOS */}
      {avisos.length > 0 && (
        <section className="bg-[#7B9B77]/10 border-t border-b border-[#7B9B77]/20 px-6 py-8 md:px-16">
          <p className="text-[#7B9B77] text-xs tracking-widest uppercase mb-4">📢 Novedades</p>
          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
            {avisos.map((aviso) => (
              <div key={aviso.id} className="bg-white rounded-2xl p-5 border border-[#7B9B77]/20 flex-1 md:min-w-64">
                <p className="text-[#555] font-medium mb-1">{aviso.titulo}</p>
                <p className="text-[#888] text-sm">{aviso.descripcion}</p>
                <p className="text-[#A9A9A2] text-xs mt-2">{new Date(aviso.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <SobreMiComponent />
      <Cursos />
      <GaleriaComponent />
      <ContactoComponent />
    </>
  )
}

export default Inicio