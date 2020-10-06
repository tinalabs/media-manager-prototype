import {
  mediaHandlerConfig,
  createMediaHandler,
} from '../../../next-tinacms-cloudinary/handlers'

export const config = mediaHandlerConfig

export default createMediaHandler({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
