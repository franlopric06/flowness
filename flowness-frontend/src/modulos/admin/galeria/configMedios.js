import * as api from '../admin.servicio'

export const MB = 1024 * 1024

// Lo que cambia entre fotos y videos; todo lo demás funciona igual
export const CONFIG = {
  foto: {
    singular: 'foto', plural: 'fotos', articulo: 'la', oculta: 'oculta', visible: 'visible',
    crear: api.crearFoto, actualizar: api.actualizarFoto, eliminar: api.eliminarFoto,
    subir: api.subirImagen, acepta: 'image/jpeg,image/png,image/webp', tipoMime: 'image/', maxMB: 10, varios: true,
    ejemploLink: 'https://www.instagram.com/p/...',
    ayudaArchivo: 'Podés elegir varias a la vez. Máximo 10 MB cada una.',
    claseApi: 'fotos',
  },
  video: {
    singular: 'video', plural: 'videos', articulo: 'el', oculta: 'oculto', visible: 'visible',
    crear: api.crearReel, actualizar: api.actualizarReel, eliminar: api.eliminarReel,
    subir: api.subirVideo, acepta: 'video/mp4,video/quicktime,video/webm', tipoMime: 'video/', maxMB: 100, varios: false,
    ejemploLink: 'https://www.instagram.com/reel/...',
    ayudaArchivo: 'Máximo 100 MB. Ideal: videos verticales de menos de 1 minuto.',
    claseApi: 'reels',
  },
}

// "Foto" / "Video" con mayúscula, y la terminación según el género ("subida" / "subido")
export const mayuscula = (texto) => texto[0].toUpperCase() + texto.slice(1)
export const terminacion = (c) => (c.articulo === 'la' ? 'a' : 'o')

// Intercambia el orden de dos elementos y guarda los dos
export const intercambiar = async (lista, i, j, guardar) => {
  const a = lista[i]
  const b = lista[j]
  if (!a || !b) return
  const ordenA = a.orden === b.orden ? a.orden + (j > i ? 1 : -1) : b.orden
  await Promise.all([guardar(a.id, { orden: ordenA }), guardar(b.id, { orden: a.orden })])
}
