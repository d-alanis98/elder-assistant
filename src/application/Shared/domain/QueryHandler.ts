import Query from './Query';
import Response from './Response';

export default interface QueryHandler<Q extends Query, R extends Response> {
    subscribedTo(): Query;
    handle(query: Q): Promise<R>;
}
