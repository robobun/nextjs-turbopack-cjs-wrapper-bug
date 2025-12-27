import { Schema } from "@effect/schema";
import { Effect, pipe } from "effect";
import { GetStaticPaths, GetStaticProps } from "next";

const ArticleSchema = Schema.Struct({
  id: Schema.String,
  publisher: Schema.String,
  title: Schema.String,
  content: Schema.String,
});

type Article = Schema.Schema.Type<typeof ArticleSchema>;

interface ArticlePageProps {
  article: Article;
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { publisher: "tech-news", id: "1" } },
      { params: { publisher: "tech-news", id: "2" } },
      { params: { publisher: "sports", id: "1" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({
  params,
}) => {
  const publisher = params?.publisher as string;
  const id = params?.id as string;

  const article: Article = {
    id,
    publisher,
    title: `Article ${id} from ${publisher}`,
    content: `This is the content of article ${id} from ${publisher}.`,
  };

  const processed = pipe(
    Effect.succeed(article),
    Effect.map((a) => ({
      ...a,
      title: a.title.toUpperCase(),
    })),
    Effect.runSync
  );

  return {
    props: {
      article: processed,
    },
  };
};

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <article>
      <h1>{article.title}</h1>
      <p>Publisher: {article.publisher}</p>
      <div>{article.content}</div>
    </article>
  );
}
