//Subscription domain
import Subscription from '../Subscription';
//Domain events
import DomainEvent from '../../../Shared/domain/events/DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event that is emitted when a subscription is granted.
 */
export default class SubscriptionGranted extends DomainEvent {
    readonly subscription: Subscription;

    constructor(subscription: Subscription) {
        super();
        this.subscription = subscription;
    }

    getAggregateId = () => this.subscription.id; 
}