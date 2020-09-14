import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../../components/container'
import PostBody from '../../../components/post-body'
import Header from '../../../components/header'
import PostHeader from '../../../components/post-header'
import Layout from '../../../components/layout'
import { getPostBySlug, getAllPosts } from '../../../lib/api'
import PostTitle from '../../../components/post-title'
import Head from 'next/head'
import { useEffect } from 'react'
import { useCMS, usePlugin } from 'tinacms'
import {
  useGithubMarkdownForm,
  TinacmsGithubProvider,
  GithubMediaStore,
} from 'react-tinacms-github'
import { InlineForm, InlineImage } from 'react-tinacms-inline'
import { getGithubPreviewProps, parseMarkdown } from 'next-tinacms-github'
import path from 'path'

export default function Post({ slug, file, error, preview }) {
  const cms = useCMS()

  const [post, form] = useGithubMarkdownForm(file, {
    label: 'Post',
    fields: [
      { name: 'frontmatter.title', component: 'text', label: 'Title' },
      { name: 'frontmatter.date', component: 'text', label: 'Date' },
      {
        name: 'frontmatter.author',
        component: 'group',
        label: 'Author',
        fields: [
          { name: 'name', component: 'text', label: 'Name' },
          {
            name: 'picture',
            component: 'image',
            label: 'Profile Picture',
            previewSrc(values, { input }) {
              const src = `public` + input.value
              return cms.media.store.previewSrc(src)
            },
          },
        ],
      },

      {
        name: 'frontmatter.coverImage',
        component: 'image',
        label: 'Cover Image',
        parse: (media) => {
          if (!media) return ''
          return media.id.replace('public', '')
        },
        //@ts-ignore
        uploadDir: () => `public/assets/`,
        //@ts-ignore
        previewSrc(values, { input }) {
          const src = path.join(`public`, input.value)
          return cms.media.store.previewSrc(src)
        },
      },
      { name: 'markdownBody', component: 'textarea', label: 'Body' },
    ],
  })
  console.log(post)
  usePlugin(form)

  useEffect(() => {
    cms.media.store = new GithubMediaStore(cms.api.github)
    // @ts-ignore
    window.github = cms.media.store
  }, [])

  const router = useRouter()

  if (!router.isFallback && !file?.fileRelativePath) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout preview={preview}>
      <TinacmsGithubProvider
        onLogin={onLogin}
        onLogout={onLogout}
        error={error}
      />
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <InlineForm form={form}>
            <article className="mb-32">
              <Head>
                <title>{post.frontmatter.title} | TinaCMS + GitHub</title>
                <meta
                  property="og:image"
                  content={post.frontmatter.ogImage.url}
                />
              </Head>
              <PostHeader
                title={post.frontmatter.title}
                coverImage={post.frontmatter.coverImage}
                coverImageComponent={
                  cms.enabled ? (
                    <InlineImage
                      name="frontmatter.coverImage"
                      uploadDir={() => `public/assets/`}
                      parse={(media) => `public/assets/${media.id}`}
                    />
                  ) : null
                }
                date={post.frontmatter.date}
                author={post.frontmatter.author}
              />
              <PostBody content={post.markdownBody} />
            </article>
          </InlineForm>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params, preview, previewData }) {
  if (preview) {
    const staticProps = await getGithubPreviewProps({
      ...previewData,
      fileRelativePath: `_posts/${params.slug}.md`,
      parse: parseMarkdown,
    })
    // @ts-ignore
    staticProps.props.slug = params.slug
    return staticProps
  }

  const { content: markdownBody, ...frontmatter } = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ])

  return {
    props: {
      slug: params.slug,
      file: {
        fileRelativePath: `_posts/${params.slug}.md`,
        data: {
          frontmatter,
          markdownBody,
        },
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}

const onLogin = async () => {
  const token = localStorage.getItem('tinacms-github-token') || null
  const headers = new Headers()

  if (token) {
    headers.append('Authorization', 'Bearer ' + token)
  }

  const resp = await fetch(`/api/preview`, { headers: headers })
  const data = await resp.json()

  if (resp.status == 200) window.location.href = window.location.pathname
  else throw new Error(data.message)
}

const onLogout = () => {
  return fetch(`/api/reset-preview`).then(() => {
    window.location.reload()
  })
}
