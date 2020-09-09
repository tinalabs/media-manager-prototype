import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import HeroPost from '../../components/hero-post'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import StrapiWrapper from '../../components/strapi-wrapper'
import Head from 'next/head'
import { fetchGraphql } from 'react-tinacms-strapi'

export default function Index({ allPosts, preview }) {
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <StrapiWrapper>
      <Layout preview={preview}>
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
    </StrapiWrapper>
  )
}

export async function getStaticProps({ preview, previewData }) {
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

  if (typeof preview === 'undefined') {
    preview = false
    previewData = {}
  }

  return {
    props: { allPosts: postResults.data.blogPosts, preview, previewData },
  }
}
