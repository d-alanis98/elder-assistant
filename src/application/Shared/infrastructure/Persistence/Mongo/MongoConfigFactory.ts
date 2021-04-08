import MongoConfig from './MongoConfig';
//Configuration
import database from '../../../../../configuration/database';

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * Factory class with a single entry point, which returns a configuration object for the MongoDB connection.
 */
export class MongoConfigFactory {
    static createConfig(): MongoConfig {
        return {
            url: database.url,
            database: database.database
        };
    }
}