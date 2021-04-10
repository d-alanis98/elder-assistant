//IoTDevice domain
import IoTDevice from '../../domain/IoTDevice';
import IoTDeviceId from '../../domain/value-objects/IoTDeviceId';
//Domain repository
import { IoTDeviceRepository } from '../../domain/IoTDeviceRepository';
//Shared domain
import { Nullable } from '../../../Shared/domain/Nullable';
//Infrastructure
import { MongoRepository } from '../../../Shared/infrastructure/Persistence/Mongo/MongoRepository';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mongo DB repository for the IoTDevice collection.
 */
export default class MongoIoTRepository extends MongoRepository<IoTDevice> implements IoTDeviceRepository {
    //Collection to be used in the operations across the use cases
    readonly COLLECTION = 'IoTDevices';
    /**
     * Creates a new document (device) in the collection.
     * @param {IoTDevice} device The device domain instance.
     * @returns 
     */
    public create = async (device: IoTDevice): Promise<void> => {
        return this.createInCollection(device);
    }

    /**
     * Searchs a device in the collection, by ID.
     * @param {string} id ID of the device.
     * @returns 
     */
    public search = async (id: IoTDeviceId): Promise<Nullable<IoTDevice>> => {
        const document = await this.findInCollection(id.toString());
        //We return the device, creating it from primitives, if the document exists, otherwise returning null
        return document
            ? IoTDevice.fromPrimitives({
                _id: id.toString(),
                ...document,
            })
            : null;
    }

    public searchAll = async (query: IoTDeviceId | Object): Promise<Nullable<IoTDevice[]>> => {
        //We get the id or query
        const id: string | Object = query instanceof IoTDeviceId
            ? query.toString()
            : query;
        //We get the documents
        const documents = await this.findAllInCollection(id);
        //We return the items
        return documents 
            ? documents.map(document => IoTDevice.fromPrimitives(document))
            : null;
    }

    /**
     * Updates a device
     * @param {IoTDevice} device The device instance with the data to save 
     * @returns 
     */
    public update = async (device: IoTDevice): Promise<void> => {
        return await this.updateInCollection(device.id.toString(), device);
    }

    /**
     * Deletes a device from the repository.
     * @param {IoTDeviceId} id ID of the device.
     */
    public delete = async (id: IoTDeviceId): Promise<void> => {
        await this.deleteFromCollection(id.toString());
    }


    /**
     * The collection to use.
     * @returns {string} The collection name.
     */
    protected moduleName = (): string => this.COLLECTION;
}