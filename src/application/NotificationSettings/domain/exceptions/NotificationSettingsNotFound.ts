import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Custom exception to throw when a notification settings entry was not found.
 */
export default class NotificationSettingsNotFound extends ErrorWithStatusCode {
    constructor() {
        super('Notification settings entry not found');
        //We set the status code
        this.statusCode = httpStatus.NOT_FOUND;
    }
}