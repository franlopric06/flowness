import multer from 'multer'

const almacenamiento = multer.memoryStorage()

export const subirArchivo = multer({
  storage: almacenamiento,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Fotos, videos (los celulares graban en mp4 o mov) y PDFs
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm', 'application/pdf']
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'))
    }
  },
})
