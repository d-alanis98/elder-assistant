//Value objects
import NotificationId from './value-objects/NotificationId';
import NotificationType from './value-objects/NotificationType';
import NotificationContent from './value-objects/NotificationContent';
import NotificationIssueDate from './value-objects/NotificationIssueDate';
//User domain
import UserId from '../../Shared/domain/modules/User/UserId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';

/**
 * @author Damian Alanis Ramirez
 * @version 1.2.1
 * @description Notification entity abstraction.
 */
export default class Notification<T = any> extends AggregateRoot {
    readonly id: NotificationId;
    readonly type: NotificationType;
    readonly content: NotificationContent<T>;
    readonly recipients: UserId[];
    readonly issuedAt: NotificationIssueDate;

    constructor(
        id: Nullable<NotificationId>,
        type: NotificationType,
        content: NotificationContent,
        recipients: UserId[],
        issuedAt?: NotificationIssueDate
    ) {
        super();
        this.id = id || NotificationId.random();
        this.type = type;
        this.content = content;
        this.recipients = recipients;
        this.issuedAt = issuedAt || NotificationIssueDate.current();
    }

    /**
     * Method to get the notification data in primitive values
     * @returns {NotificationPrimitives}
     */
    toPrimitives = (): NotificationPrimitives<T> => ({
        _id: this.id.toString(),
        type: this.type.value,
        content: this.content.value,
        issuedAt: this.issuedAt.toString(),
        recipients: this.getPrimitiveUserIds()
    });

    /**
     * Method to get a notification instance from JS primitive values.
     * @param {string} _id ID of the notification.
     * @param {string} type Notification type.
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        type,
        content,
        issuedAt,
        recipients
    }: NotificationPrimitives) => new Notification(
        _id && new NotificationId(_id),
        new NotificationType(type),
        new NotificationContent(content),
        Notification.getUserIdsFromPrimitives(recipients),
        issuedAt ? new NotificationIssueDate(issuedAt) : undefined
    );

    //Helpers

    /**
     * Method to get the notifications list in primitive reoresentation.
     * @param {Notification[]} notifications Paginated data collection in aggregate instance form.
     * @returns 
     */
    static getNotificationsListInPrimitiveValues = (
        notifications: Notification[]
    ): NotificationPrimitives[] => notifications.map((notification: Notification) => (
        notification.toPrimitives()
    ));

    /**
     * Method to get the primitive representation of the users ID's.
     * @returns 
     */
    private getPrimitiveUserIds = (): string[] => this.recipients.map(
        userId => userId.toString()
    );

    /**
     * Method to get the UserId array from string user ID's.
     * @param {string[]} userIds User ID's in primitive values.
     * @returns 
     */
    private static getUserIdsFromPrimitives = (userIds: string[]): UserId[] => userIds.map(
        userId => new UserId(userId)
    );

    /**
     * Implementation of the abstract method to get the aggregate id.
     * @returns {NotificationId}
     */
    public get aggregateId(): NotificationId {
        return this.id;
    }

}

//Types
export interface NotificationPrimitives<T = any>
    extends NotificationCreateRequest<T> {
    _id?: string;
    issuedAt?: string;
}

export interface NotificationCreateRequest<T = any> {
    type: string;
    content: T;
    recipients: string[];
}