//Domain
import IoTDeviceData from './IoTDeviceData';
import IoTDeviceDataId from './value-objects/IoTDeviceDataId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
//Base repository specification
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoTDeviceData repository specification.
 */
export interface IoTDeviceDataRepository extends DataRepository<IoTDeviceData> {
    //We only need the base methods of DataRepository interface (CRUD operations)
    searchAll(query: IoTDeviceDataId | Object): Promise<Nullable<IoTDeviceData[]>>;
}