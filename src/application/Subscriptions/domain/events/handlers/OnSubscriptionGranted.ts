//Domain
import Subscription from '../../Subscription';
//Domain events
import SubscriptionGranted from '../SubscriptionGranted';
//User domain
import UserNotFound from '../../../../User/domain/exceptions/UserNotFound';
//Chat domain
import ChatNotFound from '../../../../Chat/domain/exceptions/ChatNotFound';
//Shared domain
import Logger from '../../../../Shared/domain/Logger';
//Use cases
import SearchChat from '../../../../Chat/application/search/SearchChat';
import UpdateChat from '../../../../Chat/application/update/UpdateChat';
import UserFinder from '../../../../User/application/find/UserFinder';
//Dependency injection
import container from '../../../../../backend/dependency-injection';
import dependencies, { chatDependencies } from '../../../../Shared/domain/constants/dependencies';


/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Handler for the SubscriptionGranted domain event.
 */
export default class OnSubscriptionGranted {
    /**
     * Method to handle the dispatched SubscriptionGranted event.
     * @param {SubscriptionGranted} event Event to handle. 
     */
    static handle = async (event: SubscriptionGranted) => {
        //We get the data from the event.
        const subscription: Subscription = event.subscription;
        //We handle the add user to chat case
        await OnSubscriptionGranted.addUserToChat(subscription);
    }

    //Internal helpers
    /**
     * Method to handle the user addition to the chat when the subscription is granted and it has the right permissions.
     * @param {Subscription} subscription Subscription data.
     * @returns 
     */
    private static addUserToChat = async (subscription: Subscription): Promise<void> => {
        //We validate the permissions
        if(
            !subscription.permissions || 
            !subscription.permissions.hasPermission('readChatMessages')
        )
            return;
        //We get the logger from the dependencies container
        const logger: Logger = container.get(dependencies.Logger);
        try {
            //We get the data from the subscription
            const { chat, user: userToAdd } = await OnSubscriptionGranted.getChatAndUserToAddFromSubscription(subscription); 
            //We add the user to the chat at repository level
            const updateChat: UpdateChat = container.get(chatDependencies.UseCases.UpdateChat);
            await updateChat.addUserToChat({
                chatId: chat.id,
                userToAdd
            });
            //We log the successful operation
            logger.info(`User ${ userToAdd.id.toString() } successfully added to the chat ${ chat.id.toString() }`);
        } catch(exception) {
            //We log the error
            logger.error(exception.message);
        }        
    }

    /**
     * Method to get the chat and user aggregates from the respective use cases, searching them with
     * the data (ID's) obtained from the subscription data, the ID of the user who owns the subscription
     * (to) is the same I as the owner of the chat we want to search, and the ID of the user who sent the
     * subscription request (from) is the same ID of the user to add.
     * @param {Subscription} subscription Subscription data.
     * @returns {Promise<{User, Chat}>} User and chat aggregates.
     */
    private static getChatAndUserToAddFromSubscription = async (subscription: Subscription) => {
        //We get the chat by the owner ID
        const searchChat: SearchChat = container.get(chatDependencies.UseCases.SearchChat);
        const chat = await searchChat.byOwnerId(subscription.to.toString());
        //We validate the chat
        if(!chat)
            throw new ChatNotFound();
        //We search the user to add
        const userFinder: UserFinder = container.get(dependencies.UserFindUseCase);
        const user = await userFinder.find(subscription.from);
        //We validate the user
        if(!user)
            throw new UserNotFound();
        return { user, chat };
    }
}