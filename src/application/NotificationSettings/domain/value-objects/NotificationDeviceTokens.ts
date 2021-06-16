/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification device token value object.
 */
export default class NotificationDeviceTokens {
    private deviceTokens: string[];

    constructor(deviceTokens?: string[]) {
        this.deviceTokens = deviceTokens || [];
    }

    public get value() {
        return this.deviceTokens;
    }

    /**
     * Method to add a token to the tokens array
     * @param {string} tokenToAdd Token to add.
     * @returns 
     */
    addToken = (tokenToAdd: string) => this.deviceTokens.push(tokenToAdd);

    /**
     * Method to remove a token from the tokens array.
     * @param {string} tokenToDelete Token to remove.
     */
    removeToken = (tokenToDelete: string) => {
        this.deviceTokens = this.deviceTokens.filter(token => token !== tokenToDelete);
    }
}