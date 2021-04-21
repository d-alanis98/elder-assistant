//Base value object
import DateValueObject from '../../../Shared/domain/value-object/DateValueObject';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Chat message date value object.
 */
export default class ChatMessageDate extends DateValueObject {
    constructor(date: string | Date | number) {
        super(date);
    }

    /**
     * We override the toString method to get the ISO string date suitable for most of the Database Managers
     * @returns The ISO string date
     */
    toString = () => this.toISOString();

    /**
     * Method to return a value object instance with the current date.
     * @returns An instance of the value object with the current date.
     */
    static current = () => new ChatMessageDate(DateValueObject.current());
}