import Filter, { FilterFromStringValues } from './Filter';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Class that represents the collection of filters applied to a query or command.
 */
export default class Filters {
  readonly filters: Filter[];

  constructor(filters: Filter[]) {
    this.filters = filters;
  }

  static fromValues(filters: Array<FilterFromStringValues>): Filters {
    return new Filters(filters.map(Filter.fromValues));
  }

  static none(): Filters {
    return new Filters([]);
  }
}
