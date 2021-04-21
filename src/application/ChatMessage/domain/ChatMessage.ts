//Value objects
import ChatMessageId from './value-objects/ChatMessageId';
import ChatMessageDate from './value-objects/ChatMessageDate';
import ChatMessageContent, { ChatMessageContentParameters } from './value-objects/ChatMessageContent';
//Shared domain
import UserId from '../../Shared/domain/modules/User/UserId';
import { Nullable } from '../../Shared/domain/Nullable';
import AggregateRoot from '../../Shared/domain/AggregateRoot';
import ChatId from '../../Chat/domain/value-objects/ChatId';


/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Chat message entity.
 */
export default class ChatMessage extends AggregateRoot {
    readonly id: ChatMessageId;
    readonly from: UserId;
    readonly chatId: ChatId;
    readonly content: ChatMessageContent;
    readonly issuedAt: ChatMessageDate;

    constructor(
        id: Nullable<ChatMessageId>,
        from: UserId,
        chatId: ChatId,
        content: ChatMessageContent,
        issuedAt?: ChatMessageDate
    ) {
        super();
        this.id = id || ChatMessageId.random();
        this.from = from;
        this.chatId = chatId;
        this.content = content;
        this.issuedAt = issuedAt || ChatMessageDate.current();
    }

    /**
     * Method to return the instance data in primitive values.
     * @returns Object with the values in primitives.
     */
    toPrimitives = (): ChatMessagePrimitives => ({
        _id: this.id.toString(),
        from: this.from.toString(),
        chatId: this.chatId.toString(),
        content: this.content.value(),
        issuedAt: this.issuedAt.toString()
    });

    //Facade
    /**
     * Facade mtehod to create a new instance of the value object with primitive
     * values as the input.
     * @param {string|undefined} _id
     * @param {string} from
     * @param {ChatMessageContentParameters} content
     * @param {string|undefined} issuedAt
     * @returns 
     */
    static fromPrimitives = ({
        _id,
        from,
        chatId,
        content,
        issuedAt
    }: ChatMessagePrimitives) => new ChatMessage(
        _id ? new ChatMessageId(_id) : undefined,
        new UserId(from),
        new ChatId(chatId),
        new ChatMessageContent(content),
        issuedAt ? new ChatMessageDate(issuedAt) : undefined
    );

    /**
     * Method to get the ID of the aggregate.
     */
    public get aggregateId(): ChatMessageId {
        return this.id;
    }
    
}

export interface ChatMessagePrimitives extends ChatMessageRequestPrimitives {
    _id?: string;
    issuedAt?: string;
}

export interface ChatMessageRequestPrimitives {
    from: string;
    chatId: string;
    //Is safe to use the ChatMessage content parameters, because thy are already primitive values (object)
    content: ChatMessageContentParameters;
}