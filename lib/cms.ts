import { TinaCMS } from 'tinacms'
import { MediaRequest } from '../tinamedia/media-manager'

export class MediaCMS extends TinaCMS {
  constructor(options) {
    super(options)

    // @ts-ignore
    this.media.open = (request: MediaRequest) => {
      this.events.dispatch({ type: 'media:open', ...request })
    }
  }
}
