import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when the provided subscription permissions object is not valid.
 */
export default class SubscriptionPermissionsNotValid extends ErrorWithStatusCode {
    constructor() {
        super(`Subscription permissions not valid`);
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}