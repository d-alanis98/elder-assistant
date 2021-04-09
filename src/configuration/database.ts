//We initialize the dotenv library to get access to env variables
require('dotenv').config();
//ORM types
import { ValidORMTypes as DatabaseTypes } from "../application/Shared/infrastructure/Persistence/ORM/TypeORM/TypeORMConfig";

/**
 * Database configuration
 */

 const getValidType = () => (
    process.env['DATABASE_TYPE'] && 
    Object.values(DatabaseTypes).includes(<DatabaseTypes>process.env['DATABASE_TYPE'])
        ? process.env['DATABASE_TYPE']
        : DatabaseTypes.MONGODB
);


let databaseConfiguration: DatabaseParameters = { 
    url: process.env['DATABASE_URL'] || '',
    host: process.env['DATABASE_HOST'] || 'localhost',
    port: process.env['DATABASE_PORT'] || 3306,
    user: process.env['DATABASE_USER'] || '',
    type: getValidType(),
    secret: process.env['DATABASE_SECRET'] || '',
    database: process.env['DATABASE_NAME'] || '', 
};

export default databaseConfiguration;


interface DatabaseParameters {
    url?: string;
    host?: string;
    port?: number | string;
    user?: string;
    type: string;
    secret?: string;
    database: string;
};