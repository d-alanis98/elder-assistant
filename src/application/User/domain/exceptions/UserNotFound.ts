/**
 * @author Damián Alanís Ramírez
 * @version 1.1.2
 * @description Custom exception to throw when the searched user was not found.
 */
 export default class UserNotFound extends Error {
    constructor() {
        super(`User not found`);
    }
}