import { getUser } from '@/helpers/user';
import { getUpcomingManageableCompetitions } from '@/wcaApi';

export async function GET() {
  const user = await getUser();

  if (!user) {
    return {
      status: 401,
      body: {
        error: 'Unauthorized',
      },
    };
  }

  const competitions = await getUpcomingManageableCompetitions(
    user.accessToken,
  );

  const compIds = competitions.map(({ id }) => id);

  const importedCompetitions =
    (await prisma?.competitionMetadata.findMany({
      where: {
        wcaId: {
          in: compIds,
        },
      },
    })) || [];

  const importedCompetitionIds = importedCompetitions.map(({ wcaId }) => wcaId);

  const importableCompetitions = competitions.filter(
    ({ id }) => !importedCompetitionIds.includes(id),
  );

  return Response.json({ competitions: importableCompetitions });
}
