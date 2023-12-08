import { getUser } from './helpers/user';

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <main className="">
        <a href="/api/auth/sign-in">Sign-in</a>
      </main>
    );
  }

  return (
    <div>
      <p>{user.name}</p>
    </div>
  );
}
