import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode'

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user attemp to request a subscription that already exists.
 */
export default class SubscriptionAlreadyExists extends ErrorWithStatusCode {
    constructor() {
        super('Subscription request already made');
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}