import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest';
import { Competition, ProfileResponse, TokenResponse } from './types';
import { Credentials } from '@/generated/graphql';
import { logger } from '../../../../logger';

const WCA_ORIGIN = process.env.WCA_ORIGIN;

export class WcaAPI extends RESTDataSource {
  override baseURL = `https://${WCA_ORIGIN}/`;
  private credentials?: Omit<Credentials, 'userId'>;

  constructor(creds?: Omit<Credentials, 'userId'>) {
    super();
    this.baseURL = `${WCA_ORIGIN}`;
    if (creds) {
      this.credentials = creds;
    }
  }

  setCredentials(creds: Omit<Credentials, 'userId'>) {
    this.credentials = creds;
  }

  getCredentials() {
    return this.credentials;
  }

  expired() {
    return (
      this.credentials?.expiresAt &&
      this.credentials.expiresAt.getTime() <= Date.now()
    );
  }

  authenticated() {
    return !!this.credentials?.accessToken;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    if (!this.credentials?.accessToken) {
      logger.error('Access token is not available');
    }

    if (this.expired()) {
      logger.error('Access token is expired');
    }

    if (this.credentials?.accessToken && !this.expired()) {
      request.headers['authorization'] =
        `Bearer ${this.credentials.accessToken}`;
    }
  }

  async getTokensPasswordAuth(username: string, password: string) {
    const params = new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.WCA_CLIENT_ID!,
      client_secret: process.env.WCA_CLIENT_SECRET!,
      redirect_uri: `${process.env.BASE_URL!}/api/auth/callback`,
      scope: 'public manage_competitions email',
      username,
      password,
    });

    const response = await this.post<TokenResponse>(
      `${this.baseURL}/oauth/token`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      },
    );

    this.credentials = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: new Date(Date.now() + response.expires_in * 1000),
    };
    return response;
  }

  async getTokensRefreshAuth() {
    if (!this.credentials?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.WCA_CLIENT_ID!,
      client_secret: process.env.WCA_CLIENT_SECRET!,
      redirect_uri: `${process.env.BASE_URL!}/api/auth/callback`,
      scope: 'public manage_competitions email',
      refresh_token: this.credentials!.refreshToken!,
    });

    const response = await fetch(`${this.baseURL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokens = (await response.json()) as
      | TokenResponse
      | { error: string; error_description: string };

    if ('error' in tokens) {
      throw new Error(`${tokens.error}: ${tokens.error_description}`);
    }

    this.credentials = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    };

    return response;
  }

  getCompetition(competitionId: string) {
    return this.get<Competition>(`/api/v0/competitions/${competitionId}`);
  }

  getUpcomingManageableCompetitions() {
    if (!this.authenticated()) {
      throw new Error('No access token available');
    }

    const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
      managed_by_me: 'true',
      start: oneDayAgo.toISOString(),
    });

    return this.get<Competition[]>(`/api/v0/competitions?${params.toString()}`);
  }

  getProfile() {
    if (!this.authenticated()) {
      throw new Error('No access token available');
    }

    return this.get<ProfileResponse>(`/api/v0/me`);
  }
}

export const getWcaApiWithFreshAuthPersistedToDB = async (
  user: Credentials,
): Promise<WcaAPI> => {
  const wcaApi = new WcaAPI(user);

  if (wcaApi.expired()) {
    try {
      await wcaApi.getTokensRefreshAuth();
      const creds = wcaApi.getCredentials();

      await prisma?.credentials.update({
        where: {
          userId: user.userId,
        },
        data: {
          accessToken: creds?.accessToken,
          refreshToken: creds?.refreshToken,
          expiresAt: creds?.expiresAt,
        },
      });
    } catch (e) {
      console.log(171, e);
      await prisma?.credentials.delete({
        where: {
          userId: user.userId,
        },
      });
      logger.error('Could not update credentials', e);
    }
  }

  return wcaApi;
};
