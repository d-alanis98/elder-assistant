//Domain
import Subscription from '../../Subscription';
//Domain events
import SubscriptionRequestCreated from '../SubscriptionRequestCreated';
//Notification domain
import Notification from '../../../../Notifications/domain/Notification';
import { ValidNotificationTypes } from '../../../../Notifications/domain/value-objects/NotificationType';
//Use cases
import CreateNotification from '../../../../Notifications/application/create/CreateNotification';
//Dependency injection
import container from '../../../../../backend/dependency-injection';
import { notificationsDependencies } from '../../../../Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event handler for the SubscriptionRequestCreated domain event.
 */
export default class OnSubscriptionRequestCreated {
    
    /**
     * Entry point of the event handler.
     * @param {SubscriptionRequestCreated} event Emitted event.
     */
    public handle = async (event: SubscriptionRequestCreated) => {
        //We create the notification with the subscription data extracted from the event.
        const subscription = this.getSubscriptionFromEvent(event);
        await this.createSubscriptionNotification(subscription);
    }

    //Internal methods

    /**
     * Method to extract the subscription data from the event.
     * @param {SubscriptionRequestCreated} event Event with subcription data.
     * @returns 
     */
    private getSubscriptionFromEvent = (event: SubscriptionRequestCreated) => event.subscription;

    /**
     * Method to create a subscription notification.
     * @param {Subscription} subscription Received subscription data.
     * @returns 
     */
    private createSubscriptionNotification = async (subscription: Subscription): Promise<Notification> => {
        //We get and execute the use case
        const createNotification: CreateNotification = container.get(notificationsDependencies.UseCases.CreateNotification);
        return await createNotification.run({
            type: ValidNotificationTypes.SUBSCRIPTION,
            content: subscription.toPrimitives(),
            recipients: [subscription.to.toString(), subscription.from.toString()]
        });
    }


}
