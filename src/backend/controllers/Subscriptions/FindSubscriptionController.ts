import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Use cases
import FindSubscription from '../../../application/Subscriptions/application/find/FindSubscription';
//Base controller
import Controller from '../Controller';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
//Dependency injection
import container from '../../dependency-injection';
import { subscriptionsDependencies } from '../../../application/Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Controller to handle the find subscription request.
 */
export default class FindSubscriptionController extends Controller {
    /**
     * Entry point for the controller.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const from = this.getRequestUserId(request);
            const { userId: to } = request.params;
            //We get the use case from the dependencies container and execute it
            const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
            const subscription: Subscription = await findSubscription.run({ to, from });
            //We send the subscription details in the response
            response.status(httpStatus.OK).send(subscription.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * Method to get the subscription requests received by a primary user.
     * @param {RequestWithUser} request Request with user data.
     * @param {Response} response Express response.
     */
    getSubscriptionRequests = async (request: RequestWithUser, response: Response) => {
        try {
            //We get data from the request
            const to: string = this.getRequestUserId(request);
            const { status } = request.query;
            const subscriptionStatus: string | undefined = status?.toString();
            //We get the use case from the dependencies container and execute it
            const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
            const subscription: Subscription[] = await findSubscription.getReceivedRequests(to, { status: subscriptionStatus });
            //We send the subscription details in the response
            response.status(httpStatus.OK).send(
                subscription.map(subscription => subscription.toPrimitives())
            );
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    /**
     * Method to get all the subscriptions requested by a user.
     * @param {RequestWithUser} request Request with user data.
     * @param {Response} response Express response.
     */
    getRequestedSubscriptions = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const from: string = this.getRequestUserId(request);
            const { status } = request.query;
            const subscriptionStatus: string | undefined = status?.toString();
            //We get the use case from the dependencies container and execute it
            const findSubscription: FindSubscription = container.get(subscriptionsDependencies.UseCases.FindSubscription);
            const subscription: Subscription[] = await findSubscription.getMadeRequests(from, { status: subscriptionStatus });
            //We send the subscription details in the response
            response.status(httpStatus.OK).send(
                subscription.map(subscription => subscription.toPrimitives())
            );
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Internal helpers
    /**
     * Method to get the user ID form the user request data.
     * @param {RequestWithUser} request Request with user data.
     * @returns 
     */
    private getRequestUserId = (request: RequestWithUser) => {
        //We validate the user in the request
        if(!request.user)
            throw new UserNotAuthenticated();
        //We get the data from the request
        return request.user._id;
    }
}