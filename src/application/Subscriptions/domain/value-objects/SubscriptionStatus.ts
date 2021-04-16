import EnumValueObject from '../../../Shared/domain/value-object/EnumValueObject';
//Domain exceptions
import SubscriptionStatusNotValid from '../exceptions/SubscriptionStatusNotValid';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Value object that describes the subscription status (accepted or rejected).
 */
export default class SubscriptionStatus extends EnumValueObject<string> {

    constructor(status: string) {
        super(status, Object.values(SubscriptionValidStatus));
    }

    /**
     * Method to handle the validation error.
     */
    throwErrorForInvalidValue = () => {
        throw new SubscriptionStatusNotValid();
    }

    //Facade
    /**
     * Method to get an instance of SubscriptionStatus with pending status.
     * @returns Instance with pending status.
     */
    static withPendingStatus = () => new SubscriptionStatus(SubscriptionValidStatus.PENDING);

    /**
     * Method to get an instance of SubscriptionStatus with accepted status.
     * @returns Instance with accepted status.
     */
    static withAcceptedStatus = () => new SubscriptionStatus(SubscriptionValidStatus.ACCEPTED);
}

//Valid status values
export enum SubscriptionValidStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
}
