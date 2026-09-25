import { Children, useRef, useState } from 'react'

// Carrusel para el celular: los elementos se deslizan hacia los costados
// (con "imán" para que queden alineados) y abajo hay puntitos que muestran
// en cuál estás. En computadora se usa el diseño que se pase en claseEscritorio
// (por ejemplo una grilla), así no hace falta deslizar.
function Carrusel({ children, claseEscritorio = '', claseCelular = 'flex gap-3', puntos = true }) {
  const ref = useRef(null)
  const [actual, setActual] = useState(0)
  const cantidad = Children.count(children)

  const alDesplazar = () => {
    const el = ref.current
    if (!el) return
    const hijos = [...el.children]
    const inicio = el.scrollLeft + parseFloat(getComputedStyle(el).paddingLeft || 0)
    let cercano = 0
    hijos.forEach((h, i) => {
      if (Math.abs(h.offsetLeft - inicio) < Math.abs(hijos[cercano].offsetLeft - inicio)) cercano = i
    })
    // Si llegó al final, marcar el último
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) cercano = hijos.length - 1
    setActual(cercano)
  }

  const irA = (i) => {
    const el = ref.current
    const hijo = el?.children[i]
    if (!hijo) return
    el.scrollTo({ left: hijo.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || 0), behavior: 'smooth' })
  }

  return (
    <div>
      <div ref={ref} onScroll={alDesplazar}
        className={`${claseCelular} overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-5 px-5 scroll-px-5 pb-1 [&>*]:snap-start [&>*]:shrink-0 ${claseEscritorio}`}>
        {children}
      </div>
      {puntos && cantidad > 8 && (
        <p className="md:hidden text-center text-piedra text-xs tracking-widest mt-4">{actual + 1} / {cantidad}</p>
      )}
      {puntos && cantidad > 1 && cantidad <= 8 && (
        <div className="md:hidden flex justify-center gap-1.5 mt-4" role="tablist" aria-label="Elegir elemento">
          {Array.from({ length: cantidad }).map((_, i) => (
            <button key={i} onClick={() => irA(i)} aria-label={`Ir al ${i + 1}`} aria-selected={actual === i} role="tab"
              className={`h-1.5 rounded-full transition-all duration-300 ${actual === i ? 'w-6 bg-verde' : 'w-1.5 bg-verde/30'}`} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carrusel
