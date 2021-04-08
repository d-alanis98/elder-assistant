import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';
import InvalidArgumentError from '../../../Shared/domain/exceptions/InvalidArgumentError';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.2
 * @description User name value object.
 */
export default class UserName extends StringValueObject {
    public readonly nameLength: number = 25;

    constructor(value: string) {
        super(value);
        this.ensureLengthIsValid(value);
    }

    private ensureLengthIsValid(value: string): void {
        if (value.length > this.nameLength)
            throw new InvalidArgumentError(`The user name <${ value }> has more than ${ this.nameLength } characters`);

        if(value.length === 0)
            throw new InvalidArgumentError(`The user name cannot be empty string`);
    }
}