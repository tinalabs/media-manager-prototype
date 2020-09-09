import Avatar from './avatar'
import DateFormater from './date-formater'
import CoverImage from './cover-image'
import PostTitle from './post-title'

interface PostHeaderProps {
  title: string | JSX.Element
  coverImage?: string
  coverImageComponent?: JSX.Element
  date: string
  author: { name: string; picture: string }
}

export default function PostHeader({
  title,
  coverImage,
  coverImageComponent,
  date,
  author,
}: PostHeaderProps) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        {coverImageComponent ? (
          coverImageComponent
        ) : (
          <CoverImage title={title} src={coverImage} />
        )}
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormater dateString={date} />
        </div>
      </div>
    </>
  )
}
