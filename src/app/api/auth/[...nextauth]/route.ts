import NextAuth, { AuthOptions } from 'next-auth';
import { WCAUser } from '../../../../../types/wca.types';

interface wcaMeResponse {
  me: WCAUser;
}

console.log(7);

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
          console.log(29, context);
          const provider = context.provider;
          const query = `https://staging.worldcubeassociation.org/oauth/token?client_id=${provider.clientId}&client_secret=${provider.clientSecret}&redirect_uri=${provider.callbackUrl}&code=${context.params.code}&grant_type=authorization_code`;
          const res = await fetch(query, { method: 'POST' });
          const json = await res.json();
          return { tokens: json };
        },
      },
      userinfo: 'https://staging.worldcubeassociation.org/api/v0/me',
      profile(profile: wcaMeResponse) {
        console.log(38, profile);
        return {
          id: profile.me.id,
          name: profile.me.name,
          email: profile.me.email,
        };
      },
    },
  ],
  events: {
    createUser: async ({ user }) => {
      console.log(user);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account?.access_token;
        token.refreshToken = account?.refresh_token;
        // @ts-ignore
        token.id = profile?.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
