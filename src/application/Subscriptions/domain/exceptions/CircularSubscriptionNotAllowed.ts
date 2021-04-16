import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user attempts to subscribe to itself.
 */
export default class CircularSubscriptionNotAllowed extends ErrorWithStatusCode {
    constructor() {
        super('A user cannot be subscribed to itself');
        this.statusCode = httpStatus.BAD_REQUEST;
    }
}