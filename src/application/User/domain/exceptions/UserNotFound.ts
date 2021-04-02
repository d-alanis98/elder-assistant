/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Custom exception to throw when the searched user was not found.
 */
 export default class UserNotFound extends Error {
    constructor(userId: string) {
        super(`User ${userId} not found`);
    }
}