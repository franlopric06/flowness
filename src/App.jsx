import Header from './layout/Header'
import Main from './layout/Main'
import SobreMi from './components/SobreMi'
import Catalogo from './components/Catalogo'
import Galeria from './components/Galeria'
import Contacto from './components/Contacto'
import Footer from './layout/Footer'

function App() {
  return (
    <>
      <Header />
      <Main />
      <SobreMi />
      <Catalogo />
      <Galeria />
      <Contacto />  
      <Footer />
    </>
  )
}

export default App