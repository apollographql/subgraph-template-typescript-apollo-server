import gql from 'graphql-tag';
import type { DataSourceContext } from '../types/DataSourceContext';

interface Location {
  id: string;
}

export const typeDefs = gql`
  extend type Query {
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

export const resolvers = {
  Query: {
    locations(_parent: any, _args: any, { dataSources }: DataSourceContext) {
      return dataSources.LocationsAPI.getAllLocations();
    },
    location(
      _parent: any,
      { id }: Location,
      { dataSources }: DataSourceContext,
    ) {
      return dataSources.LocationsAPI.getLocation(id);
    },
  },
  Location: {
    __resolveReference(location: Location, { dataSources }: DataSourceContext) {
      return dataSources.LocationsAPI.getLocation(location.id);
    },
  },
};
