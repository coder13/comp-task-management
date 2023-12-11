'use server';

import { getUser } from '@/helpers/user';
import { TeamMemberRole } from '@prisma/client';

export interface CreateTeamState {
  message: string;
  teamId?: number;
}

export async function createTeam(_: CreateTeamState, formData: FormData) {
  const user = await getUser();

  if (!user) {
    return {
      message: 'Unauthenticated',
    };
  }

  const teamName = formData.get('name') as string;

  if (!teamName) {
    return {
      message: 'Please enter a team name',
    };
  }

  const newTeam = await prisma?.team.create({
    data: {
      name: teamName,
      Members: {
        create: {
          userId: user.id,
          role: TeamMemberRole.Leader,
        },
      },
    },
  });

  return {
    message: 'Team created!',
    teamId: newTeam?.id,
  };
}
