import { Schema } from "@effect/schema";
import { Effect, pipe } from "effect";
import { GetStaticProps } from "next";

const PersonSchema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
});

type Person = Schema.Schema.Type<typeof PersonSchema>;

interface HomeProps {
  person: Person;
  message: string;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const person: Person = {
    name: "Test",
    age: 25,
  };

  const result = pipe(
    Effect.succeed(person),
    Effect.map((p) => `Hello, ${p.name}!`)
  );

  const message = Effect.runSync(result);

  return {
    props: {
      person,
      message,
    },
  };
};

export default function Home({ person, message }: HomeProps) {
  return (
    <main>
      <h1>{message}</h1>
      <p>Age: {person.age}</p>
    </main>
  );
}
