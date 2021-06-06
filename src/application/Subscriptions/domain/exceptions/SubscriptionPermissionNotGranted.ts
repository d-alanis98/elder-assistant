import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a requested permission is not granted.
 */
export default class SubscriptionPermissionNotGranted extends ErrorWithStatusCode {
    constructor(permission: string) {
        super(`Subscription permission <${ permission }> not granted`);
        //We set the status code
        this.statusCode = httpStatus.FORBIDDEN;
    }
}