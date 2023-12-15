import { Datapoint, QueryResolvers, Team } from '@/generated/graphql';
import { prisma } from '@/prisma';
import { GraphQLContext } from '../types';

export const me: QueryResolvers<GraphQLContext>['me'] = (_, __, { user }) =>
  user;

export const datapoints: QueryResolvers<GraphQLContext>['datapoints'] =
  async () => (await prisma.dataPoint.findMany()) as Datapoint[];

export const team: QueryResolvers<GraphQLContext>['team'] = async (_, { id }) =>
  (await prisma.team.findUnique({
    where: {
      id,
    },
    include: {
      OrgUsers: true,
    },
  })) as Team;
