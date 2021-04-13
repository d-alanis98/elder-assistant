import ErrorWithStatusCode from "./ErrorWithStatusCode"

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Exception to throw on server or execution error.
 */
export default class InternalServerError extends ErrorWithStatusCode {
    constructor() {
        super('Internal Server Error');
        this.statusCode = 500;
    }
}