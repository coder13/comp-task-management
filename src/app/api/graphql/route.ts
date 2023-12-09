import { yogaServer } from '@/graphql';

const { handleRequest } = yogaServer;

console.log('handleRequest', handleRequest);

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
