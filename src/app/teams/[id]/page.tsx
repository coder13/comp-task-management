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

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const team = await prisma?.team.findFirst({
    where: { id: Number(id) },
    include: {
      OrgUsers: true,
    },
  });

  return (
    <Container className="mt-12 justify-end space-y-2">
      <div className="">
        <h2 className="text-2xl">{team?.name}</h2>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between py-2 items-baseline">
          <h3 className="text-xl">Org Users</h3>
          <AddOrgUserDialog teamId={Number.parseInt(id)} />
        </div>
        <ul className="space-y-2 grid grid-cols-2">
          {team?.OrgUsers.map((orgUser) => (
            <li key={orgUser.id} className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{orgUser.name}</CardTitle>
                  <CardDescription>{orgUser.email}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button>Import Competitions</Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
