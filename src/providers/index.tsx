'use client';

import { PropsWithChildren } from 'react';
import { ApolloProvider } from './ApolloProvider';

export default function Providers({ children }: PropsWithChildren) {
  return <ApolloProvider>{children}</ApolloProvider>;
}
