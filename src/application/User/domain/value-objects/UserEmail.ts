import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.0.1
 * @description User email value object.
 */
export default class UserEmail extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}