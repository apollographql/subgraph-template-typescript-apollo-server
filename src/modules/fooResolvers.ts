export const resolvers = {
  Query: {
    foo(_parent: any, _args: any, _context: any) {
      return 'bar';
    },
  },
};
