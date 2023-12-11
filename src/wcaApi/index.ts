import { Competition, ProfileResponse, TokenResponse } from './types';

const WCA_ORIGIN = process.env.WCA_ORIGIN;

export const wcaFetch = <T>(url: string, options: RequestInit = {}) => {
  return fetch(`${WCA_ORIGIN}/api/v0${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }).then(async (data) => {
    if (data.ok) {
      return data.json();
    } else {
      console.log(16, data.statusText);
      throw await data.text();
    }
  }) as Promise<T>;
};

export const wcaAuthenticatedFetch = <T>(
  accessToken: string,
  url: string,
  options: RequestInit = {},
) => {
  return wcaFetch<T>(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getCompetition = (accessToken: string, competitionId: string) => {
  return wcaAuthenticatedFetch<Competition>(
    accessToken,
    `/competitions/${competitionId}`,
  );
};

export const getUpcomingManageableCompetitions = (accessToken: string) => {
  const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    managed_by_me: 'true',
    start: oneDayAgo.toISOString(),
  });

  return wcaAuthenticatedFetch<Competition[]>(
    accessToken,
    `/competitions?${params.toString()}`,
  );
};

export const getTokens = async (data: {
  grant_type: 'password';
  username: string;
  password: string;
}) =>
  (await fetch(`${WCA_ORIGIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.WCA_CLIENT_ID!,
      client_secret: process.env.WCA_CLIENT_SECRET!,
      redirect_uri: `${process.env.BASE_URL!}/api/auth/callback`,
      scope: 'public manage_competitions email',
      ...data,
    }),
  }).then(async (data) => {
    if (data.ok) {
      return await data.json();
    }
    throw await data.text();
  })) as Promise<TokenResponse>;

export const getProfile = async (access_token: string) =>
  await wcaAuthenticatedFetch<ProfileResponse>(access_token, '/me');
