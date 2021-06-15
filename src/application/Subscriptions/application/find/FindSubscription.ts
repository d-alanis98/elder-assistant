//Domain
import Subscription, { SubscriptionRequestPrimitives } from '../../domain/Subscription';
import { SubscriptionValidStatus } from '../../domain/value-objects/SubscriptionStatus';
//Shared
import { Nullable } from '../../../Shared/domain/Nullable';
//Exceptions
import SubscriptionNotFound from '../../domain/exceptions/SubscriptionNotFound';
//Repository contract
import SubscriptionRepository from '../../domain/SubscriptionsRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.7.5
 * @description Find subscription use case.
 */
export default class FindSubscription {
    readonly subscriptionRepository: SubscriptionRepository;

    constructor(subscriptionRepository: SubscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} to Id of the target user.
     * @param {string} from Id of the subscriber. 
     * @returns 
     */
    run = async ({
        to, 
        from
    }: SubscriptionRequestPrimitives) => (
        this.searchInRespository({ 
            to, 
            from 
        })
    );
    /**
     * Method to search the subscription record in the repository by its id.
     * @param {string} id Id of the subscription.
     * @returns 
     */
    searchById = async (id: string): Promise<Subscription> => (
        await this.searchInRespository({ _id: id })
    );

    /**
     * Method to search the subscription record in the repository.
     * @param {string} to Id of the target user.
     * @param {string} from Id of the subscriber. 
     * @returns 
     */
    searchByMembers = async ({
        to, 
        from
    }: SubscriptionRequestPrimitives) => this.subscriptionRepository.search({ to, from });


    /**
     * Method to get all the accepted subscriptors of a primary user.
     * @param {string} to Target user ID.
     * @returns 
     */
    getAllAcceptedSubscriptions = async (to: string): Promise<Subscription[]> => {
        const subscriptions = await this.subscriptionRepository.searchAll({
            to,
            status: SubscriptionValidStatus.ACCEPTED
        });
        if(!subscriptions)
            throw new SubscriptionNotFound();
        return subscriptions;
    };

    /**
     * Method to get the subscription requests made by a user.
     * @param {string} from Id of the user.
     * @returns 
     */
    getMadeRequests = async (from: string, {
        status,
    }: FindSubscriptionFilters): Promise<Subscription[]> => (
        this.searchAllInRepository({ from, status })
    );

    /**
     * Method to get the subscription requests received by a primary user.
     * @param {string} to Id of the target user.
     * @returns 
     */
    getReceivedRequests = async (to: string, {
        status,
    }: FindSubscriptionFilters): Promise<Subscription[]> => (
        this.searchAllInRepository({ to, status })
    );

    //Internal helpers
    /**
     * Method to search the subscription in the repository, applying the provided query filter.
     * @param {Object} filter Query filter.
     * @returns 
     */
    private searchInRespository = async (filter: Object): Promise<Subscription> => {
        const subscription: Nullable<Subscription> = await this.subscriptionRepository.search(filter);
        if(!subscription)
            throw new SubscriptionNotFound();
        return subscription;
    }

    /**
     * Method to search all the subscription in the repository matching the provided query filter.
     * @param {Object} filter Query filter.
     * @returns 
     */
    private searchAllInRepository = async (filter: Object): Promise<Subscription[]> => {
        const subscription: Nullable<Subscription[]> = await this.subscriptionRepository.searchAll(filter);
        if(!subscription)
            throw new SubscriptionNotFound();
        return subscription;
    }
}

interface FindSubscriptionFilters {
    status?: string;
}