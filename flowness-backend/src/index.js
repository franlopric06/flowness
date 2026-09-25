import app from './app.js'
import entorno from './config/entorno.js'

app.listen(entorno.puerto, () => {
  console.log(`Servidor corriendo en puerto ${entorno.puerto}`)
})
