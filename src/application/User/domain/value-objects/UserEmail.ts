import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.0.1
 */
export default class UserEmail extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}