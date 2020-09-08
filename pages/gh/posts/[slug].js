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

export default function Post({ post, morePosts, preview }) {
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
                <title>{post.title} | TinaCMS Media Manager Prototype</title>
                <meta property='og:image' content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
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
      post,
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
