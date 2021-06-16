import axios from 'axios';
//Domain
import Logger from '../../domain/Logger';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Push notification manager.
 */
export default class PushNotificationEmitter {
    private readonly logger: Logger;
    private readonly recipients: string[];
    private readonly notificationParameters: NotificationParameters;

    constructor(
        logger: Logger,
        recipients: string[],
        notificationParameters: NotificationParameters,
    ) {
        this.logger = logger;
        this.recipients = recipients;
        this.notificationParameters = notificationParameters;
    }

    /**
     * Method to emit the notifications to the recipients.
     */
    emit = async () => {
        try {
            const payload = this.getPayload();
            //We make the request
            await axios.post(
                'https://exp.host/--/api/v2/push/send',
                payload
            );
        } catch(error) {
            this.logger.error(error.message);
        }
    }

    /**
     * Method to get the notifications to emmit in an array form
     * @returns 
     */
    private getPayload = () => this.recipients.map(recipient => ({
        ...this.notificationParameters,
        to: recipient
    }));
}

export interface NotificationParameters {
    title: string;
    body: string;
}