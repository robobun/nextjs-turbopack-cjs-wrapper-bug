import { Schema } from "@effect/schema";
import { Effect, pipe } from "effect";
import { GetStaticProps } from "next";

const UserSchema = Schema.Struct({
  id: Schema.Number,
  email: Schema.String,
  profile: Schema.Struct({
    firstName: Schema.String,
    lastName: Schema.String,
  }),
});

type User = Schema.Schema.Type<typeof UserSchema>;

interface ProcessedUser extends User {
  fullName: string;
}

interface SSGPageProps {
  users: ProcessedUser[];
}

export const getStaticProps: GetStaticProps<SSGPageProps> = async () => {
  const users: User[] = [
    {
      id: 1,
      email: "user1@example.com",
      profile: { firstName: "John", lastName: "Doe" },
    },
    {
      id: 2,
      email: "user2@example.com",
      profile: { firstName: "Jane", lastName: "Smith" },
    },
  ];

  const processedUsers = users.map((user) => {
    const fullName = pipe(
      Effect.succeed(user),
      Effect.map((u) => `${u.profile.firstName} ${u.profile.lastName}`),
      Effect.runSync
    );
    return { ...user, fullName };
  });

  return {
    props: {
      users: processedUsers,
    },
  };
};

export default function SSGPage({ users }: SSGPageProps) {
  return (
    <main>
      <h1>SSG Page with Effect</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.fullName} - {user.email}
          </li>
        ))}
      </ul>
    </main>
  );
}
