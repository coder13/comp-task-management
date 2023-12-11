'use server';

import { getUser } from '@/helpers/user';
import { getProfile, getTokens } from '@/wcaApi';
import { logger } from '../../../logger';

export interface AddOrgUserState {
  message: string;
}

export async function addOrgUser(_: AddOrgUserState, formData: FormData) {
  const user = await getUser();

  if (!user) {
    return {
      message: 'Unauthenticated',
    };
  }

  const teamId = parseInt(formData.get('teamId') as string, 10);
  const username = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!teamId) {
    return {
      message: 'Missing teamId',
    };
  }

  console.log({ teamId, username, password });

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
    return {
      message: 'You do not have permission to modify this team',
    };
  }

  if (team.OrgUsers.some((orgUser) => orgUser.email === username)) {
    return {
      message: 'User already added',
    };
  }

  if (!username) {
    return {
      message: 'Please enter an email',
    };
  } else if (!password) {
    return {
      message: 'Please enter a password',
    };
  }

  let tokens;
  try {
    tokens = await getTokens({
      username,
      password,
      grant_type: 'password',
    });
  } catch (e) {
    logger.error(`Error when fetching tokens}`);
    logger.error(e);
    return {
      message: 'Invalid Credentials',
    };
  }

  let profile;
  try {
    profile = await getProfile(tokens.access_token);
  } catch (e) {
    return {
      message: 'Error fetching profile',
    };
  }
  const orgUser = {
    id: profile.me.id,
    name: profile.me.name,
    email: profile.me.email,
    teamId,
  };

  await prisma?.user.upsert({
    create: {
      ...orgUser,
      Credentials: {
        connectOrCreate: {
          create: {
            accessToken: tokens!.access_token,
            refreshToken: tokens!.refresh_token,
            expiresAt: new Date(Date.now() + tokens!.expires_in * 1000),
          },
          where: {
            userId: profile.me.id,
          },
        },
      },
    },
    update: orgUser,
    where: {
      id: profile.me.id,
    },
  });

  return {
    message: 'Org user added!',
  };
}
