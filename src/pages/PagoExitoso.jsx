import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/SEO'

function PagoExitoso() {
  const [searchParams] = useSearchParams()
  const [procesando, setProcesando] = useState(true)

  useEffect(() => {
    // Esperamos unos segundos para que el webhook procese el pago
    setTimeout(() => {
      setProcesando(false)
    }, 3000)
  }, [])

  return (
    <>
      <SEO
        titulo="Pago exitoso"
        descripcion="Tu pago fue procesado correctamente"
        url="/pago-exitoso"
      />
      <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-6 pt-24">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">

          {procesando ? (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-[#7B9B77] border-t-transparent rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-light text-gray-700 mb-2">Procesando tu pago...</h2>
              <p className="text-[#A9A9A2] text-sm">Por favor esperá un momento.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">✓</div>
              <h2 className="text-2xl font-light text-[#7B9B77] mb-2">¡Pago exitoso!</h2>
              <p className="text-[#888] text-sm leading-relaxed mb-8">
                Tu compra fue procesada correctamente. Ya podés acceder a tu curso desde tu cuenta.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="w-full bg-[#7B9B77] text-white text-xs tracking-widest uppercase py-4 rounded-full hover:bg-[#5a7a56] transition-colors"
                >
                  Ir al inicio
                </Link>
              </div>
            </>
          )}

        </div>
      </main>
    </>
  )
}

export default PagoExitoso