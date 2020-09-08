import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import HeroPost from '../../components/hero-post'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import Head from 'next/head'
import { fetchGraphql } from 'react-tinacms-strapi'

export default function Index({ allPosts }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <Layout preview={false}>
        <Head>
          <title>Next.js Blog Example with Strapi</title>
        </Head>
        <Container>
          <Intro />
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={process.env.STRAPI_URL + heroPost.coverImage.url}
              date={heroPost.date}
              author={{
                name: heroPost.author.name,
                picture: process.env.STRAPI_URL + heroPost.author.avatar.url,
              }}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && (
            <MoreStories
              posts={morePosts.map((post) => {
                return {
                  ...post,
                  coverImage: process.env.STRAPI_URL + post.coverImage.url,
                }
              })}
            />
          )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query {
      blogPosts {
        title
        date
        slug
        author {
          name
          avatar {
            url
          }
        }
        excerpt
        coverImage {
          url
        }
      }
    }`
  )
  return {
    props: { allPosts: postResults.data.blogPosts },
  }
}
