import { prisma } from '@/prisma';

const Resolvers = {
  Query: {
    datapoints: () => {
      return prisma.dataPoint.findMany();
    },
  },
};

export default Resolvers;
