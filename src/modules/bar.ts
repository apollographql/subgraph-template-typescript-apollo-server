export const resolvers = {
  Query: {
    bar(_parent: any, _args: any, _context: any) {
      return 'foo';
    },
  },
};
