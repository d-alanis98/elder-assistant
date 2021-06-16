//Domain
import NotificationSettings from '../../domain/NotificationSettings';
import NotificationSettingsNotFound from '../../domain/exceptions/NotificationSettingsNotFound';
//Use cases
import SearchNotificationSettings from '../search/SearchNotificationSettings';
//Shared domain
import InternalServerError from '../../../Shared/domain/exceptions/InternalServerError';
//Repository contract
import NotificationSettingsRepository from '../../domain/NotificationSettingsRepository';


/**
 * @author Damian Alanis Ramirez
 * @version 1.1.2
 * @description Create notification settings use case.
 */
export default class CreateNotificationSettings {
    private readonly notificationSettingsRepository: NotificationSettingsRepository;

    constructor(notificationSettingsRepository: NotificationSettingsRepository) {
        this.notificationSettingsRepository = notificationSettingsRepository;
    }

    /**
     * Method to register a device token, for push notification porpouses.
     * @param {string} userId Id of the user that owns the settings.
     * @param {string} deviceToken Device token to register.
     * @returns 
     */
    registerDeviceToken = async (
        userId: string,
        deviceToken: string
    ): Promise<NotificationSettings> => {
        //We get the data
        const existingNotificationSettings = await this.getNotificationSettingsByUserId(userId);
        const updatedNotificationSettings = this.getNotificationSettingsWithAddedToken(
            deviceToken,
            existingNotificationSettings
        );
        //We persist the data
        await this.notificationSettingsRepository.update(updatedNotificationSettings);
        //We return the updated settings
        return updatedNotificationSettings;
    }

    //Internal helpers

    /**
     * Method to get the existing notification settings by user. If none exist, we create an empty object.
     * @param userId Id of the user
     * @returns 
     */
    private getNotificationSettingsByUserId = async (userId: string) => {
        try {
            //We get and exeute the search notification settings use case
            const searchNotificationSettings = new SearchNotificationSettings(this.notificationSettingsRepository)
            return await searchNotificationSettings.byUserId(userId);
        } catch (exception) {
            //In case it does not exist, we return a new instance
            if(exception instanceof NotificationSettingsNotFound)
                return NotificationSettings.fromPrimitives({
                    _id: userId,
                    deviceTokens: []
                });
            throw new InternalServerError();
        }
    }

    /**
     * Method to get a new NotificationSettings instance with the added device token.
     * @param {string} deviceToken Device token to add.
     * @param {NotificationSettings} existingNotificationSettings Existing notification settings.
     * @returns 
     */
    private getNotificationSettingsWithAddedToken = (
        deviceToken: string,
        existingNotificationSettings: NotificationSettings
    ): NotificationSettings => {
        //We add the token
        existingNotificationSettings.deviceTokens.addToken(deviceToken)
        //We return the updated notification settings
        return new NotificationSettings(
            existingNotificationSettings.id,
            existingNotificationSettings.deviceTokens
        )
    }
}