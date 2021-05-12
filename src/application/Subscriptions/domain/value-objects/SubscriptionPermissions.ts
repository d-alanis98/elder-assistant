import ValueObject from '../../../Shared/domain/ValueObject';
//Domain exceptions
import SubscriptionPermissionsNotValid from '../exceptions/SubscriptionPermissionsNotValid';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Subscription permissions value object.
 */
export default class SubscriptionPermissions extends ValueObject<SubscriptionPermissionsParameters> {
    constructor(permissions: SubscriptionPermissionsParameters) {
        super(permissions);
        //We validate the permissions
        this.validatePermissionsObject(permissions);
    }

    //Helper methods
    /**
     * Method to determine if the user has certain permission.
     * @param {string} permission Permission to verify.
     * @returns 
     */
    hasPermission = (permission: keyof SubscriptionPermissionsParameters) => (
        this.value()[permission]
    );

    /**
     * Method to validate the permissions object.
     * @param {SubscriptionPermissionsParameters} permissions Permissions object.
     */
    private validatePermissionsObject = (permissions: SubscriptionPermissionsParameters) => {
        if (
            permissions.readOwnerData === undefined ||
            permissions.readChatMessages === undefined ||
            permissions.sendChatMessages === undefined
        )   
            throw new SubscriptionPermissionsNotValid();
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