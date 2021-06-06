import { NextFunction, Response } from 'express';
//Domain
import Subscription, { SubscriptionPrimitives } from '../../../application/Subscriptions/domain/Subscription';
//Domain exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
import SubscriptionNotFound from '../../../application/Subscriptions/domain/exceptions/SubscriptionNotFound';
import UserWithoutPermission from '../../../application/UserAuthentication/domain/exceptions/UserWithoutPermission';
//use cases
import FindSubscription from '../../../application/Subscriptions/application/find/FindSubscription';
//Request with additional data
import { RequestWithUser } from '../User/UserAuthentication';
//Controller helpers
import UserControllerHelpers from '../../controllers/Shared/User/UserControllerHelpers';
//Dependency injection
import container from '../../dependency-injection';
import { subscriptionsDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 2.4.1
 * @description Express subscription validation middleware.
 */
export default class SubscriptionValidation {

    /**
     * Middleware to validate that the secondary user has an active subscription to a primary user
     * @param {RequestWithSubscription} request Express request with user data.
     * @param {Response} _ Express response.
     * @param {NextFunction} next Express next function.
     */
    static verifySubscription = async (
        request: RequestWithSubscription,
        _: Response,
        next: NextFunction
    ) => {
        //We extract the primary user ID from the request parameters or body
        const primaryUserId = request.params.primaryUserId || request.body.primaryUserId;
        //We extract the secondary user ID form the user data attached from the token
        const secondaryUserId = UserControllerHelpers.getUserIdFromRequest(request);
        //We validate the primary user ID
        if(!primaryUserId)
            throw new SubscriptionNotFound();
        //We get the subscription by members
        const subscription = await SubscriptionValidation.findSubscriptionByMembers(primaryUserId, secondaryUserId);
        //We add the subscription data to the request
        request.subscription = subscription.toPrimitives();
        next();
    }

    /**
     * Middleware to validate the ownership of the subscription by the user.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static verifySubscriptionOwnership = async (
        request: RequestWithUser, 
        _: Response, 
        next: NextFunction
    ) => {
        if(!request.user)
            throw new UserNotAuthenticated();
        //We get data from the request
        const { _id: to } = request.user;
        //We get the subscription by Id
        const subscription = await SubscriptionValidation.findSubscriptionByIdInRequest(request);
        //We validate the ownership, if the subscription is not pointing to the current user, we generate an exception
        if(subscription.to.toString() !== to)
            throw new UserWithoutPermission();
        next();
    }

    //Internal helpers
    /**
     * Method to get a subscription by it's ID present in the request URL parameters.
     * @param {RequestWithUser} request Express request with user data.
     * @returns 
     */
    private static findSubscriptionByIdInRequest = async (request: RequestWithUser): Promise<Subscription> => {
        //We get data from the request
        const { subscriptionId } = request.params;
        //We search the subscription
        const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
        return await findSubscription.searchById(subscriptionId);
    }

    /**
     * Method to get a subscription by it's members.
     * @param {string} to ID of the target user of the subscription.
     * @param {string} from ID of the secondary user that requested the subscription.
     * @returns 
     */
    private static findSubscriptionByMembers = async(to: string, from: string): Promise<Subscription> => {
        //We search the subscription
        const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
        const subscription = await findSubscription.searchByMembers({ to, from });
        //We validate the result
        if(!subscription)
            throw new SubscriptionNotFound();
        return subscription;
    }
}

//Types
export interface RequestWithSubscription extends RequestWithUser {
    subscription?: SubscriptionPrimitives;
}