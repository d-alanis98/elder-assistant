import ValueObject from "../../../Shared/domain/ValueObject";

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Chat message content value object.
 */
export default class ChatMessageContent extends ValueObject<ChatMessageContentParameters> {
    constructor(messageContent: ChatMessageContentParameters) {
        super(messageContent);
    }
}

export interface ChatMessageContentParameters {
    type: ValidChatMessageTypes;
    content: string | ChatMessageFileParameters;
}

export interface ChatMessageFileParameters {
    fileHash?: string;
    fileSize: string | number;
    fileName: string;
    extension: string;
}

export enum ValidChatMessageTypes {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    AUDIO = 'AUDIO',
    VIDEO = 'VIDEO'
};