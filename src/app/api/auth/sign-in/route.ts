const WCA_ORIGIN = process.env.WCA_ORIGIN;

export function GET() {
  const urlParams = new URLSearchParams({
    client_id: process.env.WCA_CLIENT_ID!,
    redirect_uri: 'http://localhost:3000/api/auth/callback',
    response_type: 'code',
    scope: 'email public manage_competitions',
  });

  const url = `${WCA_ORIGIN}/oauth/authorize?${urlParams.toString()}`;
  return Response.redirect(url);
}
