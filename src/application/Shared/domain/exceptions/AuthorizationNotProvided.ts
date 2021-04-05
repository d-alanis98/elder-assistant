import ErrorWithStatusCode from "./ErrorWithStatusCode";

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.2
 * @desciption Custom exception for not provided authorization method (i.e: Token or cookie value).
 */
 export default class AuthorizationNotProvided extends ErrorWithStatusCode {
    constructor() {
        super('Authorization method not provided');

        this.statusCode = 401;
    }
 }