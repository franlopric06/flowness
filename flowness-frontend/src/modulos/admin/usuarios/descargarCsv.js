import { fechaHora, productoDeCompra, ESTADO_PAGO } from './formato'

// Arma un archivo CSV (se abre con Excel o Google Sheets) con las compras y lo descarga
const celda = (valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`

export function descargarComprasCsv(compras, nombreArchivo = 'compras-flowness.csv') {
  const encabezado = ['N° compra', 'Fecha', 'Nombre', 'Email', 'Producto', 'Monto', 'Estado', 'N° pago Mercado Pago']
  const filas = compras.map((c) => [
    c.id, fechaHora(c.creadoEn), c.usuario?.nombre, c.usuario?.email, productoDeCompra(c),
    c.monto, ESTADO_PAGO[c.estado]?.texto || c.estado, c.mpPagoId,
  ])
  // ";" como separador y BOM para que Excel en español lo abra bien con tildes
  const texto = '﻿' + [encabezado, ...filas].map((f) => f.map(celda).join(';')).join('\r\n')
  const enlace = document.createElement('a')
  enlace.href = URL.createObjectURL(new Blob([texto], { type: 'text/csv;charset=utf-8' }))
  enlace.download = nombreArchivo
  enlace.click()
  setTimeout(() => URL.revokeObjectURL(enlace.href), 1000)
}
