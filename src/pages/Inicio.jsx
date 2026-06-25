import Main from '../layout/Main'
import SobreMiComponent from '../components/SobreMi'
import Formacion from './Formacion'
import GaleriaComponent from '../components/Galeria'
import ContactoComponent from '../components/Contacto'

function Inicio() {
  return (
    <>
      <Main />
      <SobreMiComponent />
      <Formacion />
      <GaleriaComponent />
      <ContactoComponent />
    </>
  )
}

export default Inicio