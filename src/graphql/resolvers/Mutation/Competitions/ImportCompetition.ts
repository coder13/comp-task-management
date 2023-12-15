import { Competition, MutationResolvers } from '@/generated/graphql';
import { prisma } from '@/prisma';
import { CompetitionStatus, UserCompetitionRole } from '@prisma/client';
import { GraphQLContext } from '../../types';
import { WcaAPI } from '@/graphql/datasources/WcaApi';
import { User } from '@/lib/auth';

export const importCompetition: MutationResolvers<GraphQLContext>['importCompetition'] =
  async (_, { wcaId, teamId, orgUserId }, { user }) => {
    const wcaApi = await getWcaApi(user, orgUserId);

    if (wcaApi.expired()) {
      await wcaApi.getTokensRefreshAuth();
    }

    const team = teamId
      ? await prisma.team.findFirst({
          where: {
            id: teamId,
            Members: {
              some: {
                userId: user.id,
                role: 'Leader',
              },
            },
          },
        })
      : null;

    const compData = await wcaApi.getCompetition(wcaId);

    const alreadyExists = await prisma.competitionMetadata.findUnique({
      where: {
        wcaId,
      },
    });

    if (alreadyExists) {
      throw new Error(`Competition ${wcaId} already exists`);
    }

    const involvedPersons = [
      ...compData.organizers.map((organizer) => ({
        wcaUserId: organizer.id,
        role: UserCompetitionRole.Organizer,
        name: organizer.name,
        email: organizer.email,
      })),
      ...compData.delegates.map((delegate) => ({
        wcaUserId: delegate.id,
        role: UserCompetitionRole.Delegate,
        name: delegate.name,
        email: delegate.email,
      })),
    ];

    return (await prisma.competition.create({
      data: {
        name: compData.name,
        status: compData.announced_at
          ? CompetitionStatus.Announced
          : CompetitionStatus.Planning,
        Metadata: {
          create: {
            announced: !!compData.announced_at,
            startDate: compData.start_date,
            endDate: compData.end_date,
            updatedByUserId: null,
            wcaId: wcaId,
          },
        },
        Users: {
          create: involvedPersons.map((person) => ({
            role: person.role,
            User: {
              connectOrCreate: {
                where: {
                  id: person.wcaUserId,
                },
                create: {
                  id: person.wcaUserId,
                  name: person.name,
                  email: person.email,
                },
              },
            },
          })),
        },
        ...(team && {
          Teams: {
            connect: {
              id: team?.id,
            },
          },
        }),
      },
      include: {
        Metadata: true,
      },
    })) as Competition;
  };

const getWcaApi = async (user: User, orgUserId?: number | null) => {
  if (orgUserId) {
    const orgUser = await prisma.user.findUnique({
      where: {
        id: orgUserId,
        AND: {
          Team: {
            Members: {
              some: {
                userId: user.id,
                role: 'Leader',
              },
            },
          },
        },
      },
      include: {
        Credentials: true,
      },
    });

    if (!orgUser || !orgUser.Credentials) {
      throw new Error('Invalid org user');
    }

    return new WcaAPI({
      accessToken: orgUser.Credentials?.accessToken,
      refreshToken: orgUser.Credentials?.refreshToken,
      expiresAt: new Date(orgUser.Credentials?.expiresAt),
    });
  }

  return new WcaAPI({
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    expiresAt: new Date(user.expiresAt),
  });
};
