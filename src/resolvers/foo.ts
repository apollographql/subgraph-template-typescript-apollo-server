import { Resolvers } from '../__generated__/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    foos(_parent, _args, { dataSources }) {
      return dataSources.FooAPI.getAllFoo();
    },
    foo(_parent, { id }, { dataSources }) {
      return dataSources.FooAPI.getFoo(id);
    },
  },
  Foo: {
    __resolveReference(foo, { dataSources }) {
      return dataSources.FooAPI.getFoo(foo.id);
    },
  },
};
