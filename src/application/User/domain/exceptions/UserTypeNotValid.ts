/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Custom exception to throw when we try to create a non valid user type.
 */
 export default class UserTypeNotValid extends Error {
    constructor(userType: string) {
        super(`User type <${userType}> is not valid`);
    }
}