import FilterField from './FilterField';
import FilterOperator from './FilterOperator';
import FilterValue from './FilterValue';
//Exceptions
import InvalidArgumentError from '../value-object/InvalidArgumentError';

export interface FilterFromStringValues {
    field: string,
    value: string,
    operator: string,
}

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Abstraction of a filter for a query or command.
 */
export default class Filter {
    readonly field: FilterField;
    readonly value: FilterValue;
    readonly operator: FilterOperator;
    

    constructor(field: FilterField, operator: FilterOperator, value: FilterValue) {
        this.field = field;
        this.value = value;
        this.operator = operator;
    }

    static fromValues({
        field,
        value,
        operator,
    }: FilterFromStringValues): Filter {

        if (!field || !operator || !value) 
            throw new InvalidArgumentError(`The filter is invalid`);

        return new Filter(new FilterField(field), FilterOperator.fromValue(operator), new FilterValue(value));
    }
}