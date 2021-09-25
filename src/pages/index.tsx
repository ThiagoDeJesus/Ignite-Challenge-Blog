import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const posts = postsPagination.results;

  return (
    <>
      <header className={styles.header}>
        <img src="/logo.svg" alt="logo" />
      </header>
      <main className={styles.main}>
        <ul className={styles.listaDePosts}>
          {posts.map(post => (
            <li className={styles.post}>
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <time>{post.first_publication_date}</time>
                    <span className={commonStyles.author}>
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`${commonStyles.highlight} ${styles.carregarMais}`}
        >
          Carregar mais posts
        </button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts')
  );

  const postsPagination = postsResponse;
  postsPagination.results = postsPagination.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        `dd MMM yyyy`,
        {
          locale: ptBR,
        }
      ),
    };
  });

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
