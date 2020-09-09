import useCMSType from './use-cms-type'

export default function Intro() {
  const cms = useCMSType()
  const displayname = (
    <span style={{ textTransform: 'capitalize' }}>
      {cms === 'gh' ? 'GitHub' : cms}
    </span>
  )
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        {displayname} Blog.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        A statically generated blog example using{' '}
        <a
          href="https://nextjs.org/"
          className="underline hover:text-success duration-200 transition-colors"
        >
          Next.js
        </a>
        {''}, TinaCMS, and {displayname}.
      </h4>
    </section>
  )
}
