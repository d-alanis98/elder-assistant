import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Custom exception to throw when the provided subscription status is not valid.
 */
export default class SubscriptionStatusNotValid extends ErrorWithStatusCode {
    constructor(status?: string) {
        super(`Subscription status ${ status ? `[${ status }]` : '' } not valid`);
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}