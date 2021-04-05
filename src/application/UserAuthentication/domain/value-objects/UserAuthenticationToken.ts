import StringValueObject from '../../../Shared/domain/value-object/StringValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description User authentication token value object.
 */
export default class UserAuthenticationToken extends StringValueObject {
    constructor(value: string) {
        super(value);
    }
}