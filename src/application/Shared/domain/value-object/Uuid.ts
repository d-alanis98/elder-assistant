import { v4 as uuidv4 } from 'uuid';
import validate from 'uuid-validate';
import InvalidArgumentError from './InvalidArgumentError';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 */
export default class Uuid {
    readonly value: string;

    constructor(value: string) {
        //We validate the uuid
        this.ensureIsValidUuid(value);
        //We set it
        this.value = value;
    }

    static random(): Uuid {
        return new Uuid(uuidv4());
    }

    private ensureIsValidUuid(id: string): void {
        if (!validate(id)) {
            throw new InvalidArgumentError(`<${ this.constructor.name }> does not allow the value <${ id }>`);
        }
    }

    toString(): string {
        return this.value;
    }
}
