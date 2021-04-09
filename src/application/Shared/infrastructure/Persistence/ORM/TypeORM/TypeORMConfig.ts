
/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description TypeORM configuration specification.
 */
export default interface TypeORMConfig {
    type: ValidORMTypes;
    url: string;
    database: string;
    authSource: string;
    useUnifiedTopology: boolean;
}


export enum ValidORMTypes {
    MYSQL = 'mysql',
    ORACLE = 'oracle',
    MONGODB = 'mongodb',
};
