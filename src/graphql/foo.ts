import gql from 'graphql-tag';
import { Resolvers } from '../__generated__/resolvers-types';

export const typeDefs = gql`
  type Query {
    foos: [Foo]
  }
  type Foo @key(fields: "id") {
    id: ID!
    name: String
  }
`;

export const resolvers: Resolvers = {
  Query: {
    foos(_parent, _args, { dataSources }) {
      return dataSources.FooAPI.getAllFoo();
    },
  },
  Foo: {
    __resolveReference(foo, { dataSources }) {
      return dataSources.FooAPI.getFoo(foo.id);
    },
  },
};
