import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Header from './layout/Header'
import Footer from './layout/Footer'
import Inicio from './pages/Inicio'
import ComprarCursos from './pages/ComprarCursos'
import Contacto from './pages/Contacto'
import SobreMi from './pages/SobreMi'
import Galeria from './pages/Galeria'
import Login from './pages/Login'
import Cursos from './pages/Cursos'
import Clases from './pages/Clases'
import ComprarClases from './pages/ComprarClases'
import Vibra from './components/Vibra'
import Admin from './pages/Admin'
import PagoExitoso from './pages/PagoExitoso'
import MiCuenta from './pages/MiCuenta'
import WhatsappButton from './components/WhatsappButton'

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <>
            <Vibra />
            <WhatsappButton />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/comprar-cursos" element={<ComprarCursos />} />
              <Route path="/clases" element={<Clases />} />
              <Route path="/comprar-clases" element={<ComprarClases />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/sobre-mi" element={<SobreMi />} />
              <Route path="/galeria" element={<Galeria />} />
              <Route path="/ingresar" element={<Login />} />
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/mi-cuenta" element={<MiCuenta />} />
            </Routes>
          </>
        } />
      </Routes>
      <Footer />
    </>
  )
}

export default App