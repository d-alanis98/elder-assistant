/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification content value object
 */
export default class NotificationContent<T = any> {
    private readonly _value: T;

    constructor(value: T) {
        this._value = value;
    }

    public get value() {
        return this._value;
    }

}