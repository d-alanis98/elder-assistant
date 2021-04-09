import EnumValueObject from '../../../Shared/domain/value-object/EnumValueObject';
import UserTypeNotValid from '../exceptions/UserTypeNotValid';

//Allowed user types
export enum AllowedUserTypes {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    ADMINISTRATOR = 'ADMINISTRATOR'
}

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 */
export default class UserType extends EnumValueObject<string> {
    
    constructor(userType: string) {
        super(userType, Object.values(AllowedUserTypes));
    }

    throwErrorForInvalidValue = (userType: string) => {
        throw new UserTypeNotValid(userType);
    }
}