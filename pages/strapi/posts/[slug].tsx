import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import Header from '../../../components/header'
import PostHeader from '../../../components/post-header'
import Layout from '../../../components/layout'
import PostTitle from '../../../components/post-title'
import Head from 'next/head'
import markdownToHtml from '../../../lib/markdownToHtml'
import { fetchGraphql } from 'react-tinacms-strapi'

export default function Post({ post, morePosts, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header cms="Strapi" />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>{post.title} | Tina + Strapi</title>
                <meta
                  property="og:image"
                  content={process.env.STRAPI_URL + post.coverImage.url}
                />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={process.env.STRAPI_URL + post.coverImage.url}
                date={post.date}
                author={{
                  name: post.author.name,
                  picture: process.env.STRAPI_URL + post.author.avatar.url,
                }}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query {
      blogPosts(where: {slug: "${params.slug}"}){
        id
        title
        date
        slug
        content
        author {
          name
          avatar {
            url
          }
        }
        coverImage {
          url
        }
      }
    }`
  )
  const post = postResults.data.blogPosts[0]
  return {
    props: {
      post,
    },
  }
}

export async function getStaticPaths() {
  const postResults = await fetchGraphql(
    process.env.STRAPI_URL,
    `
    query{
      blogPosts{
        slug
      }
    }
  `
  )

  return {
    paths: postResults.data.blogPosts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
