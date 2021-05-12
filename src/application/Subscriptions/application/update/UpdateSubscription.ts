//Domain
import Subscription from '../../domain/Subscription';
import SubscriptionStatus, { SubscriptionValidStatus } from '../../domain/value-objects/SubscriptionStatus';
import SubscriptionPermissions, { defaultSubscriptionPermissions, SubscriptionPermissionsParameters } from '../../domain/value-objects/SubscriptionPermissions';
//Domain events
import SubscriptionGranted from '../../domain/events/SubscriptionGranted';
//Domain exceptions
import SubscriptionNotFound from '../../domain/exceptions/SubscriptionNotFound';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
import DomainEventsHandler from '../../../Shared/domain/events/DomainEventsHandler';
//Repository contract
import SubscriptionRepository from '../../domain/SubscriptionsRepository';

/**
 * @author Damian Alanis Ramirez
 * @version 2.3.1
 * @description Update subscription use case.
 */
export default class UpdateSubscription {
    private readonly subscriptionsRepository: SubscriptionRepository;

    constructor(subscriptionsRepository: SubscriptionRepository) {
        this.subscriptionsRepository = subscriptionsRepository;
    }

    /**
     * 
     * @param {string} id Id of the subscription.
     * @param {SubscriptionValidStatus} status Status to set in the updated subscription.
     * @param {SubscriptionPermissionsParameters} permissions Permissions to set in the updated subscription.
     */
    updateStatusAndPermissions = async ({
        id,
        status,
        permissions
    }: UpdateSubscriptionParameters): Promise<Subscription> => {
        //We search the subscription
        const subscription: Nullable<Subscription> = await this.subscriptionsRepository.search({ _id: id });
        if(!subscription)
            throw new SubscriptionNotFound();
        //We create the updated subscription
        const updatedSubscription = this.getSubscriptionWithUpdatedStatus(
            subscription, 
            status,
            permissions
        );
        //We update the subscription at the repository level
        await this.subscriptionsRepository.update(updatedSubscription);
        //We invoke the event dispatcher, that will validate if the subscription was accepted to fire the SubscriptionGranted event
        this.dispatchEventIfSubscriptionGranted(updatedSubscription, status);
        //We return the updated subscription
        return updatedSubscription;
    }

    //Internal methods
    /**
     * Method to get a new Subscription aggregate instance with the updated status.
     * @param {Subscription} subscription The subscription to update.
     * @param {SubscriptionValidStatus} subscriptionStatus The received status of the subscription.
     * @param {SubscriptionPermissionsParameters} subscriptionPermissions The received permissions to set in the updated subscription.
     * @returns 
     */
    private getSubscriptionWithUpdatedStatus = (
        subscription: Subscription, 
        subscriptionStatus: SubscriptionValidStatus,
        subscriptionPermissions?: SubscriptionPermissionsParameters
    ) => new Subscription(
        subscription.id,
        subscription.to,
        subscription.from,
        new SubscriptionStatus(subscriptionStatus),
        new SubscriptionPermissions(subscriptionPermissions || defaultSubscriptionPermissions )
    );

    /**
     * Method to generate and dispatch the SubscriptionGranted event if the subscription was accepted.
     * @param {Subscription} subscription The subscription to update.
     * @param {SubscriptionValidStatus} subscriptionStatus The received status of the subscription.
     * @returns 
     */
    private dispatchEventIfSubscriptionGranted = (
        subscription: Subscription, 
        subscriptionStatus: SubscriptionValidStatus
    ) => {
        //We skip this process if the subscription was not accepted
        if(subscriptionStatus !== SubscriptionValidStatus.ACCEPTED)
            return;
        //We add the domain event and dispatch it
        subscription.addDomainEvent(new SubscriptionGranted(subscription));
        DomainEventsHandler.dispatchEventsForAggregate(subscription.id);
    }
}

//Helpers
interface UpdateSubscriptionParameters {
    id: string;
    status: SubscriptionValidStatus;
    permissions?: SubscriptionPermissionsParameters;
}