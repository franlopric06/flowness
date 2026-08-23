export const useVibrar = (duracion = 30) => {
  return () => {
    if (navigator.vibrate) {
      navigator.vibrate(duracion)
    }
  }
}
