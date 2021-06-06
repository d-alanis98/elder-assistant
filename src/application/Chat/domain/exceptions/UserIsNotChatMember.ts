import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when a user that is not a chat member attempts to perform an operation over it or
 * to retrieve data from it.
 */
export default class UserIsNotChatMember extends ErrorWithStatusCode {
    constructor() {
        super('This operation is only allowed for chat members');
        //We set the status code
        this.statusCode = httpStatus.FORBIDDEN;
    }
}