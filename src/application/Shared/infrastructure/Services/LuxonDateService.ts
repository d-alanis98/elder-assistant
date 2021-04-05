import { DateTime } from 'luxon';
//Domain
import DateService from '../../domain/services/DateService';

/**
 * @author Damian Alanis Ramirez
 * @version 1.5.7
 * @description Class that implements the DateService interface, and makes use 
 * of luxon library for the implementation.
 */
export default class LuxonDateService implements DateService<DateTime> {
    private readonly dateTime: DateTime;

    //Constructor overload
    constructor(dateOrISOString?: string | Date) {
        if(dateOrISOString instanceof Date)
            this.dateTime = DateTime.fromJSDate(dateOrISOString);
        else if(typeof dateOrISOString === 'string')
            this.dateTime = DateTime.fromISO(dateOrISOString);
        else this.dateTime = DateTime.now();
    }
    /**
     * Method that generates a luxon DateTime from an ISO date string.
     * @param {string} isoString ISO date string.
     * @returns 
     */
    fromISOString = (isoString: string): DateTime => (
        DateTime.fromISO(isoString)
    );

    /**
     * Method to get the ISO string date.
     * @returns ISO string date.
     */
    toString = (): string => (
        this.dateTime.toISO()
    );

    //Factory
    /**
     * Factory method to create a new LuxonDateService instance.
     * @param from Value from which we are going to create a new LuxonDateService instance.
     * @returns 
     */
    static create = (from?: any) => new LuxonDateService(from);

    //Helpers
    /**
     * Method that gets the age based on the year difference from now to the date
     * stored in the instance state.
     * @returns The age;
     */
    getAge = (): number => Math.floor(
        Math.abs(
            this.dateTime.diffNow('years').years
        )
    );
}

