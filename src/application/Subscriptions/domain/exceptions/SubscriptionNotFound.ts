import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a subscription does not exist.
 */
export default class SubscriptionNotFound extends ErrorWithStatusCode {
    constructor() {
        super('Subscription not found');
        this.statusCode = 404;
    }
}