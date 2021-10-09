/* eslint-disable react/no-danger */
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  console.log(post);
  return (
    <>
      <Header />
      <main>
        <img className={styles.Banner} src={post.data.banner.url} alt="" />
        <article className={styles.Post}>
          <header>
            <h1>{post.data.title}</h1>
            <div className={styles.AboutThePost}>
              <div>
                <img src="/calendar.svg" alt="" />
                <time>{post.first_publication_date}</time>
              </div>
              <div>
                <img src="/user.svg" alt="" />
                <span>{post.data.author}</span>
              </div>
              <div>
                <img src="/clock.svg" alt="" />
                <time>A fazer</time>
              </div>
            </div>
          </header>
          <main>
            {post.data.content.map(content => (
              <div key={content.heading} className={styles.PostText}>
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </div>
            ))}
          </main>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query();

  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async context => {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID(
    'posts',
    String(context.params.slug),
    {}
  );

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      `dd MMM yyyy`,
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: { post },
    revalidate: 60 * 60 * 24 * 30,
  };
};
