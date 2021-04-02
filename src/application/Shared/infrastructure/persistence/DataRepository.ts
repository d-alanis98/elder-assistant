import { Nullable } from "../../domain/Nullable";

export interface DataRepository<T> {
    save(value: T): Promise<void>;

    search(id: any): Promise<Nullable<T>>;
}
