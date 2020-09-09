import { TinaCMS } from 'tinacms'

export class MediaCMS extends TinaCMS {
  constructor(options) {
    super(options)

    // @ts-ignore
    this.media.open = () => {
      this.events.dispatch({ type: 'media:open' })
    }
  }
}
