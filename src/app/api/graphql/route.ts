import { yogaServer } from '@/graphql';

const { handleRequest } = yogaServer;

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
