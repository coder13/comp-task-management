'use client';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { useTeamSuspenseQuery } from '@/generated/queries';
import Link from 'next/link';

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { data } = useTeamSuspenseQuery({
    variables: {
      id: Number(id),
    },
  });

  const team = data?.team;

  return (
    <Container className="mt-12 justify-end space-y-2 px-2">
      <div className="flex justify-between">
        <h2 className="text-2xl">{team?.name}</h2>
        <Link href={`/teams/${id}/manage`}>
          <Button variant="outline">Manage Team</Button>
        </Link>
      </div>
    </Container>
  );
}
