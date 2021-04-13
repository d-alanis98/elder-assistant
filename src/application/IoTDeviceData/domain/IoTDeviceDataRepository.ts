//Domain
import IoTDeviceData from './IoTDeviceData';
import IoTDeviceDataId from './value-objects/IoTDeviceDataId';
//Shared domain
import { Nullable } from '../../Shared/domain/Nullable';
//Base repository specification
import { DataRepository, QueryParameters } from '../../Shared/infrastructure/Persistence/DataRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description IoTDeviceData repository specification.
 */
export interface IoTDeviceDataRepository extends DataRepository<IoTDeviceData> {
    //We only need the base methods of DataRepository interface (CRUD operations) and to specify that we must implement these optional methods:
    searchAll(filter: IoTDeviceDataId | Object, queryParameters?: QueryParameters): Promise<Nullable<IoTDeviceData[]>>;

    searchAllPaginated(filters: Object, queryParameters?: QueryParameters): Promise<Nullable<any>>
}