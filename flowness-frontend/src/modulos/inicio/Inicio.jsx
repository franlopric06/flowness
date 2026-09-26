import { useState, useEffect } from 'react'
import MediosDePago from '../../compartido/componentes/MediosDePago'
import { obtenerDatosPublicos } from '../../compartido/servicios/publico.servicio'
import { obtenerClases } from '../clases/clases.servicio'
import { obtenerCursos } from '../formacion/formacion.servicio'
import { obtenerGaleria } from '../galeria/galeria.servicio'
import Portada from './secciones/Portada'
import Novedades from './secciones/Novedades'
import SeccionFases from './secciones/SeccionFases'
import SeccionClases from './secciones/SeccionClases'
import SeccionFormacion from './secciones/SeccionFormacion'
import SeccionHistoria from './secciones/SeccionHistoria'
import SeccionGaleria from './secciones/SeccionGaleria'
import Cierre from './secciones/Cierre'

// Inicio: pide los datos y arma la página con sus secciones, en orden
function Inicio() {
  const [datos, setDatos] = useState({ fases: [], sobreMi: null, avisos: [], configuracion: {} })
  const [clases, setClases] = useState(null) // null = cargando
  const [cursos, setCursos] = useState(null)
  const [galeria, setGaleria] = useState({ fotos: [], reels: [] })

  useEffect(() => {
    obtenerDatosPublicos().then(setDatos).catch(() => {})
    obtenerClases().then(setClases).catch(() => setClases([]))
    obtenerCursos().then(setCursos).catch(() => setCursos([]))
    obtenerGaleria().then(setGaleria).catch(() => {})
  }, [])

  const hayClaseGratis = (clases || []).some((c) => c.esGratis)

  return (
    <main className="pt-16 md:pt-20 overflow-x-clip">
      <Portada configuracion={datos.configuracion} hayClaseGratis={hayClaseGratis} />
      <MediosDePago />
      <Novedades avisos={datos.avisos} />
      <SeccionFases fases={datos.fases} />
      <SeccionClases clases={clases} />
      <SeccionFormacion cursos={cursos} />
      <SeccionHistoria sobreMi={datos.sobreMi} />
      <SeccionGaleria galeria={galeria} />
      <Cierre hayClaseGratis={hayClaseGratis} />
    </main>
  )
}

export default Inicio
