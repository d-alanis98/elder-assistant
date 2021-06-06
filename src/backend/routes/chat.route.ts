import { Router } from 'express';
//Middlewares
import ChatValidation from '../middleware/Chat/ChatValidation';
import MiddlewareGroup from '../middleware/Shared/MiddlewareGroup';
import UserAuthorization from '../middleware/User/UserAuthorization';
import UserAuthentication from '../middleware/User/UserAuthentication';
import SubscriptionValidation from '../middleware/Subscription/SubscriptionValidation';
import SubscriptionPermissions from '../middleware/Subscription/SubscriptionPermissions';
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
    const chatMessageController: ChatMessageController = new ChatMessageController();
    router.post(
        '/chat/:chatId/message',
        //We create a middleware group, to determine the middlewares to apply depending on the user type
        //The user authentication is handled by default
        new MiddlewareGroup(
            [//Middlewares to apply if the user is of primary type
                UserAuthorization.validatePrimaryRole,
                ChatValidation.validateIsChatOwner
            ], 
            [//Middlewares to apply if the user is of secondary type
                SubscriptionValidation.verifySubscription,
                SubscriptionPermissions.hasPermission('sendChatMessages'),
                ChatValidation.validateIsChatMember
            ]
        ).apply,
        chatMessageController.run.bind(chatMessageController)
    );

    //Get chat messages
    router.get(
        '/chat/:chatId/messages',
        //We create a middleware group, to determine the middlewares to apply depending on the user type
        //The user authentication is handled by default
        new MiddlewareGroup(
            [//Middlewares to apply if the user is of primary type
                UserAuthorization.validatePrimaryRole,
                ChatValidation.validateIsChatOwner
            ], 
            [//Middlewares to apply if the user is of secondary type
                SubscriptionValidation.verifySubscription,
                SubscriptionPermissions.hasPermission('readChatMessages'),
                ChatValidation.validateIsChatMember
            ]
        ).apply,
        chatMessageController.searchAll.bind(chatMessageController)
    );

}