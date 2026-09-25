import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useVibrar } from '../../compartido/hooks/useVibrar'
import ReproductorVideo from '../../compartido/componentes/ReproductorVideo'
import { obtenerClases } from '../clases/clases.servicio'

function MiCuenta() {
  const [misClases, setMisClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const [claseAbierta, setClaseAbierta] = useState(null)
  const vibrar = useVibrar()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    obtenerClases()
      .then((clases) => setMisClases(clases.filter((c) => c.tieneAcceso)))
      .catch(() => {})
      .finally(() => setCargando(false))
  }, [])

  return (
    <main className="pt-32 min-h-screen px-6 md:px-16 pb-16">
      <h1 className="text-[#7B9B77] text-3xl font-bold tracking-widest mb-2">Hola, {usuario.nombre}</h1>
      <p className="text-[#A9A9A2] text-sm mb-10">Tus clases disponibles:</p>

      {cargando ? (
        <p className="text-[#A9A9A2]">Cargando…</p>
      ) : misClases.length === 0 ? (
        <p className="text-[#A9A9A2]">
          Todavía no tenés clases.{' '}
          <Link to="/clases" onClick={vibrar} className="text-[#7B9B77] underline">Ver clases disponibles</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {misClases.map((clase) => (
            <button key={clase.id} onClick={() => { vibrar(); setClaseAbierta(clase) }}
              className="text-left bg-white rounded-2xl overflow-hidden border border-[#7B9B77]/20 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-[#7B9B77]/25 to-[#D8A48F]/25 flex items-center justify-center">
                {clase.miniaturaUrl
                  ? <img src={clase.miniaturaUrl} alt={clase.nombre} loading="lazy" className="h-full w-full object-cover" />
                  : <img src="/logo.png" alt="" className="h-14 w-14 opacity-40" />}
              </div>
              <div className="p-4">
                <p className="text-[#D8A48F] text-[10px] tracking-widest uppercase mb-1">{clase.esGratis ? 'Gratis' : 'Comprada'}</p>
                <h3 className="text-[#7B9B77] font-semibold text-sm tracking-widest uppercase">{clase.nombre}</h3>
              </div>
            </button>
          ))}
        </div>
      )}

      {claseAbierta && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setClaseAbierta(null)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <h2 className="text-[#7B9B77] font-bold text-lg tracking-widest">{claseAbierta.nombre}</h2>
              <button onClick={() => { vibrar(); setClaseAbierta(null) }} aria-label="Cerrar"
                className="text-[#A9A9A2] text-2xl leading-none hover:opacity-60">×</button>
            </div>
            <ReproductorVideo url={claseAbierta.videoUrl} titulo={claseAbierta.nombre} />
          </div>
        </div>
      )}
    </main>
  )
}

export default MiCuenta
