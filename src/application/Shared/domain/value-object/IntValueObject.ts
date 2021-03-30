
/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Util class to describe values with numeric type in a consistent way across the app.
 */
export default abstract class NumberValueObject {
    readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    equalsTo(other: NumberValueObject): boolean {
        return this.value === other.value;
    }

    isBiggerThan(other: NumberValueObject): boolean {
        return this.value > other.value;
    }
}
