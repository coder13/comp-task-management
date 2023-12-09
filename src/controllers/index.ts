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

export const getUserSidebarData = async (userId: number) => {
  const competitions = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      Competitions: {
        distinct: ['competitionId'],
        orderBy: {
          Competition: {
            updatedAt: 'desc',
          },
        },
        include: {
          Competition: {
            include: {
              MetaData: true,
            },
          },
        },
      },
    },
  });

  console.log(52, competitions);

  return competitions;
};
