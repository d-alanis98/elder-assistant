import ErrorWithStatusCode from './ErrorWithStatusCode';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.2
 * @desciption Custom exception for not provided authorization method (i.e: Token or cookie value).
 */
 export default class NotAuthorized extends ErrorWithStatusCode {
    constructor(message: string) {
        super(message);
        this.statusCode = 401;
    }
 }