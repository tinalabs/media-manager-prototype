import { useCMS, Modal, ModalHeader, ModalBody, ModalFullscreen } from 'tinacms'
import { useEffect, useState } from 'react'
import { MediaList, Media } from '../lib/media'

export interface MediaRequest {
  limit?: number
  directory?: string
  onSelect?(media: Media): void
}

export function MediaManager() {
  const cms = useCMS()

  const [request, setRequest] = useState<MediaRequest | undefined>()

  useEffect(() => {
    return cms.events.subscribe('media:open', ({ type, ...request }) => {
      setRequest(request)
    })
  }, [])

  if (!request) return null

  return (
    <Modal>
      <ModalFullscreen>
        <ModalHeader close={() => setRequest(undefined)}>
          I'm the Juggernaught, Fish
        </ModalHeader>
        <ModalBody padded={true}>
          <MediaManagerThing {...request} />
        </ModalBody>
      </ModalFullscreen>
    </Modal>
  )
}
function MediaManagerThing({ onSelect, ...props }: MediaRequest) {
  const [directory, setDirectory] = useState<string | undefined>(
    props.directory
  )
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(props.limit)
  const [list, setList] = useState<MediaList>()
  const cms = useCMS()

  useEffect(() => {
    // @ts-ignore
    cms.media.store.list({ offset, limit, directory }).then(setList)
  }, [offset, limit, directory])

  if (!list) return <div>Loading...</div>
  const numPages = Math.ceil(list.totalCount / limit)
  const lastItemIndexOnPage = offset + limit
  const currentPageIndex = lastItemIndexOnPage / limit

  let pageLinks = []

  for (let i = 0; i < numPages; i++) {
    const active = i + 1 === currentPageIndex
    pageLinks.push(
      <button
        style={{
          padding: '0.5rem',
          margin: '0 0.5rem',
          background: active ? 'black' : '',
          color: active ? 'white' : '',
        }}
        onClick={() => setOffset(i * limit)}
      >
        {i + 1}
      </button>
    )
  }

  return (
    <div>
      <h3>Breadcrumbs</h3>
      <button onClick={() => setDirectory('')}>ROOT</button>/
      {directory &&
        directory.split('/').map((part, index, parts) => (
          <button
            onClick={() => {
              setDirectory(parts.slice(0, index + 1).join('/'))
            }}
          >
            {part}/
          </button>
        ))}
      <h3>Items</h3>
      {list.items.map((item) => (
        <li
          onClick={() => {
            if (item.type === 'dir') {
              setDirectory(item.directory + item.filename)
              setOffset(0)
            }
          }}
        >
          {item.filename}
          {item.type === 'dir' && '/'}
          {onSelect && item.type === 'file' && (
            <button
              style={{ marginLeft: '5rem' }}
              onClick={() => {
                onSelect(item)
              }}
            >
              Insert
            </button>
          )}
        </li>
      ))}
      {pageLinks}
      <h4>Page Size</h4>
      {[5, 10, 50, 100].map((size) => {
        let active = limit === size
        return (
          <button
            style={{
              padding: '0.5rem',
              margin: '0 0.5rem',
              background: active ? 'black' : '',
              color: active ? 'white' : '',
            }}
            onClick={() => setLimit(size)}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
