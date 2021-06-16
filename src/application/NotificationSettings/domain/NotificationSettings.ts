//Domain
import NotificationDeviceTokens from './value-objects/NotificationDeviceTokens';
//User domain
import UserId from '../../Shared/domain/modules/User/UserId';
//Shared domain
import AggregateRoot from '../../Shared/domain/AggregateRoot';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Notification settings entity.
 */
export default class NotificationSettings extends AggregateRoot {
    readonly id: UserId;
    readonly deviceTokens: NotificationDeviceTokens;

    constructor(
        id: UserId,
        deviceTokens: NotificationDeviceTokens
    ) {
        super();
        this.id = id;
        this.deviceTokens = deviceTokens;
    }

    static fromPrimitives = ({
        _id,
        deviceTokens
    }: NotificationSettingsPrimitives) => new NotificationSettings(
        new UserId(_id),
        new NotificationDeviceTokens(deviceTokens)
    );

    toPrimitives = (): NotificationSettingsPrimitives => ({
        _id: this.id.toString(),
        deviceTokens: this.deviceTokens.value
    });


    /**
     * Implementation of the abstract method to get the aggregate id.
     * @returns {UserId}
     */
     public get aggregateId(): UserId {
        return this.id;
    }
}

export interface NotificationSettingsPrimitives {
    _id: string;
    deviceTokens: string[];
}
