import NotAuthorized from "../../../Shared/domain/exceptions/NotAuthorized";

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Custom exception to throw when the searched user was not found.
 */
 export default class UserNotAuthenticated extends NotAuthorized {
    public readonly statusCode: number = 401;

    constructor() {
        super('JWT expired or not valid, please login');
        this.statusCode = 401;
    }
}