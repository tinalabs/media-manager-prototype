import { useCMS, Modal, ModalHeader, ModalBody, ModalFullscreen } from 'tinacms'
import { useEffect, useState } from 'react'
import { MediaList, Media } from '../lib/media'
import styled from 'styled-components'

export interface MediaRequest {
  limit?: number
  directory?: string
  onSelect?(media: Media): void
}
const FilesContainer = styled(ModalBody)`
  max-height: 100%;
  overflow-y: scroll;
`

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
        <FilesContainer padded={true}>
          <MediaManagerThing {...request} close={() => setRequest(undefined)} />
        </FilesContainer>
      </ModalFullscreen>
    </Modal>
  )
}
function MediaManagerThing({
  close,
  onSelect,
  ...props
}: MediaRequest & { close(): void }) {
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
  const numPages = Math.ceil(list.totalCount / list.limit)
  const lastItemIndexOnPage = list.offset + list.limit
  const currentPageIndex = lastItemIndexOnPage / list.limit

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
      <ul style={{ display: 'flex', flexDirection: 'column' }}>
        {list.items.map((item) => (
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              maxWidth: '800px',
              margin: '0.5rem',
              border: '1px solid pink',
            }}
            onClick={() => {
              if (item.type === 'dir') {
                setDirectory(item.path)
                setOffset(0)
              }
            }}
          >
            <img
              src={
                item.previewSrc ||
                'http://fordesigner.com/imguploads/Image/cjbc/zcool/png20080526/1211755375.png'
              }
              style={{ width: '100px', marginRight: '1rem' }}
            />
            <span style={{ flexGrow: '1' }}>
              {item.filename}
              {item.type === 'dir' && '/'}
            </span>
            {onSelect && item.type === 'file' && (
              <div style={{ minWidth: '100px' }}>
                <button
                  style={{
                    border: '1px solid aquamarine',
                    padding: '0.25rem 0.5rem',
                  }}
                  onClick={() => {
                    onSelect(item)
                    close()
                  }}
                >
                  Insert
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
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
