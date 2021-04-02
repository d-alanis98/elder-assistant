import { MongoClient } from 'mongodb';
//Domain
import { Nullable } from '../../../domain/Nullable';
//Configuration
import MongoConfig from './MongoConfig';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.0
 * @description Factory class to create and connect a Mongo client, with context handling capabilities, which is achieved 
 * by providing the context name. The created and connected clients are stored in the clients dictionary, which makes the
 * process of verifying the existance of the client very striaghtforward.
 */
export class MongoClientFactory {
    private static clients: { [key: string]: MongoClient } = {};

    /**
     * Singleton-like method to return a mongo client, retrieving it from the local clients dictionary, and creating a new one
     * if it does not exist for the specified context.
     * @param {string} contextName Context identifier fot the clients dictionary. 
     * @param {MongoConfig} config Configuration for the Mongo client.
     * @returns 
     */
    static async createClient(contextName: string, config: MongoConfig): Promise<MongoClient> {
        let client = MongoClientFactory.getClient(contextName);
        //We validate the client, if it does not exist, we create and register a new one
        if (!client) {
            client = await MongoClientFactory.createAndConnectClient(config);

            MongoClientFactory.registerClient(client, contextName);
        }
        //Finally, we return the client instance
        return client;
    }

    /**
     * Method to get the stored Mongo client for the specified context.
     * @param {string} contextName Context identifier fot the clients dictionary. 
     * @returns 
     */
    private static getClient(contextName: string): Nullable<MongoClient> {
        return MongoClientFactory.clients[contextName];
    }

    /**
     * Method to create and connect a new Mongo client with the specified configuration.
     * @param {MongoConfig} config Configuration for the Mongo client.
     * @returns 
     */
    private static async createAndConnectClient(config: MongoConfig): Promise<MongoClient> {
        const client = new MongoClient(config.url, { 
            ignoreUndefined: true,
            useUnifiedTopology: true, 
        });

        await client.connect();

        return client;
    }

    /**
     * Method to register a Mongo client in the local clients dictionary. 
     * @param {MongoClient} client The Mongo client reference.
     * @param {string} contextName Context identifier fot the clients dictionary. 
     */
    private static registerClient(client: MongoClient, contextName: string): void {
        MongoClientFactory.clients[contextName] = client;
    }
}
