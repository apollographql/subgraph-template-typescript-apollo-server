import { Resolvers } from '../__generated__/resolvers-types';

export const resolvers: Resolvers = {
  Query: {
    async bar(_parent, { id }, { dataSources }) {
      const bar = await dataSources.BarAPI.bars.showBarById(id);
      console.log(dataSources);
      return bar.data;
    },
  },
  Bar: {
    appendedName(parent, _args, _context) {
      return `${parent.name} - appended`;
    },
  },
};
