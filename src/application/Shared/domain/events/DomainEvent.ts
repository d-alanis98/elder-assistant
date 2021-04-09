import StringValueObject from '../value-object/StringValueObject';


/**
 * @author Damián Alanís Ramírez
 * @version 2.1.1
 * @description Domain event specification.
 */
export default abstract class DomainEvent {
    readonly dateTimeOccurred: Date;

    constructor() {
        this.dateTimeOccurred = new Date();
    }

    abstract getAggregateId(): StringValueObject;
}