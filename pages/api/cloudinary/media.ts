import { ResourceApiResponse, v2 as cloudinary } from 'cloudinary'
import { Media } from 'tinacms'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default function listMedia(req, res) {
  cloudinary.api.resources(
    {
      max_results: 1000,
      prefix: '',
    },
    (err, { resources }: ResourceApiResponse) => {
      res.json({
        items: resources.map(cloudinaryToTina),
      })
    }
  )
}

function cloudinaryToTina(cloudinary: any): Media {
  return {
    id: cloudinary.public_id,
    filename: '',
    directory: '',
    previewSrc: cloudinary.url,
    type: 'file',
  }
}

interface CloudinaryResource {
  asset
}
