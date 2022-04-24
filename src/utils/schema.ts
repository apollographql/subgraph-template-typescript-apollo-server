import { resolve, extname } from 'path';
import { readFileSync, existsSync, Dirent, writeFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { buildSubgraphSchema, printSubgraphSchema } from '@apollo/subgraph';

import { getFiles } from './files';
import { MODULES_FOLDER } from './constants';
const schemaModulesFolder = resolve(MODULES_FOLDER);

/**
 * Combines all `.graphql` files in the *src/modules* folder
 * with resolvers *(optional)* into a single subgraph schema.
 * @returns `GraphQLSchema`
 */
export async function generateSubgraphSchema() {
  const schemaModules = [];
  const typeDefFiles = getFiles(schemaModulesFolder);

  for (const typeDefFile of typeDefFiles) {
    const loadedModel = await loadModule(typeDefFile);
    if (loadedModel) {
      schemaModules.push({
        resolvers: loadedModel.resolvers ?? {},
        typeDefs: loadedModel.typeDefs,
      });
    }
  }

  return buildSubgraphSchema(schemaModules);
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
 * Load a schema modules typeDefs and resolvers.
 * Ordered by:
 *  1. {moduleName}.graphql
 *  2. {moduleName}.ts
 *  3. {moduleName}Resolvers.ts
 * @param module - The Dirent of the folder
 * @returns { typeDefs, resolvers? }
 */
async function loadModule(module: Dirent) {
  const moduleName = module.name.split('.').shift();
  if (moduleName) {
    if (extname(module.name).toLowerCase() === '.graphql') {
      const typeDefs = gql(
        readFileSync(resolve(__dirname, '..', 'modules', module.name), {
          encoding: 'utf-8',
        }),
      );
      const resolvers = await getResolvers(moduleName);
      if (resolvers) return { typeDefs, resolvers };
      return { typeDefs };
    } else if (extname(module.name).toLowerCase() === '.ts') {
      const { typeDefs, resolvers } = await import(
        resolve(__dirname, '..', 'modules', moduleName)
      );
      if (resolvers && typeDefs) return { typeDefs, resolvers };
      else if (typeDefs) {
        const resolvers = await getResolvers(moduleName);
        return { typeDefs, resolvers };
      } else {
        //These resolvers should be loaded with the associated .graphql or schema modules
      }
    }
  }
  return undefined;
}

async function getResolvers(moduleName: string) {
  if (existsSync(resolve(schemaModulesFolder, `${moduleName}.ts`))) {
    const { resolvers } = await import(
      resolve(__dirname, '..', 'modules', moduleName)
    );
    if (resolvers) return resolvers;
  }

  if (existsSync(resolve(schemaModulesFolder, `${moduleName}Resolvers.ts`))) {
    const { resolvers } = await import(
      resolve(__dirname, '..', 'modules', `${moduleName}Resolvers`)
    );
    if (resolvers) return resolvers;
  }

  return undefined;
}
