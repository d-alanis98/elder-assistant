import { SortOptionObject } from 'mongodb'
//Domain
import { Nullable } from '../../domain/Nullable';
import { OrderTypes } from '../../domain/criteria/OrderType';

/**
 * @author Damián Alanís Ramírez
 * @version 4.7.6
 * @description Data repository generic methods to implement CRUD operations.
 */
export interface DataRepository<T> {
    create(value: T): Promise<void>;

    search(id: any): Promise<Nullable<T>>;

    update(value: T): Promise<void>;

    delete(id: any): Promise<void>;

    searchAll?(filters?: Object, queryParameters?: QueryParameters): Promise<Nullable<T[]>>;

    searchAllPaginated?(filters: Object, queryParameters?: QueryParameters): Promise<Nullable<any>>;

}




export interface QueryParameters {
    order?: string | [string, number][] | SortOptionObject<any>;
    limit?: number;
    filterBy?: string;
    startingAt?: any;
    orderDirection?: OrderTypes;
} 


export const defaultQueryParameters = {
    order: { issuedAt: -1 }, //We sort the results by the most recent
    filterBy: 'issuedAt',
    limit: 10,
    orderDirection: OrderTypes.DESC,
};