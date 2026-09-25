import VideoMuestra from './VideoMuestra'
import { imagenReducida } from '../utilidades/medios'

// Parte de arriba de una tarjeta (clase, nivel): muestra el video corto si hay,
// si no la imagen, y si no hay nada, un fondo con los colores de la marca.
function MediaTarjeta({ muestraUrl, imagenUrl, alt = '', ancho = 700, children }) {
  return (
    <>
      {muestraUrl ? (
        <VideoMuestra src={muestraUrl} portada={imagenUrl ? imagenReducida(imagenUrl, ancho) : undefined} ancho={ancho} />
      ) : imagenUrl ? (
        <img src={imagenReducida(imagenUrl, ancho)} alt={alt} loading="lazy" className="zoom absolute inset-0 h-full w-full object-cover" />
      ) : (
        children || (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/logo.png" alt="" className="zoom h-16 w-16 opacity-40" />
          </div>
        )
      )}
    </>
  )
}

export default MediaTarjeta
