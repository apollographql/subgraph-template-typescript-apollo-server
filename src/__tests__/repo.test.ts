import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServer } from 'apollo-server';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { resolve } from 'path';
import resolvers from '../resolvers';
import { generateDataSources } from '../utils/generateDataSources';

let mockedSubgraph: ApolloServer;

describe('Repository Template Functionality', () => {
  beforeAll(async () => {
    let typeDefs = gql(
      readFileSync(resolve('schema.graphql'), {
        encoding: 'utf-8',
      }),
    );
    let schema = buildSubgraphSchema({ typeDefs, resolvers });
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

  it('Execute root query', async () => {
    //Arrange
    const query = 'query { foo(id:"1") { name } }';
    const expected = { foo: { name: 'Foo' } };

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
});
