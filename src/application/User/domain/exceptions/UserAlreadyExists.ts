/**
 * @author Damián Alanís Ramírez
 * @version 1.1.2
 * @description Custom exception to throw when we try to create a user that already exists.
 */
export default class UserAlreadyExists extends Error {
    constructor() {
        super(`User already exists, please login`);
    }
}