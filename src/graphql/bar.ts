import { Resolvers } from '../__generated__/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    async bar(_parent, { id }, { dataSources }) {
      try {
        const bar = await dataSources.BarAPI.bars.showBarById(id);
        return bar.data;
      } catch (err: any) {
        //We don't actually have the REST API running locally...
        //  just an example of using a REST API as a datasource
        console.log(err.message);
        return { name: 'Bar' };
      }
    },
  },
  Bar: {
    appendedName(parent, _args, _context) {
      return `${parent.name} - appended`;
    },
  },
};
