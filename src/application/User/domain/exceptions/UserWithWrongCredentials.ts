/**
 * @author Damián Alanís Ramírez
 * @version 1.1.2
 * @description Custom exception to throw when a user attemps to login with wrong credentials.
 */
 export default class UserWithWrongCredentials extends Error {
    constructor() {
        super(`Wrong credentials, please try again`);
    }
}