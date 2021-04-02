import { Collection, MongoClient } from 'mongodb';
import database from '../../../../../configuration/database';
//Domain
//Data extends this type, to get access to toPrimitives() and to fromPrimitives()
import AggregateRoot from '../../../domain/AggregateRoot';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
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
     * Saves a resource to the current collection.
     * @param {string} id Id of the resource to save.
     * @param {any} aggregateRoot Instance of the resource to save.
     */
    protected async persist(id: string, aggregateRoot: T): Promise<void> {
        const collection = await this.collection();

        const document = { ...aggregateRoot.toPrimitives(), _id: id };


        await collection.updateOne({ _id: id }, { $set: document }, { upsert: true });
    }

    protected close = async () => {
        const client: MongoClient = await this._client;
        client.close();
    }

}
