// Siluetas mientras se carga la página de un curso
function CargandoCurso() {
  return (
    <main className="contenedor pt-28 md:pt-32 min-h-screen" role="status" aria-label="Cargando">
      <div className="esqueleto h-3 w-24 mb-6" />
      <div className="esqueleto h-10 w-2/3 mb-8" />
      <div className="grid lg:grid-cols-[1fr_340px] gap-8">
        <div className="esqueleto aspect-video rounded-2xl" />
        <div className="esqueleto h-72 rounded-2xl" />
      </div>
    </main>
  )
}

export default CargandoCurso
