import { Container } from '@/components/Container';

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const team = await prisma?.team.findFirst({
    where: { id: Number(id) },
  });

  return (
    <Container className="mt-12 justify-end">
      <h2 className="text-2xl">{team?.name}</h2>
    </Container>
  );
}
