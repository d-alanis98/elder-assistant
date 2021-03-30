import Filters from './Filters';
import Order from './Order';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Class that represents a criteria of a query or any other type of command, the main parameters of it are filters 
 * and order to apply. 
 */
export default class Criteria {
    readonly filters: Filters;
    readonly order: Order;
    readonly limit?: number;
    readonly offset?: number;

    constructor(filters: Filters, order: Order, limit?: number, offset?: number) {
        this.filters = filters;
        this.order = order;
        this.limit = limit;
        this.offset = offset;
    }

    public hasFilters(): boolean {
        return this.filters.filters.length > 0;
    }
}