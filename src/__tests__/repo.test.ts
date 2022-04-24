import type { ApolloServer } from 'apollo-server-express';

import createSubgraph from '../utils/server';

let mockedSubgraph: ApolloServer;

describe('Repository Template Functionality', () => {
  beforeAll(async () => {
    const { subgraph } = await createSubgraph();
    mockedSubgraph = subgraph;
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
  it('Loads resolvers defined in {moduleName}Resolvers - fooResolvers.ts', async () => {
    //Arrange
    const query = 'query { foo }';
    const expected = { foo: 'bar' };

    //Act
    const res = await mockedSubgraph.executeOperation({ query });

    //Assert
    expect(res.data).toEqual(expected);
  });
  it('Load resolvers for .graphql file - bar.ts', async () => {
    //Arrange
    const query = 'query { bar }';
    const expected = { bar: 'foo' };

    //Act
    const res = await mockedSubgraph.executeOperation({ query });

    //Assert
    expect(res.data).toEqual(expected);
  });
  it('Executes Location Entity Resolver', async () => {
    //Arrange
    const query = `query ($representations: [_Any!]!) {
      _entities(representations: $representations) {
        ...on Location {
          name
        }
      }
    }`;
    const variables = {
      representations: [{ __typename: 'Location', id: 'loc-1' }],
    };
    const expected = {
      _entities: [{ name: 'The Living Ocean of New Lemuria' }],
    };

    //Act
    const res = await mockedSubgraph.executeOperation({
      query,
      variables,
    });

    //Assert
    expect(res.data).toEqual(expected);
  });
});
