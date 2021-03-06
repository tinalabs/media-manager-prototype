import cn from 'classnames'
import Link from 'next/link'
import useCMSType from './use-cms-type'

export default function CoverImage({ title, src, slug }) {
  const cms = useCMSType()
  const image = (
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
    />
  )
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/${cms}/posts/${slug}`} href={`${cms}/posts/[slug]`}>
          <a aria-label={title}>{image}</a>
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
