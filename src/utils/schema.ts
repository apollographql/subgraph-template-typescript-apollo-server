import { resolve, extname } from 'path';
import { readFileSync, Dirent, writeFileSync, readdirSync } from 'fs';
import { gql } from 'graphql-tag';
import { buildSubgraphSchema, printSubgraphSchema } from '@apollo/subgraph';
import { GraphQLSchemaModule } from 'apollo-server';

const graphqlFolder = resolve(__dirname, '..', 'graphql');

/**
 * Combines all `.graphql` files in the *src/modules* folder
 * with resolvers *(optional)* into a single subgraph schema.
 * @returns `GraphQLSchema`
 */
export async function generateSubgraphSchema() {
  const schemaModules = [];
  const schemaFiles = readdirSync(graphqlFolder, {
    withFileTypes: true,
  }).filter((file) => {
    const extension = extname(file.name).toLowerCase();

    return extension === '.ts' || extension === '.graphql';
  });

  for (const schemaFile of schemaFiles) {
    const loadedModel = await loadModule(schemaFile);
    if (loadedModel) {
      schemaModules.push(loadedModel);
    }
  }

  return buildSubgraphSchema(schemaModules as any);
}

export async function writeSchema() {
  const schema = await generateSubgraphSchema();
  writeFileSync(
    resolve(__dirname, '..', '..', 'generated-schema.graphql'),
    printSubgraphSchema(schema),
    {
      encoding: 'utf-8',
    },
  );
}

/**
 * Load a set of typeDefs and resolvers.
 * @param module - The Dirent of the folder
 * @returns { typeDefs, resolvers? }
 */
async function loadModule(
  module: Dirent,
): Promise<GraphQLSchemaModule | undefined> {
  const moduleName = module.name.split('.').shift();
  if (moduleName) {
    const ext = extname(module.name).toLowerCase();
    if (ext === '.graphql') {
      const typeDefs = gql(
        readFileSync(resolve(graphqlFolder, module.name), {
          encoding: 'utf-8',
        }),
      );

      try {
        const { resolvers } = await import(resolve(graphqlFolder, moduleName));

        return { typeDefs, resolvers };
      } catch (err) {
        console.log(
          `No resolvers loaded for ${module.name}, schema will be mocked`,
        );
      }

      return { typeDefs };
    } else if (ext === '.ts') {
      const { typeDefs, resolvers } = await import(
        resolve(graphqlFolder, moduleName)
      );
      if (!typeDefs) return undefined;
      return { typeDefs, resolvers };
    }
  }
  return undefined;
}
