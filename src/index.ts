import { ApolloServer } from 'apollo-server';
import { generateSubgraphSchema } from './utils/schema';
import { generateDataSources } from './utils/generateDataSources';

const PORT = 4001;
const isProduction = process.env.NODE_ENV === 'production';
const shouldMock = process.env.SHOULD_MOCK === 'true';

async function main() {
  let schema = await generateSubgraphSchema();
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
