import { ApolloServer } from 'apollo-server';
import { generateSubgraphSchema } from './utils/schema';
import { generateDataSources } from './utils/generateDataSources';

const PORT = 4001;

async function main() {
  let schema = await generateSubgraphSchema();
  let dataSources = await generateDataSources();

  const server = new ApolloServer({
    schema,
    mocks: process.env.NODE_ENV == 'production' ? false : true,
    mockEntireSchema: false,
    dataSources,
    context: ({ req }) => {
      return {
        authorization: req?.headers['authorization'] ?? '',
      };
    },
  });

  await server
    .listen({ port: PORT })
    .then(({ url }) => console.log(`Subgraph ready at: ${url}`));
}

main();
