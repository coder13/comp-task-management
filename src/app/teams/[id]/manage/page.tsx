'use client';

import { AddOrgUserDialog } from '@/components/AddOrgUserDialog';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTeamSuspenseQuery } from '@/generated/queries';
import { ImportableCompetitionsList } from './importable-competitions-list';
import { RevalidateCredentialsOrgUserDialog } from '@/components/RevalidateCredentialsOrgUserDialog/RevalidateCredentialsOrgUserDialog';

export default function Page({ params: { id } }: { params: { id: string } }) {
  const teamId = Number(id);

  const { data } = useTeamSuspenseQuery({
    variables: {
      id: teamId,
    },
  });

  const team = data?.team;

  return (
    <Container className="mt-12 justify-end space-y-2 px-2">
      <div className="flex w-full items-baseline space-x-2">
        <h2 className="text-2xl">{team?.name}</h2>
        <span>{' > manage'}</span>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between py-2 items-baseline">
          <h3 className="text-lg font-bold">Org Users</h3>
          <AddOrgUserDialog teamId={teamId} />
        </div>
        <ul className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {team?.OrgUsers?.map((orgUser) => (
            <li key={orgUser.id} className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{orgUser.name}</CardTitle>
                  <CardDescription>{orgUser.email}</CardDescription>
                </CardHeader>
                <CardFooter>
                  {orgUser.missingCredentials && (
                    <RevalidateCredentialsOrgUserDialog teamId={teamId} />
                  )}
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between py-2 items-baseline">
          <h3 className="text-lg font-bold">Imported Competitions</h3>
        </div>
        <ul className="grid-cols-1 gap-4">
          {team?.Competitions?.map((competition) => {
            const id = competition.Metadata?.wcaId || competition.id.toString();
            return <li key={id}>{competition.name}</li>;
          })}
        </ul>
      </div>
      <ImportableCompetitionsList teamId={teamId} />
    </Container>
  );
}

export const dynamic = 'force-dynamic';
