import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Use cases
import CreateSubscription from '../../../application/Subscriptions/application/create/CreateSubscription';
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
 * @version 1.1.1
 * @description Controller to handle the create subscription request.
 */
export default class CreateSubscriptionController extends Controller {
    /**
     * Entry point for the controller.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We validate the user in the request
            if(!request.user)
                throw new UserNotAuthenticated();
            //We get the data from the request
            const { _id: from } = request.user;
            const { userId: to } = request.params;
            //We get the use case from the dependencies container and execute it
            const createSubscription: CreateSubscription = container.get(subscriptionsDependencies.UseCases.CreateSubscription);
            const subscription: Subscription = await createSubscription.run({ to, from });
            //We send the subscription details in the response
            response.status(httpStatus.OK).send(subscription.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }
}