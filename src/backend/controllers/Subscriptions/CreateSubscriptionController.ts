import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
//Domain events
import SubscriptionGranted from '../../../application/Subscriptions/domain/events/SubscriptionGranted';
import SubscriptionRequestCreated from '../../../application/Subscriptions/domain/events/SubscriptionRequestCreated';
//Event handlers
import OnSubscriptionGranted from '../../../application/Subscriptions/domain/events/handlers/OnSubscriptionGranted';
import OnSubscriptionRequestCreated from '../../../application/Subscriptions/domain/events/handlers/OnSubscriptionRequestCreated';
//Use cases
import CreateSubscription from '../../../application/Subscriptions/application/create/CreateSubscription';
import UpdateSubscription from '../../../application/Subscriptions/application/update/UpdateSubscription';
//Base controller
import Controller from '../Controller';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Helpers
import UserControllerHelpers from '../Shared/User/UserControllerHelpers';
//Dependency injection
import container from '../../dependency-injection';
import { subscriptionsDependencies } from '../../../application/Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 2.4.2
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
            //We get the data from the request
            const from = UserControllerHelpers.getUserIdFromRequest(request);
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

    /**
     * Method to handle the accept or reject subscription request.
     * @param {RequestWithUser} request Express request with user data.
     * @param {Response} response Express response.
     */
    acceptOrRejectSubscription = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const { status, permissions } = request.body;
            const { subscriptionId } = request.params;
            //We get the use case from the dependencies container and execute it
            const createSubscription: UpdateSubscription = container.get(subscriptionsDependencies.UseCases.UpdateSubscription);
            const updatedSubscription: Subscription = await createSubscription.updateStatusAndPermissions({ 
                id: subscriptionId,
                status, 
                permissions
            });
            //We send the updated subscription as response
            response.status(httpStatus.OK).send(updatedSubscription.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Event handlers
    /**
     * We register the event handlers for domain events.
     */
    protected registerEventHandlers() {
        //Subscription request creation event
        this.onDomainEvent(SubscriptionRequestCreated.name, new OnSubscriptionRequestCreated().handle);
        //Subscription granted domain event, fired when a primary user accepts the subscription of a secondary user.
        this.onDomainEvent(SubscriptionGranted.name, OnSubscriptionGranted.handle);
    }

}