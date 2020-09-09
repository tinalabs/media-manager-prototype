import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import Header from '../../../components/header'
import PostHeader from '../../../components/post-header'
import Layout from '../../../components/layout'
import PostTitle from '../../../components/post-title'
import StrapiWrapper from '../../../components/strapi-wrapper'
import Head from 'next/head'
import { fetchGraphql } from 'react-tinacms-strapi'
import { useForm, usePlugin, useCMS } from 'tinacms'
import { InlineForm, InlineText, InlineImage } from 'react-tinacms-inline'
import { InlineWysiwyg } from 'react-tinacms-editor'
import ReactMarkdown from 'react-markdown'

export default function Post({ post: initialPost, preview }) {
  const router = useRouter()
  if (!router.isFallback && !initialPost?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const cms = useCMS()

  const formConfig = {
    id: initialPost.id,
    label: 'Blog Post',
    initialValues: initialPost,
    onSubmit: async (values) => {
      const saveMutation = `
mutation UpdateBlogPost(
  $id: ID!
  $title: String
  $content: String
  $coverImageId: ID
) {
  updateBlogPost(
    input: {
      where: { id: $id }
      data: { title: $title, content: $content, coverImage: $coverImageId}
    }
  ) {
    blogPost {
      id
    }
  }
}`
      const response = await cms.api.strapi.fetchGraphql(saveMutation, {
        id: values.id,
        title: values.title,
        content: values.content,
        //@ts-ignore
        coverImageId: cms.media.store.getFileId(values.coverImage.url),
      })
      if (response.data) {
        cms.alerts.success('Changes saved successfully.')
      } else {
        cms.alerts.error('Error saving changes.')
      }
    },
    fields: [],
  }

  const [post, form] = useForm(formConfig)
  usePlugin(form)

  return (
    <StrapiWrapper>
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
                <InlineForm form={form}>
                  <PostHeader
                    title={<InlineText name="title" />}
                    coverImageComponent={
                      cms.enabled ? (
                        <InlineImage
                          name="coverImage.url"
                          previewSrc={(formValues) =>
                            process.env.STRAPI_URL +
                            //@ts-ignore
                            cms.media.store.getFilePath(
                              formValues.coverImage.url
                            )
                          }
                          uploadDir={() => '/uploads'}
                          parse={(filename) => `/uploads/${filename}`}
                        ></InlineImage>
                      ) : null
                    }
                    coverImage={process.env.STRAPI_URL + post.coverImage.url}
                    date={post.date}
                    author={{
                      name: post.author.name,
                      picture: process.env.STRAPI_URL + post.author.avatar.url,
                    }}
                  />
                  <div className="max-w-2xl mx-auto">
                    <InlineWysiwyg name="content" format="markdown">
                      <ReactMarkdown source={post.content} />
                    </InlineWysiwyg>
                  </div>
                </InlineForm>
              </article>
            </>
          )}
        </Container>
      </Layout>
    </StrapiWrapper>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
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

  if (typeof preview === 'undefined') {
    preview = false
    previewData = {}
  }

  return {
    props: {
      post,
      preview,
      previewData,
      toolbar: true,
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
