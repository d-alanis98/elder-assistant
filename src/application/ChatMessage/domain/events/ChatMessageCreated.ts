//Domain
import ChatMessage from '../ChatMessage';
//Base event
import DomainEvent from '../../../Shared/domain/events/DomainEvent';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Event that is emitted when a chat message is created.
 */
export default class ChatMessageCreated extends DomainEvent {
    readonly chatMessage: ChatMessage;

    constructor(chatMessage: ChatMessage) {
        super();
        this.chatMessage = chatMessage;
    }

    getAggregateId = () => this.chatMessage.id; 
}