//Domain
import IoTDevice, { IoTDevicePrimitives } from '../../../../application/IoTDevice/domain/IoTDevice';
import IoTDeviceId from '../../../../application/IoTDevice/domain/value-objects/IoTDeviceId';
//Repository contract
import { IoTDeviceRepository } from '../../../../application/IoTDevice/domain/IoTDeviceRepository';
//Shared domain
import { Nullable } from '../../../../application/Shared/domain/Nullable';
//Mock repository
import InMemoryRepository from '../Persistence/InMemoryRepository';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Mock IoTDevice repository implementing in-memory data storage.
 */
export default class IoTDeviceMockRepository implements IoTDeviceRepository {
    private inMemoryRepository: InMemoryRepository<IoTDevice>;

    constructor() {
        this.inMemoryRepository = new InMemoryRepository<IoTDevice>();
    }

    search = async (id: string | IoTDeviceId) => {
        const document = await this.inMemoryRepository.search(id);
        return document 
            ? IoTDevice.fromPrimitives(document)
            : undefined;
    }

    searchAll = async (id: any): Promise<Nullable<IoTDevice[]>> => {
        const documents: Nullable<IoTDevicePrimitives[]> = await this.inMemoryRepository.searchAll(id);
        return documents 
            ? documents.map((document: IoTDevicePrimitives) => IoTDevice.fromPrimitives(document))
            : undefined;
    }

    update = async (iotDevice: IoTDevice) => {
        await this.inMemoryRepository.update(iotDevice);
    }

    delete = async (id: any) => {
        await this.inMemoryRepository.delete(id);
    }

    create = async (iotDevice: IoTDevice) => {
        await this.inMemoryRepository.create(iotDevice);
    }
    
}

