import { Competition, TeamResolvers } from '@/generated/graphql';
import { GraphQLContext } from '../types';

export const Competitions: TeamResolvers<GraphQLContext>['Competitions'] = (
  parent,
  _,
  __,
) =>
  prisma?.competition.findMany({
    where: {
      Teams: {
        some: {
          id: parent.id,
        },
      },
    },
    include: {
      Metadata: true,
      Teams: {
        where: {
          id: parent.id,
        },
      },
    },
  }) as Promise<Competition[]>;
