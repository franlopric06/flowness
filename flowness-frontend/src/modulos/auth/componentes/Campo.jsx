// Campo con ícono a la izquierda (email, nombre, contraseña)
function Campo({ icono: Icono, children }) {
  return (
    <label className="relative block">
      <Icono size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-piedra pointer-events-none" />
      {children}
    </label>
  )
}

export default Campo
