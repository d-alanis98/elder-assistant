/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @desciption Custom exception for not provided authorization method (i.e: Token or cookie value).
 */
 export default class AuthorizationNotProvided extends Error {
    constructor() {
        super('Authorization method not provided');
    }
 }