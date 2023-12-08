import { getSession } from 'next-auth/react';

export async function GET() {
  const session = await getSession();
  console.log(session);
  return Response.json({
    message: 'Hello World',
  });
}
