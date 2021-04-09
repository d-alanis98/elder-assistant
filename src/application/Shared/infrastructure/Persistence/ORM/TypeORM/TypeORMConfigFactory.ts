import TypeORMConfig, { ValidORMTypes } from './TypeORMConfig';
//Configuration
import database from '../../../../../../configuration/database';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * Factory class with a single entry point, which returns a configuration object for the TypeORM connection.
 */
export class TypeORMConfigFactory {
    static createConfig(): TypeORMConfig {
        return {
            url: database.url || '',
            type: ValidORMTypes.MONGODB,
            database: database.database,
            authSource: 'admin',
            useUnifiedTopology: true,
        };
    }
}