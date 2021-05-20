//IoTDevice domain
import IoTDevice from '../../../application/IoTDevice/domain/IoTDevice';
import { IoTDeviceValidTypes } from '../../../application/IoTDevice/domain/value-objects/IoTDeviceType';
//Use cases
import CreateIoTDevice from '../../../application/IoTDevice/application/create/CreateIoTDevice';
//IoT device repository contract
import { IoTDeviceRepository } from '../../../application/IoTDevice/domain/IoTDeviceRepository';
//Mock repository
import IoTDeviceMockRepository from '../../Shared/infrastructure/IoTDevice/IoTDeviceMockRepository';


//Global variables
let createIoTDevice: CreateIoTDevice;
export let createdIoTDevice: IoTDevice;
const iotDeviceRepository: IoTDeviceRepository = new IoTDeviceMockRepository();

//Const device parameters
const deviceParameters = {
    name: 'Test IoT device',
    type: IoTDeviceValidTypes.WEARABLE
}

//Device creation
export const iotDeviceRepositoryWithCreatedDevice = async () => {
    createIoTDevice = new CreateIoTDevice(iotDeviceRepository);
    createdIoTDevice = await createIoTDevice.run(deviceParameters);
    return iotDeviceRepository;
}

//We initialize the use case
beforeAll(async () => {
    await iotDeviceRepositoryWithCreatedDevice();
});

//We test the IoT device creation by the use case
it('IoT device is successfully created by the use case', () => {
    expect(createdIoTDevice.toPrimitives()).toMatchObject(deviceParameters);
});

//We test the IoT device primitives persistence in the IoT device repository
it('IoT device is stored correctly in the data repository', async () => {
    const createdIoTDeviceInDatabase = iotDeviceRepository.search(createdIoTDevice.id.toString());
    expect(createdIoTDevice.toPrimitives()).toMatchObject(createdIoTDeviceInDatabase);
});