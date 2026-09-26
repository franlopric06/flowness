// Fecha de hoy en la hora de la persona, como 'AAAA-MM-DD'
export const hoy = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Algo con "hasta" (último día que se muestra) ya pasó su fecha
export const estaVencida = ({ hasta }) => Boolean(hasta) && hasta < hoy()
