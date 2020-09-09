import {
  useCMS,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFullscreen,
} from 'tinacms';
import { useEffect, useState } from 'react';
import { MediaList } from '../lib/media';

export interface MediaRequest {}

export function MediaManager() {
  const cms = useCMS();

  const [request, setRequest] = useState<any>();

  useEffect(() => {
    return cms.events.subscribe('media:open', ({ type, ...request }) => {
      setRequest(request);
    });
  }, []);

  // if (!request) return null;

  return (
    <Modal>
      <ModalFullscreen>
        <ModalHeader>I'm the Juggernaught, Fish</ModalHeader>
        <ModalBody padded={true}>
          <MediaManagerThing />
        </ModalBody>
      </ModalFullscreen>
    </Modal>
  );
}

function MediaManagerThing() {
  const [directory, setDirectory] = useState<string | undefined>();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(4);
  const [list, setList] = useState<MediaList>({ items: [] });
  const cms = useCMS();

  useEffect(() => {
    // @ts-ignore
    cms.media.store.list({ offset, limit, directory }).then(setList);
  }, [offset, limit, directory]);

  return (
    <div>
      <h3>Breadcrumbs</h3>
      <button onClick={() => setDirectory('')}>ROOT</button>/
      {directory &&
        directory.split('/').map((part, index, parts) => (
          <button
            onClick={() => {
              setDirectory(parts.slice(0, index + 1).join('/'));
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
              setDirectory(item.directory + item.filename);
              setOffset(0);
            }
          }}
        >
          {item.filename}
          {item.type === 'dir' && '/'}
        </li>
      ))}
      <h3>Pagination</h3>
      {offset > 0 && (
        <button onClick={() => setOffset(list.nextOffset)}>Previous</button>
      )}{' '}
      –{' '}
      {list.nextOffset && (
        <button onClick={() => setOffset(list.nextOffset)}>Next </button>
      )}
    </div>
  );
}
