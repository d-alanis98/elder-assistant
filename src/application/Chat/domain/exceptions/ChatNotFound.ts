import httpStatus from 'http-status';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Exception to throw when no chat or chats are found for a user.
 */
export default class ChatNotFound extends ErrorWithStatusCode {
    constructor() {
        super('Chat/s not found for the user');
         
        this.statusCode = httpStatus.NOT_FOUND;
    }
}