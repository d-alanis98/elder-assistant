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
 * @version 2.3.3
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
        return await this.updateUserFromChat(chatId, userToAdd, false);
    }

    /**
     * Method to update a chat, removing a user from it.
     * @param {ChatId} chatId Id of the chat to update.
     * @param {User} userToRemove User to remove from the chat.
     * @returns 
     */
    removeUserFromChat = async ({
        chatId,
        userToRemove
    }: RemoveUserFromChatParameters): Promise<Chat> => {
        return await this.updateUserFromChat(chatId, userToRemove, true);
    }

    //Internal helpers

    /**
     * Method to update a chat, removing a user from it.
     * @param {ChatId} chatId Id of the chat to update.
     * @param {User} userToModify User to add or remove from the chat.
     * @param {Boolean} removeUserFromChat Flag to indicate the operation, if true the user is rmeoved, otherwise the user is added.
     * @returns 
     */
    private updateUserFromChat = async (
        chatId: ChatId,
        userToModify: User,
        removeUserFromChat: Boolean = false
    ): Promise<Chat> => {
        //We get the chat
        const chat = await this.getChatById(chatId);
        //We get the updated chat
        const updatedChat = this.getUpdatedChatWithModifiedMember(chat, userToModify, removeUserFromChat);
        //We update the chat at repository level
        await this.chatRepository.update(updatedChat);
        //We return the updated chat
        return updatedChat;
    }

    /**
     * Method to get the chat by it's ID.
     * @param {ChatId} chatId Id of the chat.
     * @returns 
     */
    private getChatById = async (chatId: ChatId): Promise<Chat> => {
        //We get the search chat use case and execute it
        const searchChat: SearchChat = new SearchChat(this.chatRepository);
        const chat = await searchChat.byChatId(chatId.toString());
        //We validate the chat
        if(!chat) throw new ChatNotFound();
        return chat;
    }

    /**
     * Method to get an updated chat with the added user.
     * @param {Chat} chat Chat to update.
     * @param {User} user User to add to the chat.
     * @returns 
     */
    private getUpdatedChatWithModifiedMember = (
        chat: Chat, 
        user: User,
        removeUser: Boolean = false
    ): Chat => {
        //We add the user
        const updatedMembers: ChatMembers = chat.members;
        //We perform the operation
        if(removeUser)
            updatedMembers.removeMember(user);
        //We validate the user addition, to occur only if the user is not a chat member already
        else if(this.userIsNotChatMemberAlready(chat, user))
            updatedMembers.addMember(user)
        else throw new UserIsChatMemberAlready();
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

interface RemoveUserFromChatParameters {
    chatId: ChatId;
    userToRemove: User;
}