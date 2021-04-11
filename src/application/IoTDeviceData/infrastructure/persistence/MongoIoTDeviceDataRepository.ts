//IoTDeviceData domain
import IoTDeviceData from '../../domain/IoTDeviceData';
import IoTDeviceDataId from '../../domain/value-objects/IoTDeviceDataId';
//Domain repository
import { IoTDeviceDataRepository } from '../../domain/IoTDeviceDataRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Infrastructure
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';



/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mongo DB repository for the IoTDeviceData collection.
 */
export default class MongoIoTRepository 
    extends MongoRepository<IoTDeviceData> 
    implements IoTDeviceDataRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'IoTDeviceData';
    /**
     * Creates a new document (device  data entry) in the collection.
     * @param {IoTDeviceData} device The device domain instance.
     * @returns 
     */
    public create = async (deviceData: IoTDeviceData): Promise<void> => {
        return this.createInCollection(deviceData);
    }

    /**
     * Searchs a device data entry in the collection, by ID.
     * @param {string} id ID of the device data record.
     * @returns 
     */
    public search = async (id: IoTDeviceDataId): Promise<Nullable<IoTDeviceData>> => {
        const document = await this.findInCollection(id.toString());
        //We return the device, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? IoTDeviceData.fromPrimitives({
                _id: id.toString(),
                ...document,
            })
            : null;
    }

    /**
     * Method to get all the records in the repository, based on a query, wheter by ID or a different query represented with
     * an object.
     * @param {IoTDeviceDataId|Object} query Query, wheter the ID of the resoruce of a query represented in an object.
     * @returns 
     */
    public searchAll = async (query: IoTDeviceDataId | Object): Promise<Nullable<IoTDeviceData[]>> => {
        //We get the id or query
        const id: string | Object = query instanceof IoTDeviceDataId
            ? query.toString()
            : query;
        //We get the documents
        const documents = await this.findAllInCollection(id);
        //We return the items
        return documents 
            ? documents.map(document => IoTDeviceData.fromPrimitives(document))
            : null;
    }

    /**
     * Updates a device data record.
     * @param {IoTDeviceData} deviceData The device data instance with the data to save. 
     * @returns 
     */
    public update = async (deviceData: IoTDeviceData): Promise<void> => {
        return await this.updateInCollection(deviceData.id.toString(), deviceData);
    }

    /**
     * Deletes a device data entry from the repository.
     * @param {IoTDeviceDataId} id ID of the device data.
     */
    public delete = async (id: IoTDeviceDataId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }


    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    protected moduleName = (): string => this.COLLECTION;
}