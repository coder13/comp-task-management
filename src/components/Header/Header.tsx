'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data, status } = useSession();

  console.log(6, { data, status });

  return (
    <div className="w-full flex">
      {status === 'unauthenticated' && (
        <button
          className="bg-blue-200 p-2"
          onClick={() =>
            signIn('wca', {
              callbackUrl: '/',
            })
          }
        >
          Sign In
        </button>
      )}
      {status === 'authenticated' && (
        <>
          <button className="bg-blue-200 p-2" onClick={() => signOut()}>
            Sign Out
          </button>
          Signed in as: {data?.user?.name}
        </>
      )}
      {status === 'loading' && <div className="bg-blue-200 p-2">Loading</div>}
    </div>
  );
}
