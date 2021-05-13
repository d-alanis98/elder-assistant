//Domain
import ChatMessage from '../../domain/ChatMessage';
import ChatMessageId from '../../domain/value-objects/ChatMessageId';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
import { defaultQueryParameters, QueryParameters } from '../../../Shared/infrastructure/Persistence/DataRepository';
//Contract
import ChatMessageRepository, { PaginatedChatMessages } from '../../domain/ChatMessageRepository';
//Base repository
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description Mongo DB repository for the ChatMessages collection.
 */
export default class MongoChatMessageRepository
    extends MongoRepository<ChatMessage>
    implements ChatMessageRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'ChatMessages';

    /**
     * Searchs a chatMessage in the collection, by the provided filter.
     * @param {Object} filter Filter to apply to the query.
     * @returns 
     */
    search = async (filter: ChatMessageId | Object): Promise<Nullable<ChatMessage>> => {
        const document = await this.findInCollection(filter);
        //We return the chatMessage, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? ChatMessage.fromPrimitives(document)
            : null;
    }

    /**
     * Method to get all the records in the repository, based on a query, wheter by ID or a different query represented with
     * an object.
     * @param {Object} filter Filter to apply to the records.
     * @param {QueryParamaters} queryParameters Extra parameters like limit, order, etc.
     * @returns 
     */
    searchAll = async (filter: Object, queryParameters: QueryParameters): Promise<Nullable<ChatMessage[]>> => {
        //We get the documents
        const documents = await this.findAllInCollection(
            filter, 
            queryParameters || { order: { issuedAt: -1 } }
        );
        //We return the items
        return documents 
            ? documents.map(document => ChatMessage.fromPrimitives(document))
            : null;
    }

    /**
     * Method to get all the results in a paginated way, with the following structure:
     * @example
     * {
     *  data: [...], [...], ...,
     *  next: 'next_value_uri'
     * }
     * @note The next value must be the startingAt parameter of the next request to get the 'next' page.
     * @param {Object} filters The filters to apply to the query (i.e: get data by deviceID).
     * @param {QueryParameters} queryParameters Parameters for the pagination.
     * @returns 
     */
    searchAllPaginated = async (
        filters: Object, 
        queryParameters?: QueryParameters
    ): Promise<Nullable<PaginatedChatMessages>> => {
        const documents = await this.findAllPaginated(
            queryParameters 
                ? { ...defaultQueryParameters, ...queryParameters } //We merge the parameters (with the provided parameters overriding the default ones if they exist)
                : defaultQueryParameters, 
            filters
        );
        //We return the items
        return documents 
            ? ({
                data: documents.data.map(document => (
                    ChatMessage.fromPrimitives(document))
                ),
                next: documents.next
            })
            : null;
    }

    /**
     * Creates a new document (chatMessage) in the collection.
     * @param {ChatMessage} chatMessage The chatMessage domain entity instance.
     * @returns 
     */
    create = async (chatMessage: ChatMessage) => {
        return this.createInCollection(chatMessage);
    }

    /**
     * Updates a chatMessage in the repository.
     * @param {ChatMessage} chatMessage The chatMessage instance with the data to save 
     * @returns 
     */
    public update = async (chatMessage: ChatMessage): Promise<void> => {
        return await this.updateInCollection(chatMessage.id.toString(), chatMessage);
    }

    /**
     * Deletes a chatMessage from the repository.
     * @param {ChatMessageId} id ID of the chatMessage.
     */
    public delete = async (id: ChatMessageId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }

    /**
     * Method to specify the database collection to use.
     * @returns The collection name.
     */
    moduleName = () => this.COLLECTION;
}