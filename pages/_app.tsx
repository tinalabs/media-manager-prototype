import '../styles/index.css';
import { TinaProvider, TinaCMS } from 'tinacms';
import { GithubClient, TinacmsGithubProvider } from 'react-tinacms-github';

export default function MyApp({ Component, pageProps }) {
  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: pageProps.preview,
      sidebar: pageProps.preview,
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
      <TinacmsGithubProvider
        onLogin={onLogin}
        onLogout={onLogout}
        error={pageProps.error}
      />
      <Component {...pageProps} />
      <EditLink cms={cms} />
    </TinaProvider>
  );
}

const onLogin = async () => {
  const token = localStorage.getItem('tinacms-github-token') || null;
  const headers = new Headers();

  if (token) {
    headers.append('Authorization', 'Bearer ' + token);
  }

  const resp = await fetch(`/api/preview`, { headers: headers });
  const data = await resp.json();

  if (resp.status == 200) window.location.href = window.location.pathname;
  else throw new Error(data.message);
};

const onLogout = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload();
  });
};

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
