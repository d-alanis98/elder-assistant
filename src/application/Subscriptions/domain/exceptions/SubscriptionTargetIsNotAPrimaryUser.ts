import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user attempts to subscribe to a user that is not a primary user.
 */
export default class SubscriptionTargetIsNotAPrimaryUser extends ErrorWithStatusCode {
    constructor() {
        super('Subscription target is not a primary user');
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}