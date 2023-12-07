import NextAuth, { AuthOptions } from 'next-auth';
import { WCAUser } from '../../../../../types/wca';

interface wcaMeResponse {
  me: WCAUser;
}

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    {
      id: 'wca',
      name: 'WCA',
      type: 'oauth',
      checks: [],
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET,
      authorization: {
        url: 'https://staging.worldcubeassociation.org/oauth/authorize',
        params: {
          scope: 'public manage_competitions',
        },
      },
      client: {
        response_types: ['code'],
        client_id: process.env.WCA_CLIENT_ID,
        client_secret: process.env.WCA_CLIENT_SECRET,
      },
      token: {
        url: `https://staging.worldcubeassociation.org/oauth/token`,
        async request(context) {
          const provider = context.provider;

          const params = new URLSearchParams({
            client_id: provider.clientId!,
            client_secret: provider.clientSecret!,
            redirect_uri: provider.callbackUrl!,
            code: context.params.code!,
            grant_type: 'authorization_code',
          });

          const query = `https://staging.worldcubeassociation.org/oauth/token?${params.toString()}`;
          const res = await fetch(query, { method: 'POST' });
          const json = await res.json();
          return { tokens: json };
        },
      },
      userinfo: 'https://staging.worldcubeassociation.org/api/v0/me',
      profile: (profile: wcaMeResponse) => profile.me,
    },
  ],
  callbacks: {
    async jwt({ trigger, user, session, token, account, profile }) {
      if (profile && account && user) {
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        token.accessTokenExpires = account.expires_at; // 2 hours

        token.id = user.id;
        token.picture = user.avatar?.url;
      }

      if (
        token.accessTokenExpires &&
        (token.accessTokenExpires as number) * 1000 < Date.now()
      ) {
        // todo: refresh token
        console.log('token is expired', token);
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
