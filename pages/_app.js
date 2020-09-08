import '../styles/index.css'
import { TinaProvider, TinaCMS } from 'tinacms'
import {
  StrapiMediaStore,
  StrapiProvider,
  StrapiClient,
} from 'react-tinacms-strapi'

const cms = new TinaCMS({
  enabled: true,
  sidebar: true,
  apis: {
    strapi: new StrapiClient(process.env.STRAPI_URL),
  },
  media: {
    store: new StrapiMediaStore(process.env.STRAPI_URL),
  },
})

export default function MyApp({ Component, pageProps }) {
  return (
    <TinaProvider cms={cms}>
      <StrapiProvider onLogin={() => {}} onLogout={() => {}}>
        <Component {...pageProps} />
      </StrapiProvider>
    </TinaProvider>
  )
}
