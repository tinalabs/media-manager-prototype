import { v2 as cloudinary } from 'cloudinary'
import { Media, MediaListOptions } from 'tinacms'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function listMedia(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { directory = '""', limit = 500 } = req.query as MediaListOptions

    let query = `folder=${directory}`

    let response = await cloudinary.search
      .expression(query)
      .max_results(limit)
      .execute()

    let files = response.resources.map(cloudinaryToTina)

    //@ts-ignore TODO: Open PR to cloudinary-core
    cloudinary.api.folders = (directory: string = '""') => {
      if (directory === '""') {
        return cloudinary.api.root_folders()
      } else {
        return cloudinary.api.sub_folders(directory)
      }
    }

    // @ts-ignore
    let { folders } = await cloudinary.api.folders(directory)

    folders = folders.map(function (folder: {
      name: string
      path: string
    }): Media {
      'empty-repo/004'
      return {
        id: folder.path,
        type: 'dir',
        filename: path.basename(folder.path),
        directory: path.dirname(folder.path),
      }
    })

    res.json({
      items: [...folders, ...files],
    })
  } catch (e) {
    console.log(e)
    res.status(500)
    res.json({ e })
  }
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
