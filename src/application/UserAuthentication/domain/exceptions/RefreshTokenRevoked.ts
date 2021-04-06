import NotAuthorized from "../../../Shared/domain/exceptions/NotAuthorized";

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom exception to throw when the searched user was not found.
 */
 export default class RefreshTokenRevoked extends NotAuthorized {
    public readonly statusCode: number = 401;

    constructor() {
        super('JWT refresh token was revoked or has already expired');
        this.statusCode = 401;
    }
}