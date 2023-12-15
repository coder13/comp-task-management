import { UserCompetitionMap, UserResolvers } from '@/generated/graphql';
import { GraphQLContext } from '../types';

export const Competitions: UserResolvers<GraphQLContext>['Competitions'] = (
  user,
  _,
  __,
) =>
  prisma?.competition
    .findMany({
      where: {
        Users: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        Users: {
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        },
        Metadata: true,
      },
    })
    .then((competitions) =>
      competitions.map(({ Users, ...competition }) => ({
        competitionId: competition.id,
        userId: user.id,
        Competition: {
          ...competition,
        },
        roles: Users.map(({ role }) => role),
      })),
    ) as Promise<UserCompetitionMap[]>;
