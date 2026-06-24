import Main from '../layout/Main'
import SobreMiComponent from '../components/SobreMi'
import CatalogoComponent from '../components/Catalogo'
import GaleriaComponent from '../components/Galeria'
import ContactoComponent from '../components/Contacto'

function Inicio() {
  return (
    <>
      <Main />
      <SobreMiComponent />
      <CatalogoComponent />
      <GaleriaComponent />
      <ContactoComponent />
    </>
  )
}

export default Inicio