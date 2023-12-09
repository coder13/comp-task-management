import { Competition } from './types';

const WCA_ORIGIN = process.env.WCA_ORIGIN;

export const wcaFetch = <T>(url: string, options: RequestInit = {}) => {
  return fetch(url, {
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
    `${WCA_ORIGIN}/api/v0/competitions/${competitionId}`,
  );
};
