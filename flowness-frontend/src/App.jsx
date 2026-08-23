import { Routes, Route } from 'react-router-dom'
import Header from './layout/Encabezado'
import Footer from './layout/PiePagina'
import ScrollAlTope from './componentes/ScrollAlTope'
import PopupFlowness from './componentes/PopupFlowness'
import BotonWhatsapp from './componentes/BotonWhatsapp'
import Inicio from './paginas/Inicio'
import Clases from './paginas/Clases'
import SobreMi from './paginas/SobreMi'
import Galeria from './paginas/Galeria'
import Contacto from './paginas/Contacto'
import Ingresar from './paginas/Ingresar'
import MiCuenta from './paginas/MiCuenta'
import PagoExitoso from './paginas/PagoExitoso'
import PagoFallido from './paginas/PagoFallido'
import Admin from './paginas/Admin'

function App() {
  return (
    <>
      <ScrollAlTope />
      <Header />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <>
            <PopupFlowness />
            <BotonWhatsapp />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/clases" element={<Clases />} />
              <Route path="/sobre-mi" element={<SobreMi />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/ingresar" element={<Ingresar />} />
              <Route path="/mi-cuenta" element={<MiCuenta />} />
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/pago-fallido" element={<PagoFallido />} />
            </Routes>
          </>
        } />
      </Routes>
      <Footer />
    </>
  )
}

export default App
