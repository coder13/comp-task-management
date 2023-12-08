import { getUser } from './helpers/user';

export default async function Home() {
  const user = await getUser();

  if (user) {
    return <main className="">{user.name}</main>;
  } else {
    return (
      <main className="">
        <a href="/api/auth/sign-in">Sign-in</a>
      </main>
    );
  }
}
