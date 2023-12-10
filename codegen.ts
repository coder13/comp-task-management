import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/graphql/schema.gql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        scalars: {
          Date: 'string',
          DateTime: 'Date',
          NumericalID: 'number',
        },
      },
    },
    'src/generated/queries.ts': {
      documents: 'src/graphql/client/*.gql',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        scalars: {
          Date: 'string',
          DateTime: 'Date',
          NumericalID: 'number',
        },
      },
    },
  },
};

export default config;
