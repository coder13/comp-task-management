import { Container } from '@/components/Container';
import { getUser } from '../helpers/user';
import { SignInCard } from '@/components/SignInCard';

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return (
      <Container>
        <div className="h-screen flex w-full justify-center items-center">
          <SignInCard />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <p>{user.name}</p>
    </Container>
  );
}
