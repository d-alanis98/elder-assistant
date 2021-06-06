import { NextFunction, Response } from 'express';
//Domain
import ChatNotFound from '../../../application/Chat/domain/exceptions/ChatNotFound';
import UserIsNotChatMember from '../../../application/Chat/domain/exceptions/UserIsNotChatMember';
import UserIsNotChatOwner from '../../../application/Chat/domain/exceptions/UserIsNotChatOwner';
//Use cases
import SearchChat from '../../../application/Chat/application/search/SearchChat';
//Request contract
import { RequestWithUser } from '../User/UserAuthentication';
//Request helpers
import UserControllerHelpers from '../../controllers/Shared/User/UserControllerHelpers';
//Dependency injection
import container from '../../dependency-injection';
import { chatDependencies } from '../../../application/Shared/domain/constants/dependencies';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Custom middleware for the Chat entity. It provides method to validate if the user is the owner of the chat
 * (for primary users), or to validate if the user is chat member (for secondary users).
 */
export default class ChatValidation {
    /**
     * Middleware to validate if the primary user is the chat owner.
     * @param {RequestWithUser} request Express request with additional data.
     * @param {Response} _ Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateIsChatOwner = async (
        request: RequestWithUser, 
        _: Response, 
        next: NextFunction
    ) => {
        try {
            //We get the data from the request
            const chat = await ChatValidation.getChatById(request.params.chatId);
            const userId = UserControllerHelpers.getUserIdFromRequest(request);
            //We validate the ownership
            if(chat.ownedBy.toString() !== userId)
                throw new UserIsNotChatOwner();
            next();
        } catch(error) {
            next(error);
        }
    }

    /**
     * Middleware to validate if the user is chat member.
     * @param {RequestWithUser} request Express request with additional data.
     * @param {Response} _ Express response.
     * @param {NextFunction} next Express next function.
     */
    static validateIsChatMember = async (
        request: RequestWithUser, 
        _: Response, 
        next: NextFunction
    ) => {
        try {
            const chat = await ChatValidation.getChatById(request.params.chatId);
            const userId = UserControllerHelpers.getUserIdFromRequest(request);
            //We validate that the user is chat member
            if(chat.members.members.find(member => member.toPrimitives()._id === userId) !== undefined)
                throw new UserIsNotChatMember();
        } catch(error) {
            next(error);
        }
    }

    //Internal methods
    /**
     * Method to get the chat executing the search chat by ID use case.
     * @param {string} chatId ID of the chat.
     * @returns 
     */
    private static getChatById = async (chatId: string) => {
        //We get and execute the use case
        const searchChat: SearchChat = container.get(chatDependencies.UseCases.SearchChat);
        const chat = await searchChat.byChatId(chatId);
        //We validate the chat
        if(!chat)
            throw new ChatNotFound();
        return chat;
    }
}