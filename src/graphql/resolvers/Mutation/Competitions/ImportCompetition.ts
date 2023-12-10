import { Competition, MutationResolvers } from '@/generated/graphql';
import { prisma } from '@/prisma';
import { getCompetition } from '@/wcaApi';
import { CompetitionStatus, UserCompetitionRole } from '@prisma/client';
import { GraphQLContext } from '../../types';

export const importCompetition: MutationResolvers<GraphQLContext>['importCompetition'] =
  async (_, { wcaId }, { user }) => {
    const compData = await getCompetition(user.accessToken, wcaId);

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
      },
      include: {
        Metadata: true,
      },
    })) as Competition;
  };
