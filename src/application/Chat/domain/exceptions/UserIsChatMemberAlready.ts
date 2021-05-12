//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @descritpion Custom exception to throw when the user is already member of the chat.
 */
export default class UserIsChatMemberAlready extends ErrorWithStatusCode {
    constructor() {
        super('The user is a chat member already');
        this.statusCode = 500;
    }
}