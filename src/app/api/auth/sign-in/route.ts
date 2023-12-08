export function GET() {
  const urlParams = new URLSearchParams({
    client_id: process.env.WCA_CLIENT_ID!,
    redirect_uri: 'http://localhost:3000/api/auth/callback',
    response_type: 'code',
    scope: 'public manage_competitions',
  });

  const url = `https://staging.worldcubeassociation.org/oauth/authorize?${urlParams.toString()}`;
  return Response.redirect(url);
}
