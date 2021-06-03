import Uuid from '../../../Shared/domain/value-object/Uuid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Notification ID value object.
 */
export default class NotificationId extends Uuid {
    constructor(value: string) {
        super(value);
    }

    /**
     * Method to get an instance of NotificationId with a random UUID.
     * @returns {NotificationId}
     */
     static random = () => new NotificationId(
        Uuid.random().value
    );
}