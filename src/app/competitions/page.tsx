import { UserCompetitionCard } from '@/components/UserCompetitionCard';
import { getUser } from '@/helpers/user';
import { prisma } from '@/prisma';

const getCompetitionsForUser = async (userId: number) =>
  await prisma.competition
    .findMany({
      where: {
        Users: {
          some: {
            userId,
          },
        },
      },
      include: {
        MetaData: true,
        Users: {
          select: {
            role: true,
            userId: true,
          },
          where: {
            userId,
          },
        },
      },
    })
    .then((competitions) =>
      competitions.map((competition) => ({
        ...competition,
        roles: competition.Users.map(({ role }) => role),
      })),
    );

export default async function Competitions() {
  const user = await getUser();
  const competitions = await getCompetitionsForUser(user!.id);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="p-2 w-4/5">
        <h2 className="text-2xl">Competitions</h2>
        <ul className="divide-y-2">
          {competitions.map((competition) => (
            <UserCompetitionCard key={competition.id} {...competition} />
          ))}
        </ul>
      </div>
    </div>
  );
}
