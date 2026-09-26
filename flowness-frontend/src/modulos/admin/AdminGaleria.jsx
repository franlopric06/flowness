import { useState, useEffect, useCallback } from 'react'
import { Images, Film } from 'lucide-react'
import EstadoInstagram from './galeria/EstadoInstagram'
import SeccionMedios from './galeria/SeccionMedios'
import * as api from './admin.servicio'

// Sección "Galería" del panel: fotos y videos, cada uno subido desde el equipo o con link de Instagram
function AdminGaleria({ mostrarMsg }) {
  const [fotos, setFotos] = useState([])
  const [reels, setReels] = useState([])
  const [pestana, setPestana] = useState('foto')
  const [instagram, setInstagram] = useState(null) // { conectado, usuario }

  useEffect(() => {
    api.obtenerEstadoInstagram().then(setInstagram).catch(() => setInstagram({ conectado: false }))
  }, [])

  const cargar = useCallback(() =>
    api.obtenerGaleriaAdmin()
      .then((datos) => { setFotos(datos.fotos || []); setReels(datos.reels || []) })
      .catch(() => mostrarMsg('No se pudo cargar la galería', 'error')), [mostrarMsg])

  useEffect(() => { cargar() }, [cargar])

  const pestanas = [['foto', `Fotos · ${fotos.length}`, Images], ['video', `Videos · ${reels.length}`, Film]]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h2 className="titulo text-verde text-3xl mr-2">Galería</h2>
        {pestanas.map(([clave, texto, Icono]) => (
          <button key={clave} onClick={() => setPestana(clave)}
            className={`btn btn-chico ${pestana === clave ? 'btn-acento' : 'border border-terracota text-terracota hover:bg-terracota/10'}`}>
            <Icono size={14} /> {texto}
          </button>
        ))}
      </div>
      <p className="text-piedra text-xs mb-5">
        En la página todas se muestran del mismo tamaño: el sistema recorta cada foto o video para que queden parejos.
      </p>

      <EstadoInstagram estado={instagram} />

      <SeccionMedios key={pestana} clase={pestana} items={pestana === 'foto' ? fotos : reels} alCambiar={cargar} mostrarMsg={mostrarMsg}
        instagramConectado={!!instagram?.conectado} />
    </div>
  )
}

export default AdminGaleria
