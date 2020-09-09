import { useRouter } from 'next/router'

export default function useCMSType() {
  const router = useRouter()
  return router.pathname.split('/')[1]
}
