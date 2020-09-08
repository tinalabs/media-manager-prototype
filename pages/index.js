import Container from '../components/container';
import Intro from '../components/intro';
import Layout from '../components/layout';
import { getAllPosts } from '../lib/api';
import Head from 'next/head';
import { CMS_NAME } from '../lib/constants';
import Link from 'next/link';

export default function Index({ allPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>TinaCMS Media Manager Prototype</title>
        </Head>
        <Container>
          <section className='flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12'>
            <h1 className='text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8'>
              TinaLabs
            </h1>
            <h4 className='text-center md:text-left text-lg mt-5 md:pl-8'>
              A site used to prototype the TinaCMS Media Manager.
            </h4>
          </section>
          <ul>
            <li>
              <Link href='/gh'>
                <a>GitHub </a>
              </Link>
            </li>
            <li>
              <Link href='/strapi'>
                <a>Strapi </a>
              </Link>
            </li>
            <li>
              <Link href='/contentful'>
                <a>Contentful </a>
              </Link>
            </li>
            <li>
              <Link href='/git'>
                <a>Git </a>
              </Link>
            </li>
          </ul>
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]);

  return {
    props: { allPosts },
  };
}
