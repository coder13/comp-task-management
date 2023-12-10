import { Competition } from './types';

const WCA_ORIGIN = process.env.WCA_ORIGIN;

export const wcaFetch = <T>(url: string, options: RequestInit = {}) => {
  return fetch(`${WCA_ORIGIN}/api/v0${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }).then((data) => data.json()) as Promise<T>;
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
