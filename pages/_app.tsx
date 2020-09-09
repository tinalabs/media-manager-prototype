import '../styles/index.css';
import { TinaProvider, TinaCMS } from 'tinacms';
import { GithubClient } from 'react-tinacms-github';

export default function MyApp({ Component, pageProps }) {
  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: pageProps.preview,
      sidebar: true,
      apis: {
        github: new GithubClient({
          proxy: '/api/proxy-github',
          authCallbackRoute: '/api/create-github-access-token',
          clientId: process.env.GITHUB_CLIENT_ID,
          baseRepoFullName: process.env.REPO_FULL_NAME,
          baseBranch: process.env.BASE_BRANCH,
        }),
      },
    });
  }, []);
  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
      <EditLink cms={cms} />
    </TinaProvider>
  );
}

interface EditLinkProps {
  cms: TinaCMS;
}

const EditLink = ({ cms }: EditLinkProps) => {
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
    </button>
  );
};
