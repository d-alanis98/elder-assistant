import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';
import InvalidArgumentError from '../../../Shared/domain/exceptions/InvalidArgumentError';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 */
export default class UserLastName extends StringValueObject {
    public readonly nameLength: number = 40;

    constructor(value: string) {
        super(value);
        this.ensureLengthIsValid(value);
    }

    private ensureLengthIsValid(value: string): void {
        if (value.length > this.nameLength)
            throw new InvalidArgumentError(`The user last name <${ value }> has more than ${ this.nameLength } characters`);

        if(value.length === 0)
            throw new InvalidArgumentError(`The user last name cannot be empty string`);
    }
}