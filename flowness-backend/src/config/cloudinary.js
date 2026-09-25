import { v2 as cloudinary } from 'cloudinary'
import entorno from './entorno.js'

cloudinary.config({
  cloud_name: entorno.cloudinary.cloudName,
  api_key: entorno.cloudinary.apiKey,
  api_secret: entorno.cloudinary.apiSecret,
})

export default cloudinary
