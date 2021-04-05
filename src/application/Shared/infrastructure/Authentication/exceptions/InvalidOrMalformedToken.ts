import NotAuthorized from '../../../domain/exceptions/NotAuthorized';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Custom exception for JWT error caused by invalid or malformed token.
 */
export default class InvalidOrMalformedToken extends NotAuthorized {
    constructor() {
        super('Invalid or malformed token');
    }
}