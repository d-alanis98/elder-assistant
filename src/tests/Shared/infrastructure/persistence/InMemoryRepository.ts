//Shared domain
import AggregateRoot from '../../../../application/Shared/domain/AggregateRoot';
import { Nullable } from '../../../../application/Shared/domain/Nullable';
//Repository contract
import { DataRepository } from '../../../../application/Shared/infrastructure/Persistence/DataRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description In memory repository implementation, for testing porpouses.
 */
export default class InMemoryRepository<T extends AggregateRoot> implements DataRepository<T> {
    private data: BasePrimitiveValue[];

    constructor(initialData?: BasePrimitiveValue[]) {
        this.data = initialData || [];
    }

    create = async (value: T): Promise<void> => {
        this.data.push(value.toPrimitives());
    }

    search = async (id: any): Promise<Nullable<any>> => {
        if(typeof id === 'string' || id.value !== undefined) {
            const itemId = id.toString();
            return this.data.find(item => item._id === itemId)
        } else {
            const filterKey: string = Object.keys(id)[0];
            const filterValue = Object.values(id)[0];
            return this.data.find(item => item[filterKey as keyof BasePrimitiveValue] === filterValue);
        }
    }

    update = async (value: T): Promise<void> => {
        this.data = this.data.map(item => item._id === value.aggregateId.toString()
            ? value.toPrimitives()
            : item
        );
    }

    delete = async (id: any): Promise<void> => {
        this.data = this.data.filter(item => item._id !== id.toString());
    }

    searchAll = async (filters?: Object): Promise<Nullable<any[]>> => {
        let filteredData = this.data;
        if(filters)
            Object.entries(filters).map(([filter, value]) => {
                filteredData = filteredData.filter(item => item[filter as keyof BasePrimitiveValue] === value);
            }); 
        return filteredData;
    }

    searchAllPaginated = async (filters?: Object): Promise<Nullable<any>> => {
        let filteredData = this.data;
        if(filters)
            Object.entries(filters).map(([filter, value]) => {
                filteredData = filteredData.filter(item => item[filter as keyof BasePrimitiveValue] === value);
            }); 
        return {
            data: filteredData,
            next: null
        }
    }
}

interface BasePrimitiveValue extends Object {
    _id: string;
}