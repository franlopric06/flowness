// Valores del formulario de clases: vacío (clase nueva) y a partir de una clase existente
export const CLASE_VACIA = {
  nombre: '', descripcion: '', videoUrl: '', miniaturaUrl: '', muestraUrl: '',
  duracion: '', precio: '', esGratis: false, orden: '', activo: true,
}

export const datosDeClase = (c) => ({
  nombre: c.nombre || '', descripcion: c.descripcion || '', videoUrl: c.videoUrl || '',
  miniaturaUrl: c.miniaturaUrl || '', muestraUrl: c.muestraUrl || '', duracion: c.duracion || '',
  precio: c.precio || '', esGratis: c.esGratis, orden: c.orden ?? '', activo: c.activo,
})
