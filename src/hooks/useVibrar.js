const useVibrar = () => {
  const vibrar = (duracion = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(duracion)
    }
  }
  return vibrar
}

export default useVibrar