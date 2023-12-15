import { MutationResolvers } from '@/generated/graphql';
import { GraphQLContext } from '../../types';
import { ApolloError } from '@apollo/client';
import { logger } from '../../../../../logger';
import { GraphQLError } from 'graphql';
import { WcaAPI } from '@/graphql/datasources/WcaApi';
import { Credentials, User } from '@prisma/client';

export interface AddOrgUserState {
  message: string;
}

export const linkAndUpsertOrgUser: MutationResolvers<GraphQLContext>['linkAndUpsertOrgUser'] =
  async (_, { teamId, email, password, importComps }, { user }) => {
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

    if (!teamId) {
      throw new ApolloError({
        errorMessage: 'Missing teamId',
      });
    }

    const team = await prisma?.team.findFirst({
      where: {
        id: teamId,
        Members: {
          some: {
            userId: user.id,
            role: 'Leader',
          },
        },
      },
      include: {
        OrgUsers: true,
      },
    });

    if (!team) {
      throw new GraphQLError('You do not have permission to modify this team');
    }

    const wcaApi = new WcaAPI();

    if (wcaApi.expired()) {
      await wcaApi.getTokensRefreshAuth();
    }

    let tokens;
    try {
      tokens = await wcaApi.getTokensPasswordAuth(email, password);
    } catch (e) {
      logger.error(`Error when fetching tokens}`);
      logger.error(e);
      throw new GraphQLError('Invalid Credentials');
    }

    let profile;
    try {
      profile = await wcaApi.getProfile();
    } catch (e) {
      throw new GraphQLError('Error fetching profile');
    }

    const orgUser = {
      id: profile.me.id,
      name: profile.me.name,
      email: profile.me.email,
      teamId,
    };

    const creds = {
      accessToken: tokens!.access_token,
      refreshToken: tokens!.refresh_token,
      expiresAt: new Date(Date.now() + tokens!.expires_in * 1000),
    };

    const newUser = await prisma?.user.upsert({
      create: {
        ...orgUser,
        Credentials: {
          connectOrCreate: {
            create: creds,
            where: {
              userId: orgUser.id,
            },
          },
        },
      },
      update: {
        ...orgUser,
        Credentials: {
          upsert: {
            create: creds,
            update: creds,
            where: {
              userId: orgUser.id,
            },
          },
        },
      },
      where: {
        id: orgUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        Credentials: true,
      },
    });

    if (!newUser) {
      throw new GraphQLError('Error creating user');
    }

    if (importComps) {
      await importAllCompetitions(newUser.id, teamId);
    }

    return newUser;
  };

const importAllCompetitions = async (userId: number, teamId: number) => {
  const comps =
    (await prisma?.competition.findMany({
      where: {
        Users: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
      },
    })) || [];

  await Promise.all(
    comps.map(
      ({ id }) =>
        prisma?.team.update({
          where: {
            id: teamId,
          },
          data: {
            Competitions: {
              connect: {
                id,
              },
            },
          },
        }),
    ),
  );
};
