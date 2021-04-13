/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Interface to use when retrieving results from the findAllPaginated method of the respository. 
 * Useful, for example, if we need to map the data and transform it to primitive values while keeping the types validation, because
 * findAllPaginated returns Nullable<any>.
 */
export default interface PaginatedDataResult<T = any> {
    data: T[],
    next: any;
}
