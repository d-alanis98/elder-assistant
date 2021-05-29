//User domain
import User from '../../../User/domain/User';
import UserId from '../../../Shared/domain/modules/User/UserId';
//Chat domain
import Chat from '../../../Chat/domain/Chat';
import ChatId from '../../../Chat/domain/value-objects/ChatId';
import ChatNotFound from '../../../Chat/domain/exceptions/ChatNotFound';
//Chat use cases
import SearchChat from '../../../Chat/application/search/SearchChat';
//Shared domain
import Logger from '../../../Shared/domain/Logger';
import { Nullable } from '../../../Shared/domain/Nullable';
//Notification channels
import WebSocketClients from '../../../Shared/infrastructure/WebSockets/WebSocketClients';
//Domain events
import ChatMessageCreated from './ChatMessageCreated';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies, { chatDependencies } from '../../../Shared/domain/constants/dependencies';

/**
 * @author Damian Alanis Ramirez
 * @version 1.1.1
 * @description Handler for the ChatMessageCreated event. The created message is sent to chat members via
 * WebSockets and by the notification channels preferred by each user.
 */
export default class OnChatMessageCreated {
    private readonly logger: Logger;
    private readonly eventData: ChatMessageCreated;

    constructor(eventData: ChatMessageCreated) {
        this.eventData = eventData;
        //We get the logger from the container
        this.logger = container.get(dependencies.Logger);
    }

    handle = async () => {
        try {
            const { chatMessage: { chatId, from: messageSender } } = this.eventData;
            const chat: Chat = await this.getChat(chatId);
            const chatMembersToNotify: MembersToNotify = this.getChatMembersToNotifyExceptFromSender(chat, messageSender);
            this.notifyChatMessageCreated(chatMembersToNotify);
        } catch(error) {
            this.logger.error(error.message);
        }
    }

    //Internal methods

    private getChat = async (chatId: ChatId): Promise<Chat> => {
        //We get and execute the search chat use case
        const searchChat: SearchChat = container.get(chatDependencies.UseCases.SearchChat);
        const chat: Nullable<Chat> = await searchChat.byChatId(chatId.toString());
        //We validate the chat
        if(!chat) 
            throw new ChatNotFound();
        return chat;
    }

    private getChatMembersToNotifyExceptFromSender = (chat: Chat, senderId: UserId): MembersToNotify => {
        let usersToNotify: User[] = chat.members.members;
        //We exclude the sender user from the users to notify
        //usersToNotify = usersToNotify.filter(user => user.id.toString() !== senderId.toString());
        return usersToNotify.map(user => user.id.toString());
    }

    private notifyChatMessageCreated = (members: MembersToNotify) => {
        //We send the created message through web socket
        this.sendMessageThroughWebSocket(members);
        /** @todo Notify through push notification and/or email */
    }

    private sendMessageThroughWebSocket = (members: MembersToNotify) => {
        WebSocketClients.emitDataToUsers(
            members,
            'ChatMessage',
            this.getChatMessageDataToSend()
        );
    }

    private getChatMessageDataToSend = () => (
        this.eventData.chatMessage.toPrimitives()
    );
}

type MembersToNotify = string[];