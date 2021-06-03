import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Custom exception to throw when the notification was not found.
 */
export default class NotificationNotFound extends ErrorWithStatusCode {
    constructor() {
        super('Notification not found');
        //We set the status code
        this.statusCode = httpStatus.NOT_FOUND;
    }

}