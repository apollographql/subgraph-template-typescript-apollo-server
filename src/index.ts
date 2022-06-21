import { ApolloServer } from 'apollo-server';
import { generateDataSources } from './utils/generateDataSources';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { buildSubgraphSchema } from '@apollo/subgraph';
import resolvers from './resolvers';
import gql from 'graphql-tag';

const PORT = 4001;
const isProduction = process.env.NODE_ENV === 'production';
const shouldMock = process.env.SHOULD_MOCK === 'true';

async function main() {
  let typeDefs = gql(
    readFileSync(resolve('..', 'schema.graphql'), {
      encoding: 'utf-8',
    }),
  );
  let schema = buildSubgraphSchema({ typeDefs, resolvers });
  let dataSources = await generateDataSources();

  const server = new ApolloServer({
    schema,
    mocks: shouldMock,
    mockEntireSchema: false,
    dataSources,
    context: ({ req }) => {
      return {
        authorization: req?.headers['authorization'] ?? '',
      };
    },
    cors: isProduction ? false : { origin: '*' },
  });

  await server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`Subgraph ready at: ${url}`));
}

main();
