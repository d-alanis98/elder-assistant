//Domain
import Chat from '../../domain/Chat';
//Domain exceptions
import ChatNotFound from '../../domain/exceptions/ChatNotFound';
//Repository contract
import ChatRepository from '../../domain/ChatRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1 
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

}

//Interfaces
interface SearchByMemberId {
    id: string,
}