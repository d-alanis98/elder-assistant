//Domain
import Chat from '../../domain/Chat';
import ChatId from '../../domain/value-objects/ChatId';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Repository contract
import ChatRepository from '../../domain/ChatRepository';
//Infrastructure
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mongo DB repository for the Chats collection.
 */
export default class MongoChatRepository
    extends MongoRepository<Chat>
    implements ChatRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'Chats';

    /**
     * Searchs a chat in the collection, by the provided filter.
     * @param {Object} filter Filter to apply to the query.
     * @returns 
     */
    search = async (filter: ChatId | Object): Promise<Nullable<Chat>> => {
        const document = await this.findInCollection(filter);
        //We return the chat, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? Chat.fromPrimitives(document)
            : null;
    }

    /**
     * Creates a new document (chat) in the collection.
     * @param {Chat} chat The chat domain entity instance.
     * @returns 
     */
    create = async (chat: Chat) => {
        return this.createInCollection(chat);
    }

    /**
     * Updates a chat in the repository.
     * @param {Chat} chat The chat instance with the data to save 
     * @returns 
     */
    public update = async (chat: Chat): Promise<void> => {
        return await this.updateInCollection(chat.id.toString(), chat);
    }

    /**
     * Deletes a chat from the repository.
     * @param {ChatId} id ID of the chat.
     */
    public delete = async (id: ChatId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }

    /**
     * Method to specify the database collection to use.
     * @returns The collection name.
     */
    moduleName = () => this.COLLECTION;
}