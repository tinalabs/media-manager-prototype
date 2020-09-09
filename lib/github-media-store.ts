import { GithubMediaStore as BaseStore } from 'react-tinacms-github';

export class GithubMediaStore extends BaseStore {}

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
