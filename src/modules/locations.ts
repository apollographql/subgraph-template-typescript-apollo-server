import gql from 'graphql-tag';
import type {
  QueryLocationArgs,
  Resolvers,
} from '../__generated__/resolvers-types';
import type { DataSourceContext } from '../types/DataSourceContext';

export const typeDefs = gql`
  type Query {
    "The full list of locations presented by the Interplanetary Space Tourism department"
    locations: [Location!]!
    "The details of a specific location"
    location(id: ID!): Location
  }

  type Location @key(fields: "id") {
    id: ID!
    "The name of the location"
    name: String!
    "A short description about the location"
    description: String!
    "The location's main photo as a URL"
    photo: String!
  }
`;

export const resolvers: Resolvers = {
  Query: {
    locations(_parent: any, _args: any, { dataSources }: DataSourceContext) {
      return dataSources.LocationsAPI.getAllLocations();
    },
    location(
      _parent: any,
      args: QueryLocationArgs,
      { dataSources }: DataSourceContext,
    ) {
      return dataSources.LocationsAPI.getLocation(args.id);
    },
  },
  Location: {
    __resolveReference(location: { id: string }, context: DataSourceContext) {
      return context.dataSources.LocationsAPI.getLocation(location.id);
    },
  },
};
