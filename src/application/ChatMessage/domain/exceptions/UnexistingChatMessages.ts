//Base exception
import ErrorWithStatusCode from '../../../Shared/domain/exceptions/ErrorWithStatusCode';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Custom exception to throw when there are no chat messages.
 */
export default class UnexistingChatMessages extends ErrorWithStatusCode {
    constructor() {
        super('Unexisting chat messages');
        this.statusCode = 404;
    }
}