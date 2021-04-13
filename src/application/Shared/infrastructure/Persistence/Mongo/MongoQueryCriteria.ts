//Domain
import { OrderTypes } from '../../../domain/criteria/OrderType';
//Infrastructure
import { QueryParameters } from '../DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Class to conform the filter object for pagination in MongoDB repositories.
 */
export default class MongoQueryCriteria {
    private readonly queryParameters: QueryParameters;

    constructor(queryParameters: QueryParameters) {
        this.queryParameters = queryParameters;
    }

    /**
     * Method to get an object with the query filter to be applied in order to get the pagination.
     * @returns Object with the query filter for the pagination.
     */
    public getPaginationFilter = () => {
        const { filterBy, startingAt, orderDirection }: QueryParameters = this.queryParameters;
        let filters = { };
        if(filterBy && startingAt)
            filters = {
                [filterBy]: this.getFilterComparator(startingAt, orderDirection)
            }

        return filters;
    }

    /**
     * Facade of the getPaginationFilter method. For a one line operation in a cleaner way.
     * @param {QueryParameters} queryParameters Query paramaters.
     * @returns 
     */
    public static getPaginationFilter = (queryParameters: QueryParameters) => (
        new MongoQueryCriteria(queryParameters).getPaginationFilter()
    );

    //Helpers for internal use
    /**
     * Method to get the filter comparator, i.e: { $lt: startingAt }, { $gt: startingAt }, based on the starting point and
     * the order type.
     * @param {any} startingAt The starting value (i.e: ID string or date).
     * @param {OrderTypes} orderDirection The order type, it determines the order of the filter as well. 
     * @returns An object with the filter comparator.
     */
    private getFilterComparator = (startingAt: any, orderDirection?: OrderTypes) => {
        switch(orderDirection) {
            case OrderTypes.ASC:
                return { $gt: startingAt };
            case OrderTypes.DESC:
                return { $lt: startingAt };
            default:
                return startingAt;
        }
    }
}