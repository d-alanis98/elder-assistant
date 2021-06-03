//Base value object
import EnumValueObject from '../../../Shared/domain/value-object/EnumValueObject';
//Exceptions
import NotificationTypeNotValid from '../exceptions/NotificationTypeNotValid';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification type value object.
 */
export default class NotificationType extends EnumValueObject<string> {
    constructor(notificationType: string) {
        super(notificationType, Object.values(ValidNotificationTypes));
    }

    /**
     * Handler of non valid type exception.
     * @param notificationType The not valid notification type.
     */
    throwErrorForInvalidValue(notificationType: string) {
        throw new NotificationTypeNotValid(notificationType);
    }
}

//Types
export enum ValidNotificationTypes {
    SYSTEM = 'SYSTEM',
    PANIC_ALERT = 'PANIC_ALERT',
    SUBSCRIPTION = 'SUBSCRIPTION',
    IOT_DEVICE_EVENT ='IOT_DEVICE_EVENT'
} 