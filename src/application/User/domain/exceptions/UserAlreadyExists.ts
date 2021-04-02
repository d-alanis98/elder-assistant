/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Custom exception to throw when we try to create a user that already exists.
 */
export default class UserAlreadyExists extends Error {
    constructor(userId: string) {
        super(`User ${userId} already exists`);
    }
}