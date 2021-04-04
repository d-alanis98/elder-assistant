import { Collection, MongoClient } from 'mongodb';
import database from '../../../../../configuration/database';
//Domain
//Data extends this type, to get access to toPrimitives()
import AggregateRoot from '../../../domain/AggregateRoot';

/**
 * @author Damián Alanís Ramírez
 * @version 3.3.4
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
    protected findInCollection = async (id: string): Promise<any> => {
        const collection = await this.collection();

        const document = await collection.findOne({ _id: id.toString() });
        //We return the user, creating it from primitives, if the document exists, otherwise returning null
        return document;
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

}
