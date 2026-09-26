// Valores del formulario de avisos: vacío (aviso nuevo) y a partir de uno existente
export const AVISO_VACIO = {
  tipo: 'NOVEDAD', titulo: '', descripcion: '', destino: '', enlace: '', imagenUrl: '', hasta: '', activo: true,
}

export const datosDeAviso = (a) => ({
  tipo: a.tipo || 'NOVEDAD', titulo: a.titulo || '', descripcion: a.descripcion || '',
  destino: a.destino || '', enlace: a.enlace || '', imagenUrl: a.imagenUrl || '', hasta: a.hasta || '', activo: a.activo,
})
