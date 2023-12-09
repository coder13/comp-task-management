import { User } from '@/lib/auth';
import { YogaInitialContext } from 'graphql-yoga';

export interface GraphQLContext extends YogaInitialContext {
  user: User;
}
