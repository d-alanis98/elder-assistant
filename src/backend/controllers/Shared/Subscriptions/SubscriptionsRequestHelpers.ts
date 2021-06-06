//Domain
import { SubscriptionPrimitives } from '../../../../application/Subscriptions/domain/Subscription';
import SubscriptionNotFound from '../../../../application/Subscriptions/domain/exceptions/SubscriptionNotFound';
//Request contract
import { RequestWithSubscription } from '../../../middleware/Subscription/SubscriptionValidation';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Utilities for the Subscription entity requests.
 */
export default class SubscriptionRequestHelpers {
    /**
     * Method to get the subscription data from the request without needing to perform the validation of it's existance.
     * @param {RequestWithSubscription} request Request with subscription data.
     * @returns 
     */
    static getSubscriptionDataFromRequest = (request: RequestWithSubscription): SubscriptionPrimitives => {
        const subscriptionData = request.subscription;
        //We validate
        if(!subscriptionData)
            throw new SubscriptionNotFound();
        return subscriptionData;
    }
}