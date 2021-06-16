//Domain
import NotificationSettings from '../../domain/NotificationSettings';
//User domain
import UserId from '../../../Shared/domain/modules/User/UserId';
//Domain exceptions
import NotificationSettingsNotFound from '../../domain/exceptions/NotificationSettingsNotFound';
//Repository contract
import NotificationSettingsRepository from '../../domain/NotificationSettingsRepository';


/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Search notification settings use case.
 */
export default class SearchNotificationSettings {
    private readonly notificationSettingsRepository: NotificationSettingsRepository;

    constructor(notificationSettingsRepository: NotificationSettingsRepository) {
        this.notificationSettingsRepository = notificationSettingsRepository;
    }

    /**
     * Mehtod to get the notification settings by user ID.
     * @param {UserId|string} userId Id of the user.
     * @returns 
     */
    byUserId = async (
        userId: UserId | string
    ): Promise<NotificationSettings> => {
        const notificationSettings = await this.notificationSettingsRepository.search(userId);
        //We validate the record
        if(!notificationSettings)
            throw new NotificationSettingsNotFound();
        return notificationSettings;
    }
}