import { Credentials, UserResolvers } from '@/generated/graphql';
import { GraphQLContext } from '../types';
import { GraphQLError } from 'graphql';
import { getWcaApiWithFreshAuthPersistedToDB } from '@/graphql/datasources/WcaApi';

export const importableCompetitions: UserResolvers<GraphQLContext>['importableCompetitions'] =
  async (parent, _, { user }) => {
    if (!user) {
      throw new GraphQLError('Unauthenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: {
            status: 401,
          },
        },
      });
    }

    let credentials: Credentials = {
      userId: user.id,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresAt: new Date(user.expiresAt),
    };

    if (parent.id !== user?.id) {
      const creds = await prisma?.credentials.findUnique({
        where: {
          userId: parent.id,
        },
      });

      if (!creds) {
        throw new GraphQLError('Could not fetch credentials for user');
      }

      credentials = {
        userId: creds?.userId,
        accessToken: creds?.accessToken,
        refreshToken: creds?.refreshToken,
        expiresAt: new Date(creds?.expiresAt),
      };
    }

    const wcaApi = await getWcaApiWithFreshAuthPersistedToDB(credentials);

    const upcomingCompetitions =
      await wcaApi.getUpcomingManageableCompetitions();

    const compIds = upcomingCompetitions.map(({ id }) => id);

    const importedCompetitions =
      (await prisma?.competitionMetadata.findMany({
        where: {
          wcaId: {
            in: compIds,
          },
        },
      })) || [];

    console.log(76, importedCompetitions);

    const importedCompetitionIds = importedCompetitions.map(
      ({ wcaId }) => wcaId,
    );

    const importableCompetitions = upcomingCompetitions.filter(
      ({ id }) => !importedCompetitionIds.includes(id),
    );

    return importableCompetitions;
  };
