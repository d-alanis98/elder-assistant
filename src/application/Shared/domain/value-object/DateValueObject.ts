/**
 * @author Damian Alanis Ramirez
 * @version 2.3.1
 * @description Date value object for shared use across the app.
 */
export default class DateValueObject extends Date {
    /**
     * Facade methdo to get the current date.
     * @returns {Date} Current date.
     */
    static current = () => new Date();

    //This time we don't hardcode a value like 1970 or the next Epoch year when the current causes overflow in dates
    static getEpochYear = () => new Date(0).getUTCFullYear(); 

}