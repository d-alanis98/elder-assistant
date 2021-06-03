import DateValueObject from '../../../Shared/domain/value-object/DateValueObject';


/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification date value object.
 */
export default class NotificationIssueDate extends DateValueObject {
    /**
     * We override the toString method to get the ISO string date suitable for most of the Database Managers
     * @returns The ISO string date
     */
    toString = () => this.toISOString();

    /**
     * Method to return a value object instance with the current date.
     * @returns {NotificationIssueDate}
     */
    static current = () => new NotificationIssueDate(DateValueObject.current());
}