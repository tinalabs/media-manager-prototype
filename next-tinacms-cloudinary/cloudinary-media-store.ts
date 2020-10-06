import { Cloudinary } from 'cloudinary-core'
import {
  Media,
  MediaList,
  MediaListOptions,
  MediaStore,
  MediaUploadOptions,
} from 'tinacms'

export class CloudinaryMediaStore implements MediaStore {
  accept = '*'
  private api: Cloudinary

  constructor(public cloud_name: string) {
    this.api = new Cloudinary({
      cloud_name: this.cloud_name,
      secure: true,
    })
  }

  async persist(media: MediaUploadOptions[]) {
    const { file, directory } = media[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('directory', directory)
    formData.append('filename', file.name)

    const res = await fetch(`/api/cloudinary/media`, {
      method: 'POST',
      body: formData,
    })

    if (res.status != 200) {
      const responseData = await res.json()
      throw new Error(responseData.message)
    }

    // TODO be programmer
    await new Promise((resolve) => {
      setTimeout(resolve, 2000)
    })
    return []
  }
  async delete(media: Media) {
    await fetch(`/api/cloudinary/media/${encodeURIComponent(media.id)}`, {
      method: 'DELETE',
    })
  }
  async list(options: MediaListOptions): Promise<MediaList> {
    let query = '?'

    if (options.directory) {
      query += `directory=${encodeURIComponent(options.directory)}`
    }

    const response = await fetch('/api/cloudinary/media' + query)

    const { items } = await response.json()
    return {
      items: items.map((item) => {
        let previewSrc: string

        if (item.type === 'file') {
          previewSrc = this.api.url(item.id, {
            width: 56,
            height: 56,
            crop: 'fill',
            gravity: 'auto',
          })
        }

        return {
          ...item,
          previewSrc,
        }
      }),
      totalCount: items.length,
      limit: 500,
      offset: 0,
      nextOffset: undefined,
    }
  }
  previewSrc(publicId: string) {
    return this.api.url(publicId)
  }
}
