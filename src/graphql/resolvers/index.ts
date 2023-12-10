import { Resolvers, UserCompetitionMap } from '@/generated/graphql';
import * as Mutation from './Mutation';
import * as Query from './Query';
import { GraphQLContext } from './types';
import { prisma } from '@/prisma';

const resolvers: Resolvers<GraphQLContext> = {
  Query,
  Mutation,
  User: {
    Competitions: (user, _, __) =>
      prisma.competition
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
        ) as Promise<UserCompetitionMap[]>,
  },
  Competition: {
    // Users: (competition, _, __) =>
    //   prisma.userCompetitionMap.findMany({
    //     where: {
    //       competitionId: competition.id,
    //     },
    //     include: {
    //       User: true,
    //       Competition: true,
    //     },
    //   }) as Promise<UserCompetitionMap[]>,
  },
  UserCompetitionMap: {
    User: (userCompetitionMap, _, __) =>
      prisma.user.findUnique({
        where: {
          id: userCompetitionMap.userId,
        },
      }),
    // Competition: (userCompetitionMap, _, __) =>
    //   prisma.competition.findUnique({
    //     where: {
    //       id: userCompetitionMap.competitionId,
    //     },
    //   }),
  },
};

export default resolvers;
