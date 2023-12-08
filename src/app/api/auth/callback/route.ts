import { NextRequest, NextResponse } from 'next/server';
import { WCAUser } from '../../../../../types/wca';
import { COOKIE_NAME, signJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  console.log(4);

  const tokenRes = (await fetch(
    'https://staging.worldcubeassociation.org/oauth/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.WCA_CLIENT_ID!,
        client_secret: process.env.WCA_CLIENT_SECRET!,
        redirect_uri: 'http://localhost:3000/api/auth/callback',
        grant_type: 'authorization_code',
        code,
      }),
    },
  ).then((res) => res.json())) as {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
  };

  console.log(tokenRes);

  const userRes = (await fetch(
    'https://staging.worldcubeassociation.org/api/v0/me',
    {
      headers: {
        Authorization: `Bearer ${tokenRes.access_token}`,
      },
    },
  ).then((res) => res.json())) as {
    me: WCAUser;
  };

  const token = await signJWT({
    id: userRes.me.id,
    name: userRes.me.name,
    email: userRes.me.email,
    avatar: {
      url: userRes.me.avatar.thumb_url,
    },
    accessToken: tokenRes.access_token,
    expiresAt: tokenRes.created_at + tokenRes.expires_in,
  });

  const response = NextResponse.redirect('http://localhost:3000/');

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
