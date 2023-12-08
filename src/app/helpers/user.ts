import { COOKIE_NAME, verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const getUser = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value!;
  const user = token ? await verifyJWT(token) : undefined;
  return user;
};
