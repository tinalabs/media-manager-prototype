import { useLayoutEffect } from 'react'
import { useCMS } from 'tinacms'
import { StrapiProvider } from 'react-tinacms-strapi'
import { StrapiMediaStore } from '../lib/strapi-media-store'

const btnClasses =
  'mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0'

const enterEditMode = () => {
  return fetch(`/api/strapi/preview`).then(() => {
    window.location.href = window.location.pathname
  })
}

const exitEditMode = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload()
  })
}

const EditButton = () => {
  const cms = useCMS()
  return (
    <button className={btnClasses} onClick={cms.toggle}>
      {cms.enabled ? `Stop Editing ` : `Edit this Site `}
    </button>
  )
}

const StrapiWrapper = ({ children }) => {
  const cms = useCMS()
  useLayoutEffect(() => {
    cms.media.store = new StrapiMediaStore(process.env.STRAPI_URL)
    return () => {
      // remove the API when unmounted?
      cms.media.store = null
    }
  }, [])
  return (
    <StrapiProvider onLogin={enterEditMode} onLogout={exitEditMode}>
      <EditButton />
      {children}
      <EditButton />
    </StrapiProvider>
  )
}

export default StrapiWrapper
