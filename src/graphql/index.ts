import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { createSchema, createYoga } from 'graphql-yoga';
import Resolvers from './resolvers';

const schema = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'schema.gql'),
  'utf-8',
);

export const yogaServer = createYoga({
  schema: createSchema({
    typeDefs: schema,
    resolvers: Resolvers,
  }),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});
