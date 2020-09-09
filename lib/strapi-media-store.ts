import { StrapiMediaStore as BaseStrapiMediaStore } from 'react-tinacms-strapi'
import { MediaStore, ListOptions } from './media'
import Cookies from 'js-cookie'
import { STRAPI_JWT } from 'react-tinacms-strapi'

export class StrapiMediaStore
  extends BaseStrapiMediaStore
  implements MediaStore {
  async list(options: ListOptions) {
    const offset = options?.offset ?? 0
    const limit = options?.limit ?? 50

    const authToken = Cookies.get(STRAPI_JWT)
    const response: Response = await fetch(`${this.strapiUrl}/upload/files`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (response.status != 200) {
      throw Error(response.statusText)
    }
    const mediaData = await response.json()
    const nextOffset = offset + limit

    return {
      items: mediaData.slice(offset, limit + offset).map((item) => {
        return {
          filename: item.name,
          directory: '/',
          type: 'file',
          previewSrc: process.env.STRAPI_URL + item.url,
        }
      }),
      limit,
      offset,
      totalCount: mediaData.length,
      nextOffset: nextOffset < mediaData.length ? nextOffset : undefined,
    }
  }
}
