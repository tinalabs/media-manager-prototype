import '../styles/index.css'
import { TinaProvider, TinaCMS } from 'tinacms'
import { StrapiClient } from 'react-tinacms-strapi'

export default function MyApp({ Component, pageProps }) {
  const cms = React.useMemo(() => {
    return new TinaCMS({
      enabled: pageProps.preview,
      sidebar: true,
      toolbar: pageProps.toolbar,
      apis: {
        strapi: new StrapiClient(process.env.STRAPI_URL),
      },
    })
  })
  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
    </TinaProvider>
  )
}
