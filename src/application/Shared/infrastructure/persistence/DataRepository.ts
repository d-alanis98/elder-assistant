import { Nullable } from '../../domain/Nullable';

/**
 * @author Damián Alanís Ramírez
 * @version 2.1.2
 * @description Data repository generic methods to implement CRUD operations.
 */
export interface DataRepository<T> {
    create(value: T): Promise<void>;

    search(id: any): Promise<Nullable<T>>;

    update(value: T): Promise<void>;

    delete(id: any): Promise<void>;

}
