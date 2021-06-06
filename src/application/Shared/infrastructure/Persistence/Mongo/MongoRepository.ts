import { Cursor, Collection, MongoClient } from 'mongodb';
import database from '../../../../../configuration/database';
//Domain
//Data extends this type, to get access to toPrimitives()
import AggregateRoot from '../../../domain/AggregateRoot';
//Helpers
import { QueryParameters } from '../DataRepository';
import MongoQueryCriteria from './MongoQueryCriteria';

/**
 * @author Damián Alanís Ramírez
 * @version 4.10.9
 * @description Repository to access the MongoDB database and specific collection.
 */
export abstract class MongoRepository<T extends AggregateRoot> {

    constructor(private _client: Promise<MongoClient>) { }

    /**
     * The collection's name.
     */
    protected abstract moduleName(): string;

    /**
     * Returns the reference to the mongo client.
     * @returns A promise to a mongo client.
     */
    protected client(): Promise<MongoClient> {
        return this._client;
    }

    /**
     * Returns the collection specified in moduleName() implementation.
     * @returns A promise to the mongo collection.
     */
    protected async collection(): Promise<Collection> {
        return (await this._client).db(database.database).collection(this.moduleName());
    }

    /**
     * Saves a document in the current collection.
     * @param {T} aggregateRoot Instance of the resource to create. 
     */
    protected createInCollection = async (aggregateRoot: T): Promise<void> => {
        const collection = await this.collection();

        const document = {
            ...aggregateRoot.toPrimitives()
        };

        await collection.insertOne(document);
    }

    /**
     * Searchs a document in the collection by it's id.
     * @param {string} id Resource ID. 
     * @returns 
     */
    protected findInCollection = async (id: string | Object): Promise<any> => {
        const collection = await this.collection();

        const document = typeof id === 'string'
            ? await collection.findOne({ _id: id.toString() })
            : await collection.findOne(id);
        //We return the document
        return document;
    }

    /**
     * Method to get all the records in a collection, by string id or object query.
     * @param {string|Object} filter Resource ID or query.
     * @param {Object} order Order criterion object.
     * @returns 
     */
    protected findAllInCollection = async (filter: string | Object, queryParameters?: QueryParameters): Promise<any[]> => {
        const collection = await this.collection();

        const documents = typeof filter === 'string'
            ? collection.find({ _id: filter })
            : collection.find(filter);

        const documentWithQueryParameters = queryParameters
            ? this.applyQueryParametersToResult(documents, queryParameters)
            : documents;

        return documentWithQueryParameters.toArray();
    }

    /**
     * Method to get all the elements that match the query parameters, in a paginated way, with the following structure:
     * @example
     * {
     *  data: [...], [...], ...,
     *  next: 'next_value_uri'
     * }
     * @note The next value must be the startingAt parameter of the next request to get the 'next' page.
     * @param {QueryParameters} queryParameters Object that contains the parameters for the pagination (order, limit, filterBy, startingAt?).
     * @param {Object} extraFilters Additional filters, the ones that we'd put in searchAll.
     * @returns 
     */
    protected findAllPaginated = async (queryParameters: QueryParameters, extraFilters: Object = { }) => {
        const collection = await this.collection();
        const documents = collection.find({
            ...MongoQueryCriteria.getPaginationFilter(queryParameters),
            ...extraFilters
        });
        //We apply the query parameters, like sort, limit, etc. And get the array.
        const documentWithQueryParameters = this.applyQueryParametersToResult(documents, queryParameters);
        const documentsArray = await documentWithQueryParameters.toArray();
        //We get the next document.
        const nextDocument = this.getNextDocument(documentsArray, queryParameters);
        //We get the next page, making use of the nextPage method, that determines if we are in the last page, returning null,
        //otherwise, it returns the identifier of the last document of this page, which will be compared in the following request
        //and will give us the starting point (with that document not included) of the next page data.
        const nextPage = await this.nextPage(nextDocument, extraFilters, queryParameters);
        //We return the pagination object
        return {
            data: documentsArray,
            next: nextPage,
        }
    }


    /**
     * Saves a document in the current collection.
     * @param {string} id Id of the resource to save.
     * @param {any} aggregateRoot Instance of the resource to save.
     */
    protected updateInCollection = async (id: string, aggregateRoot: T): Promise<void> => {
        const collection = await this.collection();

        const document = { ...aggregateRoot.toPrimitives(), _id: id };

        await collection.updateOne({ _id: id }, { $set: document }, { upsert: true });
    }

    /**
     * Deletes a document from the collection.
     * @param {string} id Id of the resoruce to be deleted. 
     */
    protected deleteFromCollection = async (id: string): Promise<void> => {
        const collection = await this.collection();
        await collection.deleteOne({ _id: id });
    }

    /**
     * Closes the Mongo client connection.
     */
    protected close = async () => {
        const client: MongoClient = await this._client;
        client.close();
    }

    //Internal helpers
    /**
     * Method to apply the provided query parameters to the query. 
     * Currently, it supports sort (by order property) and limit (by the limit property).
     * @param {Cursor<any>} documents The cursor instance that contains the search result. 
     * @param {QueryParameters} queryParameters The parameters to be applied to the query (sort, order, etc).
     * @returns 
     */
    private applyQueryParametersToResult = (documents: Cursor, queryParameters: QueryParameters) => {
        //We validate the documents
        if (!documents)
            return documents;
        let partialResult = documents;
        //We apply the query parameters
        if (queryParameters.order)
            partialResult = partialResult.sort(queryParameters.order);
        if (queryParameters.limit)
            partialResult = partialResult.limit(queryParameters.limit);
        return partialResult;
    }

    /**
     * Method to get the last element of the current page, which will be the point of comparison to get the next page on
     * another request.
     * @param {any[]} documentsArray Documents transformed to array.
     * @param {QueryParameters} queryParameters Pagination parameters. 
     * @returns 
     */
    private getNextDocument = (documentsArray: any[], queryParameters: QueryParameters) => {
        let numberOfDocuments = documentsArray.length;
        //We get the next element
        return numberOfDocuments >= 1
            ? documentsArray[numberOfDocuments - 1][queryParameters?.filterBy || '_id']
            : null;
    }

    /**
     * Method to determine if we are in the last page of the paginated collection, if so, we are returning null as next page.
     * Otherwise, we return the last page to start the comparison there in the next request.
     * @param {any} nextDocument The next document identifier.
     * @param {Object} filters The collection filters (excluding the pagination filters).
     * @param {QueryParameters} queryParameters Parameters, we are going to take the order and the filterBy properties.
     * @returns 
     */
    private nextPage = async (nextDocument: any, filters: Object = { }, queryParameters: QueryParameters) => {
        const collection = await this.collection();
        const documents = collection.find(filters);
        if(!queryParameters.order || !queryParameters.filterBy)
            return null;
        //We get the complete sorted collection (without pagination filters) and find the next document (the last one)
        let partialResults = await documents.sort(queryParameters.order).toArray(),
        finalDocument = this.getNextDocument(partialResults, queryParameters);
        //If the last document of the sorted collection is the same as the nextDocument, we indicate that this is the last page by returning null.
        if(finalDocument === nextDocument)
            return null;
        return nextDocument;
    }
}