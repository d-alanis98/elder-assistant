//Base value object
import Uuid from '../../../Shared/domain/value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Chat message ID value object.
 */
export default class ChatMessageId extends Uuid {
    constructor(value: string) {
        super(value);
    }

    /**
     * Method to get an instance of ChatMessageId with a random UUID.
     * @returns Instance of ChatMessageId value object.
     */
     static random = () => new ChatMessageId(
        Uuid.random().value
    );
}