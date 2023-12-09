import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { createSchema, createYoga } from 'graphql-yoga';
import Resolvers from './resolvers';
import { getUser } from '@/helpers/user';

const schema = String(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.gql'),
    'utf-8',
  ),
);

export const yogaServer = createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers: Resolvers,
  }),
  context: async () => {
    // const request = req.request as NextRequest;
    const user = await getUser();

    return {
      user,
    };
  },

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});
