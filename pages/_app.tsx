import '../styles/index.css'
import { TinaProvider, TinaCMS, useCMS, Media } from 'tinacms'
import { GithubClient } from 'react-tinacms-github'
import { StrapiClient } from 'react-tinacms-strapi'

export default function MyApp({ Component, pageProps }) {
  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: pageProps.preview,
      sidebar: true,
      toolbar: pageProps.toolbar,
      apis: {
        github: new GithubClient({
          proxy: '/api/proxy-github',
          authCallbackRoute: '/api/create-github-access-token',
          clientId: process.env.GITHUB_CLIENT_ID,
          baseRepoFullName: process.env.REPO_FULL_NAME,
          baseBranch: process.env.BASE_BRANCH,
        }),
        strapi: new StrapiClient(process.env.STRAPI_URL),
      },
    })
  }, [])
  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
      <EditLink cms={cms} />
      <OpenMediaButton />
    </TinaProvider>
  )
}

interface EditLinkProps {
  cms: TinaCMS
}

const EditLink = ({ cms }: EditLinkProps) => {
  return (
    <button onClick={() => cms.toggle()}>
      {cms.enabled ? 'Exit Edit Mode' : 'Edit This Site'}
    </button>
  )
}

const OpenMediaButton = () => {
  const cms = useCMS()

  return (
    <button
      onClick={() => {
        console.log('open media')
        // @ts-ignore
        cms.events.dispatch({
          type: 'media:open',
          directory: 'public/assets',
          onSelect(media: Media) {
            alert('Selected: ' + media.filename)
          },
        })
      }}
    >
      Open Media Manager
    </button>
  )
}
