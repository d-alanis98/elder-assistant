//Base value object
import Uuid from '../../../Shared/domain/value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Chat ID value object.
 */
export default class ChatId extends Uuid {
    constructor(value: string) {
        super(value);
    }

    /**
     * Method to get an instance of ChatId with a random UUID.
     * @returns Instance of ChatId value object.
     */
     static random = () => new ChatId(
        Uuid.random().value
    );
}