import StringValueObject from '../../Shared/domain/value-object/StringValueObject';
import InvalidArgumentError from '../../Shared/domain/value-object/InvalidArgumentError';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 */
export default class UserName extends StringValueObject {
    public readonly nameLength: number = 30;

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