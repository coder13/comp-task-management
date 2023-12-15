import { UserResolvers } from '@/generated/graphql';
import { GraphQLContext } from '../types';

export * from './ImportedCompetitions';
export * from './ImportableCompetitions';

export const missingCredentials: UserResolvers<GraphQLContext>['missingCredentials'] =
  async (parent) => {
    const creds = await prisma?.credentials.findUnique({
      where: {
        userId: parent.id,
      },
    });

    return !creds;
  };
