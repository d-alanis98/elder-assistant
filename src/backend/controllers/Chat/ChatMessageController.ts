import { Response } from 'express';
import httpStatus from 'http-status';
//Domain
import ChatMessage from '../../../application/ChatMessage/domain/ChatMessage';
//Use cases
import CreateChatMessage from '../../../application/ChatMessage/application/create/CreateChatMessage';
//Exceptions
import UserNotAuthenticated from '../../../application/User/domain/exceptions/UserNotAuthenticated';
//Request with additional data
import { RequestWithUser } from '../../middleware/User/UserAuthentication';
//Base controller
import Controller from '../Controller';
//Dependency injection
import container from '../../dependency-injection';
import { chatMessageDependencies } from '../../../application/Shared/domain/constants/dependencies';
import { ChatMessageFileParameters, ValidChatMessageTypes } from '../../../application/ChatMessage/domain/value-objects/ChatMessageContent';

/**
 * @author Damian Alanis Ramirez
 * @version 3.2.1
 * @description Controller to handle chat message requests.
 */
export default class ChatMessageController extends Controller {

    /**
     * Entry point for the controller (create use case).
     * @param {RequestWithData} request Request with user data.
     * @param {Response} response Express response.
     */
    run = async (request: RequestWithUser, response: Response) => {
        try {
            //We get the data from the request
            const { chatId } = request.params;
            const { type, content } = request.body;
            const userId = this.getUserIdFromRequest(request);
            //We set the message content with the expected structure
            const messageContent = this.getMessageStructure({ type, content });
            //We get the use case 
            const createChatMessage: CreateChatMessage = container.get(chatMessageDependencies.UseCases.CreateChatMessage);
            //We execute the use case
            const chatMessage: ChatMessage = await createChatMessage.run({ 
                from: userId, 
                chatId, 
                content: messageContent 
            });
            //We send the response
            response.status(httpStatus.OK).send(chatMessage.toPrimitives());
        } catch(exception) {
            this.handleBaseExceptions(exception, response);
        }
    }

    //Internal helpers
    /**
     * Method to get the ID of the user from the request object.
     */
    private getUserIdFromRequest = (request: RequestWithUser): string => {
        const { user } = request;
        if(!user)
            throw new UserNotAuthenticated();
        return user._id;
    }

    /**
     * Method to get the message content object in the required structure.
     * @param {string|undefined} type The message type.
     * @param {string|ChatMessageFileParameters} content The message content.
     * @returns 
     */
    private getMessageStructure = ({ 
        type, 
        content 
    }: ChatMessageRequestData) => ({
        type: type || ValidChatMessageTypes.TEXT, 
        content 
    })
}

interface ChatMessageRequestData {
    type?: ValidChatMessageTypes;
    content: string | ChatMessageFileParameters 
}