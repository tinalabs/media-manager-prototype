import {
  Media as BaseMedia,
  MediaStore as BaseMediaStore,
} from '@tinacms/media'

export interface Media extends BaseMedia {
  type: 'file' | 'dir'
  id: string
  path: string
  previewSrc?: string
}

export interface MediaStore extends BaseMediaStore {
  list(options?: ListOptions): Promise<MediaList>
}

export interface ListOptions {
  directory?: string
  limit?: number
  offset?: number
}

export interface MediaList {
  items: Media[]
  limit?: number
  offset?: number
  nextOffset?: number
  totalCount: number
}
