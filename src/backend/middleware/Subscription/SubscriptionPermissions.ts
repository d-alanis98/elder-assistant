import { NextFunction, Response } from 'express';
//Domain
import Subscription from '../../../application/Subscriptions/domain/Subscription';
import SubscriptionPermissionNotGranted from '../../../application/Subscriptions/domain/exceptions/SubscriptionPermissionNotGranted';
import { SubscriptionPermissionsParameters } from '../../../application/Subscriptions/domain/value-objects/SubscriptionPermissions';
//Request contract
import { RequestWithSubscription } from './SubscriptionValidation';
//Request helpers
import SubscriptionRequestHelpers from '../../controllers/Shared/Subscriptions/SubscriptionsRequestHelpers';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Custom Express middleware to validate the user permissions for a given subscription.
 */
export default class SubscriptionPermissions {

    /**
     * Method to validate that a given permission is granted in the subscription.
     * @param {string} permission Permission to validate.
     * @returns 
     */
    static hasPermission = (
        permission: keyof SubscriptionPermissionsParameters,
    ) => async (
        request: RequestWithSubscription, 
        _: Response, 
        next: NextFunction
    ) => {
        //We get the subscription data from the request
        const subscriptionPrimitives = SubscriptionRequestHelpers.getSubscriptionDataFromRequest(request); 
        //We create the subscription instance
        const subscription = Subscription.fromPrimitives(subscriptionPrimitives);
        //We validate the permissions
        if(!subscription.permissions?.hasPermission(permission))
            throw new SubscriptionPermissionNotGranted(permission);
        next();
    }
}