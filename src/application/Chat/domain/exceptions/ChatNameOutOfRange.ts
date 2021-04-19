//Domain
import ChatName from '../value-objects/ChatName';
//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @descritpion Custom exception to throw when the chat name is not in the valid length range.
 */
export default class ChatNameOutOfRange extends ErrorWithStatusCode {
    constructor() {
        super(`Chat name is not in the valid length range (less than ${ChatName.MAX_LENGTH} characters)`);
        this.statusCode = 400;
    }
}