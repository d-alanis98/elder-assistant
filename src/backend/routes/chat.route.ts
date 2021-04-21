import { Router } from 'express';
//Middlewares
import UserAuthentication from '../middleware/User/UserAuthentication';
//Controllers
import ChatMessageController from '../controllers/Chat/ChatMessageController';

export const register = (router: Router) => {
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

}