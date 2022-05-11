import { readdirSync } from 'fs';
import { extname, resolve } from 'path';

const dataSourcesFolder = resolve(__dirname, '..', 'datasources');

/**
 * A helper function to dynamically combine all of the dataSources in a given folder
 * @returns DataSources for ApolloServer constructor
 */
export async function generateDataSources() {
  const dataSources: any = {};
  const files = readdirSync(dataSourcesFolder, {
    withFileTypes: true,
  }).filter((file) => extname(file.name).toLowerCase() === '.ts');

  for (const typeDefFile of files) {
    const dataSourceName = typeDefFile.name.split('.').shift();
    if (dataSourceName) {
      const dataSourceClass = await import(
        resolve(dataSourcesFolder, dataSourceName)
      );

      // swagger-typescript-api generates an `Api` class
      if (dataSourceClass?.Api)
        dataSources[dataSourceName] = new dataSourceClass.Api({
          //This is only as an example from
          //  https://github.com/acacode/swagger-typescript-api/blob/master/tests/schemas/v3.0/petstore.yaml
          baseURL: 'http://localhost',
        });
      else dataSources[dataSourceName] = new dataSourceClass[dataSourceName]();
    }
  }

  return () => {
    return dataSources;
  };
}
