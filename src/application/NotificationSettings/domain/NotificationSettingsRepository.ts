//Domain
import NotificationSettings from './NotificationSettings';
//Base repository specification
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification settings repository contract.
 */
export default interface NotificationSettingsRepository 
    extends DataRepository<NotificationSettings> { };