import { GetStaticProps } from 'next';
import Link from 'next/link';

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

export default function Home(): JSX.Element {
  return (
    <>
      <header className={styles.header}>
        <img src="/logo.svg" alt="logo" />
      </header>
      <main className={styles.main}>
        <ul className={styles.listaDePosts}>
          <li className={styles.post}>
            <Link href="/post/slugDoPost">
              <a>
                <h2>Como utilizar Hooks</h2>
                <p>Pensando em sincronização em vez de ciclos de vida</p>
                <div>
                  <time>15 Mar 2021</time>
                  <span className={commonStyles.author}>Joseph Oliveira</span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.post}>
            <Link href="/post/slugDoPost">
              <a>
                <h2>Como utilizar Hooks</h2>
                <p>Pensando em sincronização em vez de ciclos de vida</p>
                <div>
                  <time>15 Mar 2021</time>
                  <span>Joseph Oliveira</span>
                </div>
              </a>
            </Link>
          </li>
          <li className={styles.post}>
            <Link href="/post/slugDoPost">
              <a>
                <h2>Como utilizar Hooks</h2>
                <p>Pensando em sincronização em vez de ciclos de vida</p>
                <div>
                  <time>15 Mar 2021</time>
                  <span>Joseph Oliveira</span>
                </div>
              </a>
            </Link>
          </li>
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

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
