import DateValueObject from '../../../Shared/domain/value-object/DateValueObject';

/**
 * @author Damian Alanis Ramirez
 * @version 1.2.4
 * @description User date of birth value object.
 */
export default class UserDateOfBirth extends DateValueObject {
    /**
     * We override the toString method to get the ISO string date suitable for most of the Database Managers
     * @returns The ISO string date
     */
    toString = (): string => this.toISOString();
}