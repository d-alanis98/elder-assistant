/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Custom exception to throw when validation (custom or from third party) fails.
 */
 export default class NotValidParameters extends Error {
    errors: any[] | undefined;

    constructor(errors?: any[]) {
        super(`Not valid parameters`);
        this.errors = errors;
    }   
}