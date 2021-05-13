import { Router } from 'express';
//Middlewares
import UserAuthentication from '../middleware/User/UserAuthentication';
//Controllers
import ChatController from '../controllers/Chat/ChatController';
import ChatMessageController from '../controllers/Chat/ChatMessageController';

export const register = (router: Router) => {

    //Get the chats a user belongs to
    const chatController: ChatController = new ChatController();
    router.get(
        '/chats',
        UserAuthentication.validateAuthToken,
        chatController.run.bind(chatController)
    );

    /**
     * ChatMessage
     */
    //Create chat message
    /**
     * @todo Middlewares for:
     *  - Validation of the chat Id (the chat must exist)
     *  - Validation of the permission to send messages to that chat.
     */
    const chatMessageController: ChatMessageController = new ChatMessageController();
    router.post(
        '/chat/:chatId/message',
        UserAuthentication.validateAuthToken,
        chatMessageController.run.bind(chatMessageController)
    );

    //Get chat messages
    router.get(
        '/chat/:chatId/messages',
        UserAuthentication.validateAuthToken,
        chatMessageController.searchAll.bind(chatMessageController)
    );

}