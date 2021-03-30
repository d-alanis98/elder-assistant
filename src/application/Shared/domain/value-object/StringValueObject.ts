
/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Util class to describe values with string type in a consistent way across the app.
 */
export default abstract class StringValueObject {
    readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    toString(): string {
        return this.value;
    }
}
