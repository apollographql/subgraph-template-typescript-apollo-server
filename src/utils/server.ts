import { resolve } from 'path';
import type { GraphQLSchema } from 'graphql';
import { ApolloServer } from 'apollo-server';

import { getFiles } from './files';
import { DATASOURCES_FOLDER } from './constants';
import { generateSubgraphSchema } from './schema';

// const port = 4001;

/**
 * Creates schema from modules and starts a server on the defined port
 * @returns `{ subgraph: ApolloServer, info: ServerInfo }`
 */
export default async function createSubgraph(
  options: {
    port: string;
    mocks?: any;
    schema?: GraphQLSchema;
  } = { port: process.env.PORT ?? '4001' },
) {
  let schema = options?.schema ?? (await generateSubgraphSchema());

  const server = new ApolloServer({
    schema,
    mocks: process.env.NODE_ENV == 'production' ? false : true,
    mockEntireSchema: false,
    dataSources: await generateDataSources(),
    context: ({ req }) => {
      return {
        authorization: req?.headers['authorization'] ?? '',
      };
    },
  });
  const serverInfo = await server.listen({ port: options.port });
  return { subgraph: server, info: serverInfo };
}

async function generateDataSources() {
  const dataSources: any = {};

  for (const typeDefFile of getFiles(resolve(DATASOURCES_FOLDER))) {
    const moduleName = typeDefFile.name.split('.').shift();
    if (moduleName) {
      const dataSourceClass = await import(
        resolve(__dirname, '..', 'datasources', moduleName)
      );

      dataSources[moduleName] = new dataSourceClass[moduleName]();
    }
  }

  return () => {
    return dataSources;
  };
}
