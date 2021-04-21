//Domain
import DomainEventsHandler from '../../../Shared/domain/events/DomainEventsHandler';
import ChatMessage, { ChatMessageRequestPrimitives } from '../../domain/ChatMessage';
//Domain events
import ChatMessageCreated from '../../domain/events/ChatMessageCreated';
//Repository contract
import ChatMessageRepository from '../../domain/ChatMessageRepository';

/**
 * @author Damian Alanis Ramirez
 * @version 2.1.1
 * @description Create chat message use case.
 */
export default class CreateChatMessage {
    private readonly chatMessageRepository: ChatMessageRepository;

    constructor(chatMessageRepository: ChatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Entry point for the use case.
     * @param {string} from The user that sends the message.
     * @param {Object} content The content of the message.
     * @returns 
     */
    run = async ({
        from,
        chatId,
        content
    }: ChatMessageRequestPrimitives): Promise<ChatMessage> => {
        const chatMessage = ChatMessage.fromPrimitives({ from, chatId, content });
        //We save the message to the repository
        await this.chatMessageRepository.create(chatMessage);
        //We create and dispatch the event
        chatMessage.addDomainEvent(new ChatMessageCreated(chatMessage));
        DomainEventsHandler.dispatchEventsForAggregate(chatMessage.id);
        //Finally, we return the chat message instance
        return chatMessage;
    }

}