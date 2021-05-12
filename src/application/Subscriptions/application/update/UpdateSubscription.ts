//Domain
import Subscription from '../../domain/Subscription';
import SubscriptionStatus, { SubscriptionValidStatus } from '../../domain/value-objects/SubscriptionStatus';
import SubscriptionPermissions, { defaultSubscriptionPermissions, SubscriptionPermissionsParameters } from '../../domain/value-objects/SubscriptionPermissions';
//Domain exceptions
import SubscriptionNotFound from '../../domain/exceptions/SubscriptionNotFound';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import SubscriptionRepository from '../../domain/SubscriptionsRepository';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
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
        //We return the updated subscription
        return updatedSubscription;
    }

    //Internal methods
    /**
     * Method to get a new Subscription aggregate instance with the updated status.
     * @param {Subscription} subscription The subscription to update.
     * @param {SubscriptionValidStatus} subscriptionStatus The received status of the subscription.
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
}

//Helpers
interface UpdateSubscriptionParameters {
    id: string;
    status: SubscriptionValidStatus;
    permissions?: SubscriptionPermissionsParameters;
}