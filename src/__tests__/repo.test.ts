import { ApolloServer } from 'apollo-server';
import { Dirent } from 'fs';
import { generateDataSources } from '../utils/generateDataSources';
import { generateSubgraphSchema, loadModule } from '../utils/schema';

let mockedSubgraph: ApolloServer;

describe('Repository Template Functionality', () => {
  beforeAll(async () => {
    let schema = await generateSubgraphSchema();
    let dataSources = await generateDataSources();

    const server = new ApolloServer({
      schema,
      mocks: true,
      mockEntireSchema: false,
      dataSources,
    });
    await server.listen();
    mockedSubgraph = server;
  });
  afterAll(async () => {
    await mockedSubgraph.stop();
  });

  it('Mocks typeDefs when resolvers are not defined - helloWorld.graphql', async () => {
    //Arrange
    const query = 'query { hello }';
    const expected = { hello: 'Hello World' };

    //Act
    const res = await mockedSubgraph.executeOperation({ query });

    //Assert
    expect(res.data).toEqual(expected);
  });
  it('Load resolvers for .graphql file - bar.ts', async () => {
    //Arrange
    const query = 'query { bar(id:"1") { name appendedName } }';
    const expected = { bar: { name: 'Bar', appendedName: 'Bar - appended' } };

    //Act
    const res = await mockedSubgraph.executeOperation({ query });

    //Assert
    expect(res.data).toEqual(expected);
  });
  it('Executes Location Entity Resolver', async () => {
    //Arrange
    const query = `query ($representations: [_Any!]!) {
      _entities(representations: $representations) {
        ...on Foo {
          name
        }
      }
    }`;
    const variables = {
      representations: [{ __typename: 'Foo', id: '1' }],
    };
    const expected = {
      _entities: [{ name: 'Foo' }],
    };

    //Act
    const res = await mockedSubgraph.executeOperation({
      query,
      variables,
    });

    //Assert
    expect(res.data).toEqual(expected);
  });
  it('Module not found returns undefined', async () => {
    //Arrange
    const emptyDirent = new Dirent();

    //Act
    const undefinedModule = await loadModule(emptyDirent);

    //Assert
    expect(undefinedModule).toBeUndefined();
  });
});
