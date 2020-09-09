import { GithubMediaStore as BaseStore } from 'react-tinacms-github';
import { MediaStore, Media, ListOptions, MediaList } from './media';

export class GithubMediaStore extends BaseStore implements MediaStore {
  async list(options?: ListOptions): Promise<MediaList> {
    const directory = options?.directory ?? '';
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? 50;

    // @ts-ignore
    const items: GithubMedia[] = await this.githubClient.fetchFile(directory);

    return {
      items: items
        .map((item) => ({
          filename: item.name,
          directory: item.path.slice(0, item.path.length - item.name.length),
          type: item.type,
          previewSrc: item.download_url,
        }))
        .slice(offset, offset + limit),
      offset,
      limit,
      nextOffset: nextOffset(offset, limit, items.length),
    };
  }
}

const nextOffset = (offset: number, limit: number, count: number) => {
  if (offset + limit < count) return offset + limit;
};

interface GithubMedia {
  name: string;
  path: string; // directory + name
  size: number;
  type: 'file' | 'dir';
  url: string;
  download_url: string; // For Previewing
  git_url: string;
  html_url: string;
}
