import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a primary user that is not the owner of the chat attempts to perform an operation
 * on it.
 */
export default class UserIsNotChatOwner extends ErrorWithStatusCode {
    constructor() {
        super('User is not the chat owner');
        //We set the status code
        this.statusCode = httpStatus.FORBIDDEN;
    }
}