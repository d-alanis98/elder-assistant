import { NextFunction, Response } from 'express';
//Domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Domain exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
import SubscriptionNotFound from '../../../application/Subscriptions/domain/exceptions/SubscriptionNotFound';
import UserWithoutPermission from '../../../application/UserAuthentication/domain/exceptions/UserWithoutPermission';
//use cases
import FindSubscription from '../../../application/Subscriptions/application/find/FindSubscription';
//Dependency injection
import container from '../../dependency-injection';
import { subscriptionsDependencies } from '../../../application/Shared/domain/constants/dependencies';
//Request with additional data
import { RequestWithUser } from '../User/UserAuthentication';


/**
 * @author Damian Alanis Ramirez
 * @version 1.2.1
 * @description Express subscription validation middleware.
 */
export default class SubscriptionValidation {
    /**
     * Middleware to validate the ownership of the subscription by the user.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     * @param {NextFunction} next Express next function.
     */
    static verifySubscriptionOwnership = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
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
        } catch(error) {
            next(error);
        }
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
        const subscription = await findSubscription.searchById(subscriptionId);
        //We validate the result
        if(!subscription)
            throw new SubscriptionNotFound();
        return subscription;
    }
}