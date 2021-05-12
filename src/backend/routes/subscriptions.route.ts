import { Router } from 'express';
//Middlewares
import UserAuthorization from '../middleware/User/UserAuthorization';
import UserAuthentication from '../middleware/User/UserAuthentication';
import SubscriptionValidation from '../middleware/Subscription/SubscriptionValidation';
//Dependency injection
import container from '../dependency-injection';
import { subscriptionsDependencies } from '../../application/Shared/domain/constants/dependencies';
//Controllers
import FindSubscriptionController from '../controllers/Subscriptions/FindSubscriptionController';
import CreateSubscriptionController from '../controllers/Subscriptions/CreateSubscriptionController';

export const register = (router: Router) => {
    //Create subscription
    const createSubscriptionController: CreateSubscriptionController = container.get(subscriptionsDependencies.Controllers.CreateSubscriptionController);
    router.post(
        '/user/:userId/subscribe',
        UserAuthentication.validateAuthToken,
        createSubscriptionController.run.bind(createSubscriptionController)
    );

    //Find a subscription
    const findSubscriptionController: FindSubscriptionController = container.get(subscriptionsDependencies.Controllers.FindSubscriptionController);
    router.get(
        '/user/:userId/subscription',
        UserAuthentication.validateAuthToken,
        findSubscriptionController.run.bind(findSubscriptionController)
    );

    //Find all received subscriptions (only for primary users)
    router.get(
        '/user/subscription-requests',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        findSubscriptionController.getSubscriptionRequests.bind(findSubscriptionController)
    );

    //Find all the requested subscriptions by a user.
    router.get(
        '/user/requested-subscriptions',
        UserAuthentication.validateAuthToken,
        findSubscriptionController.getRequestedSubscriptions.bind(findSubscriptionController)
    );

    //Update the status and permissions of a subscription
    router.put(
        '/user/subscription/:subscriptionId',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        SubscriptionValidation.verifySubscriptionOwnership,
        createSubscriptionController.acceptOrRejectSubscription.bind(createSubscriptionController)
    );
}