//Chat domain
import Chat, { ChatBaseRequestPrimitives } from '../../domain/Chat';
import ChatName from '../../domain/value-objects/ChatName';
import ChatMembers from '../../domain/value-objects/ChatMembers';
//User domain
import User from '../../../User/domain/User';
//Repository contract
import ChatRepository from '../../domain/ChatRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1 
 * @description Create chat use case.
 */
export default class CreateChat {
    private readonly chatRepository: ChatRepository; 

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    /**
     * Entry point for the use case.
     * @param {ChatBaseRequestPrimitives} chatData The chat data from the request or use case that is invoking this method.
     * @param {User} ownerUser The user that owns the chat.
     * @returns 
     */
    run = async (chatData: ChatBaseRequestPrimitives, ownerUser: User): Promise<Chat> => {
        //We get the chat data
        const { name } = chatData;
        //We get the user without the password data
        const user = User.getUserWithoutPassword(ownerUser);
        //The owner user will be the first member in the chat
        const chatMembers = new ChatMembers([user]);
        //We create the chat entity
        const chat = new Chat(
            null,
            new ChatName(name),
            user.id,
            chatMembers
        );
        //We save the chat to the repository
        await this.chatRepository.create(chat);
        //We return the chat
        return chat;
    }

}