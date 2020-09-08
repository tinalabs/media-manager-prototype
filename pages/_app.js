import '../styles/index.css'
import { TinaProvider, TinaCMS } from 'tinacms'

const cms = new TinaCMS({ enabled: true, sidebar: true })

export default function MyApp({ Component, pageProps }) {
  return (
    <TinaProvider cms={cms}>
      <Component {...pageProps} />
    </TinaProvider>
  )
}
