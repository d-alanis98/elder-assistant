//Domain
import IoTDevice from './IoTDevice';
import IoTDeviceId from './value-objects/IoTDeviceId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
//Base repository specification
import { DataRepository } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description IoTDevice repository specification.
 */
export interface IoTDeviceRepository extends DataRepository<IoTDevice> {
    //We only need the base methods of DataRepository interface (CRUD operations)
    searchAll(query: IoTDeviceId | Object): Promise<Nullable<IoTDevice[]>>;
}