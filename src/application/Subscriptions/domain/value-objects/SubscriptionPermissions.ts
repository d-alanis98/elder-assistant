import ValueObject from '../../../Shared/domain/ValueObject';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Subscription permissions value object.
 */
export default class SubscriptionPermissions extends ValueObject<SubscriptionPermissionsParameters> {
    constructor(permissions: SubscriptionPermissionsParameters) {
        super(permissions);
    }
}   


export interface SubscriptionPermissionsParameters {
    readOwnerData: Boolean; 
    readChatMessages: Boolean;
    sendChatMessages: Boolean;
    receiveNotificationsOnOwnerEvents?: Boolean;
}

export const defaultSubscriptionPermissions: SubscriptionPermissionsParameters = {
    readOwnerData: true,
    readChatMessages: true,
    sendChatMessages: true,
    receiveNotificationsOnOwnerEvents: true
};