import Link from 'next/link'
import useCMSType from './use-cms-type'

export default function Header() {
  const cms = useCMSType()
  const displayname = (
    <span style={{ textTransform: 'capitalize' }}>
      {cms === 'gh' ? 'GitHub' : cms}
    </span>
  )
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
      <Link href="/">
        <a className="hover:underline">TinaCMS {displayname} Blog</a>
      </Link>
      .
    </h2>
  )
}
