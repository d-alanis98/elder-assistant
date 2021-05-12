//Domain
import Chat from '../../domain/Chat';
//Domain exceptions
import ChatNotFound from '../../domain/exceptions/ChatNotFound';
//Repository contract
import ChatRepository from '../../domain/ChatRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.3
 * @description Search chat use case.
 */
export default class SearchChat {
    private readonly chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    /**
     * Method to get all the chats a user belongs to.
     * @param {string} id Id of the member of the chat/s.
     */
    byMemberId = async ({
        id
    }: SearchByMemberId): Promise<Chat[]> => {
        const chats = await this.chatRepository.searchAll({
            members: {
                $elemMatch: { _id: id }
            }
        });
        if(!chats)
            throw new ChatNotFound();
        return chats;
    }

    /**
     * Method to search a chat by its ID.
     * @param {string} chatId ID of the chat to search.
     * @returns 
     */
    byChatId = async (chatId: string) => (
        this.chatRepository.search({ _id: chatId })
    );

    /**
     * Method to search a chat by it's owner ID.
     * @param {string} ownerId ID of the owner of the chat to search.
     * @returns 
     */
    byOwnerId = async (ownerId: string) => (
        this.chatRepository.search({ ownedBy: ownerId })
    );

}

//Interfaces
interface SearchByMemberId {
    id: string,
}