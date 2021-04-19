//User domain
import User from '../User';
import { AllowedUserTypes } from '../value-objects/UserType';
//Chat domain
import ChatName from '../../../Chat/domain/value-objects/ChatName';
//Event to handle
import UserCreated from '../events/UserCreated';
//Use cases to invoke
import CreateChat from '../../../Chat/application/create/CreateChat';
//Logger
import Logger from '../../../Shared/domain/Logger';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies, { chatDependencies } from '../../../Shared/domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 1.3.2
 * @description Class that contains the handler logic for the UserCreated event.
 */
export default class OnUserCreated {
    /**
     * Method to handle the disptched event.
     * @param {UserCreated} eventData Data of the event.
     */
    static handle = async (eventData: UserCreated) => {
        const ownerUser = eventData.user;
        //We create the chat for the primary users
        await OnUserCreated.createChat(ownerUser);

    }

    /**
     * Method to create the chat for the primary user.
     * @param {User} ownerUser The created user, which is the owner of the chat (if it is of primary type).
     * @returns 
     */
    private static createChat = async (ownerUser: User) => {
        if(ownerUser.type.value !== AllowedUserTypes.PRIMARY)
            return;
        //We get the logger
        const logger: Logger = container.get(dependencies.Logger);
        try {
            //We get the create chat use case with the injected dependencies
            const createChat: CreateChat = container.get(chatDependencies.UseCases.CreateChat);
            //We save the chat to the respository
            await createChat.run({
                name: OnUserCreated.getChatName(ownerUser),
                ownedBy: ownerUser.id.value,
            }, ownerUser);
            //We log the chat creation success message
            logger.info(`Chat for the user ${ownerUser.id.value} generated successfully`);
        } catch(error) {
            logger.error(error.message);
        }
    }

    /**
     * Method to get a valid chat name string.
     * @param {User} ownerUser The owner of the chat.
     * @returns 
     */
    private static getChatName = (ownerUser: User) => {
        let chatName = `${ownerUser.name.value} ${ownerUser.lastName.value} chat`;
        //If the chat name is too long, we only use the user name, which is guaranteed to be <= 25 chars
        if(chatName.length > ChatName.MAX_LENGTH)
            chatName = `${ownerUser.name.value} chat`;
        return chatName;
    }
}