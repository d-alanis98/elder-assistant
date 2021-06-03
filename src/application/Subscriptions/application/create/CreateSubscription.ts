//Subscription domain
import Subscription, { SubscriptionRequestPrimitives } from '../../domain/Subscription';
//Domain events
import SubscriptionRequestCreated from '../../domain/events/SubscriptionRequestCreated';
//User domain
import UserId from '../../../Shared/domain/modules/User/UserId';
//User context
import User from '../../../User/domain/User';
import UserFinder from '../../../User/application/find/UserFinder';
import { AllowedUserTypes } from '../../../User/domain/value-objects/UserType';
//Use cases
import FindSubscription from '../find/FindSubscription';
//Shared domains
import { Nullable } from '../../../Shared/domain/Nullable';
import DomainEventsHandler from '../../../Shared/domain/events/DomainEventsHandler';
//Exceptions
import SubscriptionAlreadyExists from '../../domain/exceptions/SubscriptionAlreadyExists';
import CircularSubscriptionNotAllowed from '../../domain/exceptions/CircularSubscriptionNotAllowed';
import SubscriptionTargetIsNotAPrimaryUser from '../../domain/exceptions/SubscriptionTargetIsNotAPrimaryUser';
//Repository contracts
import UserRepository from '../../../User/domain/UserRepository';
import SubscriptionRepository from '../../domain/SubscriptionsRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 3.4.4
 * @description Create subscription use case.
 */
export default class CreateSubscription {
    readonly userRepository: UserRepository;
    readonly subscriptionRepository: SubscriptionRepository;

    constructor(
        userRepository: UserRepository,
        subscriptionRepository: SubscriptionRepository
    ) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} to Id of the user that receives the subscription request.
     * @param {string} from Id of the user that is subscribing. 
     * @returns 
     */
    public run = async ({
        to,
        from
    }: SubscriptionRequestPrimitives): Promise<Subscription> => {
        //We perform some validations, like non existance of circular subscription or subscription to a user that is not a primary user.
        await this.validateTargetUserIsPrimaryUser(to);
        this.validateSubscriberUserDifferentFromTarget(to, from);
        await this.validateSubscriptionDoesNotExist(to, from);
        //We create the subscription entity
        const subscription = new Subscription(
            null,
            new UserId(to),
            new UserId(from)
        );
        await this.subscriptionRepository.create(subscription);
        //We invoke the event dispatcher, that will validate if the subscription was accepted to fire the SubscriptionGranted event
        this.dispatchSubscriptionCreatedEvent(subscription);
        return subscription;
    }

    //Internal helpers
    /**
     * Method to validate that the target user and the subscriber are not the same.
     * @param {string} to Id of the target user.
     * @param {string} from Id of the subscriber. 
     */
    private validateSubscriberUserDifferentFromTarget = (to: string, from: string) => {
        if(from === to)
            throw new CircularSubscriptionNotAllowed();
    }

    /**
     * Method to validate that the target user is of primary type.
     * @param {string} to Id of the target user.
     */
    private validateTargetUserIsPrimaryUser = async (to: string) => {
        //We set up the user finder use case
        const userFinder: UserFinder = new UserFinder(this.userRepository);
        //We search the user by it's ID
        const user: User = await userFinder.find(to);
        //We validate the user type, it must be 
        if(user.type.value !== AllowedUserTypes.PRIMARY)
            throw new SubscriptionTargetIsNotAPrimaryUser();
    }

    /**
     * Method to validate that the subscription is new.
     * @param {string} to Id of the target user.
     * @param {string} from Id of the subscriber. 
     */
    private validateSubscriptionDoesNotExist = async (to: string, from: string) => {
        const findSubscription: FindSubscription = new FindSubscription(this.subscriptionRepository);
        const subscription: Nullable<Subscription> = await findSubscription.searchByMembers({ to, from });
        if(subscription)
            throw new SubscriptionAlreadyExists();
    }

    /**
     * Method to generate and dispatch the SubscriptionRequestCreated event.
     * @param {Subscription} subscription The created subscription.
     * @returns 
     */
    private dispatchSubscriptionCreatedEvent = (subscription: Subscription) => {
        //We add the domain event and dispatch it
        subscription.addDomainEvent(new SubscriptionRequestCreated(subscription));
        DomainEventsHandler.dispatchEventsForAggregate(subscription.id);
    }
}