import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

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
  const [postsPaginationState, setPostsPaginationState] =
    useState(postsPagination);
  const posts = postsPaginationState.results;

  function getNewPosts(nextPage: string): void {
    fetch(nextPage)
      .then(res => res.json())
      .then(res => {
        res.results = [...postsPaginationState.results, ...res.results];
        setPostsPaginationState(res);
      });
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <ul className={styles.listaDePosts}>
          {posts.map(post => (
            <li key={post.uid} className={styles.post}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <time>
                      {format(
                        new Date(post.first_publication_date),
                        `dd MMM yyyy`,
                        {
                          locale: ptBR,
                        }
                      )}
                    </time>
                    <span className={commonStyles.author}>
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            </li>
          ))}
        </ul>
        {postsPaginationState.next_page && (
          <button
            type="button"
            className={`${commonStyles.highlight} ${styles.carregarMais}`}
            onClick={() => {
              getNewPosts(postsPaginationState.next_page);
            }}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    { pageSize: 1 }
  );

  const postsPagination = postsResponse;
  console.log(postsPagination);

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60, // 1 hora
  };
};
