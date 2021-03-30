/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Util class to describe values with enum type in a consistent way across the app.
 */
export default abstract class EnumValueObject<T> {
    readonly value: T;

    constructor(value: T, public readonly validValues: T[]) {
        this.value = value;
        this.checkValueIsValid(value);
    }

    public checkValueIsValid(value: T): void {
        if (!this.validValues.includes(value)) {
            this.throwErrorForInvalidValue(value);
        }
    }

    protected abstract throwErrorForInvalidValue(value: T): void;
}
