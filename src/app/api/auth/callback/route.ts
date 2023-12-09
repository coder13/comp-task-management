import { NextRequest, NextResponse } from 'next/server';
import { WCAUser } from '../../../../../types/wca';
import { COOKIE_NAME, signJWT } from '@/lib/auth';
import { prisma } from '@/prisma';
import { logger } from '../../../../../logger';

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code');

    const tokenRes = (await fetch(`${process.env.WCA_ORIGIN}/oauth/token`, {
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
    }).then((res) => res.json())) as {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
      created_at: number;
    };

    const userRes = (await fetch(`${process.env.WCA_ORIGIN}/api/v0/me`, {
      headers: {
        Authorization: `Bearer ${tokenRes.access_token}`,
      },
    }).then((res) => res.json())) as {
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

    const userData = await prisma.user.upsert({
      create: {
        id: userRes.me.id,
        name: userRes.me.name,
        email: userRes.me.email,
      },
      update: {
        name: userRes.me.name,
        email: userRes.me.email,
      },
      where: {
        id: userRes.me.id,
      },
    });

    logger.info(`Upserted user info`, userData);

    return response;
  } catch (e: { message: string } | any) {
    logger.error('message' in e ? e.message : e);
    return NextResponse.redirect('http://localhost:3000/');
  }
}
