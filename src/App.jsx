import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import Header from './layout/Header'
import Footer from './layout/Footer'
import Inicio from './pages/Inicio'
import Cursos from './pages/Cursos'
import Contacto from './pages/Contacto'
import SobreMi from './pages/SobreMi'
import Galeria from './pages/Galeria'
import Login from './pages/Login'
import Formacion from './pages/Formacion'
import ClasesOnline from './pages/ClasesOnline'
import Vibra from './components/Vibra'
import Admin from './pages/Admin'
import PagoExitoso from './pages/PagoExitoso'


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
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sobre-mi" element={<SobreMi />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/formacion" element={<Formacion />} />
        <Route path="/clases" element={<ClasesOnline />} />
        <Route path="/pago-exitoso" element={<PagoExitoso />} />
      </Routes>
    </>
  } />
</Routes>
      <Footer />
    </>
  )
}

export default App