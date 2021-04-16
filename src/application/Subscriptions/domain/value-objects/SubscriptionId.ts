//Base value object
import Uuid from '../../../Shared/domain/value-object/Uuid'

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Subscription ID value object.
 */
export default class SubscriptionId extends Uuid {
    constructor(value: string) {
        super(value);
    }

    /**
     * Method to get an instance of SubscriptionId with a random UUID.
     * @returns Instance of SubscriptionId value object.
     */
    static random = () => new SubscriptionId(
        Uuid.random().value
    );
}