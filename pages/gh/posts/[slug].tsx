import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Container from '../../../components/container';
import PostBody from '../../../components/post-body';
import Header from '../../../components/header';
import PostHeader from '../../../components/post-header';
import Layout from '../../../components/layout';
import { getPostBySlug, getAllPosts } from '../../../lib/api';
import PostTitle from '../../../components/post-title';
import Head from 'next/head';
import { useEffect } from 'react';
import { useCMS } from 'tinacms';
import { GithubMediaStore } from 'react-tinacms-github';
import { getGithubPreviewProps, parseMarkdown } from 'next-tinacms-github';

export default function Post({ file, error, preview }) {
  const post = file?.data;
  const cms = useCMS();

  useEffect(() => {
    cms.media.store = new GithubMediaStore(cms.api.github);
  }, []);

  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header cms='GitHub' />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className='mb-32'>
              <Head>
                <title>
                  {post.frontmatter.title} | TinaCMS Media Manager Prototype
                </title>
                <meta
                  property='og:image'
                  content={post.frontmatter.ogImage.url}
                />
              </Head>
              <PostHeader
                title={post.frontmatter.title}
                coverImage={post.frontmatter.coverImage}
                date={post.frontmatter.date}
                author={post.frontmatter.author}
              />
              <PostBody content={post.markdownBody} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params, preview, previewData }) {
  if (preview) {
    const props = await getGithubPreviewProps({
      ...previewData,
      fileRelativePath: `_posts/${params.slug}.md`,
      parse: parseMarkdown,
    });

    props.props.file.data.slug = params.slug;

    return props;
  }

  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage',
  ]);

  return {
    props: {
      file: {
        fileRelativePath: `_posts/${params.slug}.md`,
        data: post,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
