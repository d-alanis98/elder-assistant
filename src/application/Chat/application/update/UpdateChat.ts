//Domain
import Chat from '../../domain/Chat';
import ChatId from '../../domain/value-objects/ChatId';
import ChatMembers from '../../domain/value-objects/ChatMembers';
//Domain exceptions
import ChatNotFound from '../../domain/exceptions/ChatNotFound';
import UserIsChatMemberAlready from '../../domain/exceptions/UserIsChatMemberAlready';
//User domain
import User from '../../../User/domain/User';
//Use cases
import SearchChat from '../search/SearchChat';
//Repository contract
import ChatRepository from '../../domain/ChatRepository';



/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Update chat use case.
 */
export default class UpdateChat {
    private readonly chatRepository: ChatRepository;

    constructor(chatRepository: ChatRepository) {
        this.chatRepository = chatRepository;
    }

    /**
     * Metho to update a chat, adding a new user to it.
     * @param {ChatId} chatId Id of the chat to update.
     * @param {User} userToAdd User to add to the chat.
     * @returns 
     */
    addUserToChat = async ({
        chatId,
        userToAdd
    }: AddUserToChatParameters): Promise<Chat> => {
        //We find the chat
        const searchChat: SearchChat = new SearchChat(this.chatRepository);
        const chat = await searchChat.byChatId(chatId.toString());
        //We validate the chat
        if(!chat)
            throw new ChatNotFound();
        //We validate that the user is not a member of the chat already
        if(!this.userIsNotChatMemberAlready(chat, userToAdd))
            throw new UserIsChatMemberAlready();
        //We get an updated chat
        const updatedChat = this.getUpdatedChatWithNewMember(chat, userToAdd);
        //We update the chat at repository level
        await this.chatRepository.update(updatedChat);
        //We return the updated chat
        return updatedChat;
    }

    //Internal helpers
    /**
     * Method to get an updated chat with the added user.
     * @param {Chat} chat Chat to update.
     * @param {User} userToAdd User to add to the chat.
     * @returns 
     */
    private getUpdatedChatWithNewMember = (
        chat: Chat, 
        userToAdd: User
    ): Chat => {
        //We add the user
        const updatedMembers: ChatMembers = chat.members;
        updatedMembers.addMember(userToAdd);
        //We return the chat instance with the updated users
        return new Chat(
            chat.id,
            chat.name,
            chat.ownedBy,
            updatedMembers,
            chat.createdAt
        );
    }

    /**
     * Method to determine if a user is already a member.
     * @param {Chat} chat Chat to update.
     * @param {User} user User to add to the chat.
     * @returns 
     */
    private userIsNotChatMemberAlready = (chat: Chat, user: User) => {
        //We search for the user in the existing members
        const existingUser = chat.members.members.find(member => (
            member.id.toString() === user.id.toString()
        ));
        return existingUser === undefined;
    }
}

//Helpers
interface AddUserToChatParameters {
    chatId: ChatId;
    userToAdd: User;
}