import { createConnection, Connection } from 'typeorm';
import User from '../../../../../User/domain/entities/User';
import { Nullable } from '../../../../domain/Nullable';
import TypeORMConfig from './TypeORMConfig';

export default class TypeORMClientFactory {
    private static connections: { [key: string]: Connection } = {};


    static createClient = async (
        contextName: string,
        configuration: TypeORMConfig
    ): Promise<Connection> => {
        let client = TypeORMClientFactory.getClient(contextName);
        //We validate the client, if it does not exist, we create and register a new one
        if (!client) {
            client = await TypeORMClientFactory.createAndConnectClient(configuration);
            //We register the created client in the connections map
            TypeORMClientFactory.registerClient(client, contextName);
        }
        return client;
    }

    private static getClient = (contextName: string): Nullable<Connection> => {
        return TypeORMClientFactory.connections[contextName];
    }

    /**
     * Method to create and connect a new TypeORM client with the specified configuration.
     * @param {TypeORMConfig} config Configuration for the TypeORM client.
     * @returns 
     */
    private static createAndConnectClient = async (
        configuration: TypeORMConfig
    ): Promise<Connection> => {
        //We create the client
        const client = await createConnection({
            "type": "mongodb", 
            "host": "localhost", 
            "port": 27017, 
            "database": "elder-assistant", 
            "synchronize": true, 
            "logging": false,
            "authSource": 'admin',
            ssl: false,
            useUnifiedTopology: true,
            entities: [
                User
            ]
        });
        console.log(client)
        //We connect the client
        //await client.connect();

        return client;
    }

    /**
     * Method to register a TypeORM connection in the local connections dictionary. 
     * @param {Connection} client The TypeORM Connection reference.
     * @param {string} contextName Context identifier fot the connections dictionary. 
     */
    private static registerClient(client: Connection, contextName: string): void {
        TypeORMClientFactory.connections[contextName] = client;
    }

}