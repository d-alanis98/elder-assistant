//Domain
import ChatMessage, { ChatMessagePrimitives } from '../../domain/ChatMessage';
//Domain exceptions
import UnexistingChatMessages from '../../domain/exceptions/UnexistingChatMessages';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import ChatMessageRepository, { PaginatedChatMessages } from '../../domain/ChatMessageRepository';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Search chat message use case.
 */
export default class SearchChatMessage {
    //Constants
    private readonly DEFAULT_CHAT_MESSAGES_LIMIT = 20;
    //Repository
    private readonly chatMessageRepository: ChatMessageRepository;

    constructor(chatMessageRepository: ChatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    /**
     * Method to get the messages of a certain chat with pagination.
     * @param {number | undefined} limit Records limit per query.
     * @param {string} chatId Id of the chat that contains the messages.
     * @param {string | undefined} startingAt Starting point for the next result set.
     * @returns 
     */
    getAllMessages = async ({
        limit,
        chatId,
        startingAt
    }: GetAllMessagesParameters): Promise<PaginatedChatMessages> => {
        //We set the records limit
        const recordsLimit = limit || this.DEFAULT_CHAT_MESSAGES_LIMIT;
        //We search the messages in the repository
        const messageRecords: Nullable<PaginatedChatMessages> = await this.chatMessageRepository.searchAllPaginated(
            { chatId },
            { limit: recordsLimit, startingAt }
        );
        //We validate the result
        if(!messageRecords)
            throw new UnexistingChatMessages();
        //We return the records
        return messageRecords;
    }

    //Facade
    /**
     * Method to get the data records in primitive reoresentation.
     * @param {ChatMessage} chatMessageRecords Data collection in aggregate instance form.
     * @returns 
     */
    static getDataRecordsInPrimitiveValues = (chatMessageRecords: ChatMessage[]): ChatMessagePrimitives[] => (
        chatMessageRecords.map((chatMessage: ChatMessage) => (
            chatMessage.toPrimitives()
        ))
    );

}

//Types
interface GetAllMessagesParameters {
    limit: number | undefined;
    chatId: string;
    startingAt: string | undefined;
}