// lib/apollo-provider.js
'use client';

import { PropsWithChildren } from 'react';
import { ApolloLink, HttpLink } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;

// console.log(process.env);

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${BASE_URL}/api/graphql`,
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
    connectToDevTools: true,
  });
}

export function ApolloProvider({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
