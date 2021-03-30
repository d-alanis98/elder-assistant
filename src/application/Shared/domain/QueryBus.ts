import Query from './Query';
import Response from './Response';

export default interface QueryBus {
  ask<R extends Response>(query: Query): Promise<R>;
}
