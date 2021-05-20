import { 
    Connection,
    //Entities
    Entity as TypeORMEntity, 
    Column as TypeORMColumn, 
    PrimaryColumn as TypeORMPrimaryColumn, 
    //Events listeners decorators
    AfterInsert as TypeORMAfterInsert, 
    AfterUpdate as TypeORMAfterUpdate,
    AfterRemove as TypeORMAfterRemove,
    Repository,
} from 'typeorm';
//Infrastructure
import ORMEvents from '../ORMEvents';
import ORMProvider from '../ORMProvider';

export default abstract class TypeORMRepository<T> implements ORMProvider, ORMEvents {
    private _connection: Promise<Connection>;


    constructor(connection: Promise<Connection>) {
        this._connection = connection;
    }

    public connection = async (): Promise<Connection> => (
        await this._connection
    );

    public repository = async (entity: any): Promise<Repository<T>> => (
        (await this.connection()).getRepository(entity)
    );

    public Entity = () => TypeORMEntity;

    public Column = () => TypeORMColumn;

    public PrimaryColumn = () => TypeORMPrimaryColumn;

    public AfterInsert = () => TypeORMAfterInsert;

    public AfterUpdate = () => TypeORMAfterUpdate;

    public AfterRemove = () => TypeORMAfterRemove;


}

