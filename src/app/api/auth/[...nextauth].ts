import NextAuth from 'next-auth';

interface WCAProfile {
  id: string;
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    {
      id: 'wcaProvider',
      name: 'WCAProvider',
      type: 'oauth',
      authorization: 'https://staging.worldcubeassociation.org/oauth/authorize',
      token: 'https://staging.worldcubeassociation.org/oauth/token',
      userinfo: 'https://staging.worldcubeassociation.org/api/v0/me',
      profile(profile: WCAProfile) {
        console.log(profile);
        return {
          id: profile.id,
        };
      },
      clientId: process.env.WCA_CLIENT_ID,
      clientSecret: process.env.WCA_CLIENT_SECRET,
    },
  ],
});
