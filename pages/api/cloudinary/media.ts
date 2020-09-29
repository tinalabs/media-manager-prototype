import { ResourceApiResponse, v2 as cloudinary } from 'cloudinary'
import { Media } from 'tinacms'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default function listMedia(req: NextApiRequest, res: NextApiResponse) {
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

function cloudinaryToTina(file: any): Media {
  const filename = path.basename(file.public_id)
  const directory = path.dirname(file.public_id)

  return {
    id: file.public_id,
    filename,
    directory,
    previewSrc: file.url,
    type: 'file',
  }
}
