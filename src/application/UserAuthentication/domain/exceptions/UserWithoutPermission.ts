import NotAuthorized from "../../../Shared/domain/exceptions/NotAuthorized";

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when the user does not have the valid role to perform an action.
 */
 export default class UserWithoutPermission extends NotAuthorized {
    public readonly statusCode: number = 403;

    constructor() {
        super('Not authorized for this User');
        this.statusCode = 403;
    }
}