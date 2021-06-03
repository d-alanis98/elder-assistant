import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Custom exception to throw when the provided notification type is not valid.
 */
export default class NotificationTypeNotValid extends ErrorWithStatusCode {
    constructor(notificationType?: string) {
        super(`Notification of type <${ notificationType }> is not valid`);
        //We set the error code
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}