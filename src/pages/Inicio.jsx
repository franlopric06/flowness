import Main from '../layout/Main'
import SobreMiComponent from '../components/SobreMi'
import Formacion from './Formacion'
import GaleriaComponent from '../components/Galeria'
import ContactoComponent from '../components/Contacto'
import SEO from '../components/SEO'

function Inicio() {
  return (
    <>
     <SEO
        titulo="Inicio"
        descripcion="Flowness es un método occidental de movilidad, flexibilidad y mindfulness estructurado en seis fases progresivas. Registrado a nivel nacional."
        url="/"
      />
      <Main />
      <SobreMiComponent />
      <Formacion />
      <GaleriaComponent />
      <ContactoComponent />
    </>
  )
}

export default Inicio