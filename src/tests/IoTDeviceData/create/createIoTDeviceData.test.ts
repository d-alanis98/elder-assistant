import CreateIoTDeviceData from '../../../application/IoTDeviceData/application/create/CreateIoTDeviceData';
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData'
import Uuid from '../../../application/Shared/domain/value-object/Uuid';
import InMemoryRepository from '../../Shared/infrastructure/persistence/InMemoryRepository'


//Global variables
const iotDeviceDataRepository = new InMemoryRepository<IoTDeviceData>();
const createIoTDeviceData: CreateIoTDeviceData = new CreateIoTDeviceData(iotDeviceDataRepository);
export let createdIoTDeviceData: IoTDeviceData;

//Mock data
const deviceData = {
    key: 'HeartRate',
    value: '70bpm',
    deviceId: Uuid.random().toString()
}

export const iotDeviceDataRepositoryWithCreatedRecord = async () => {
    //We execute the use case
    createdIoTDeviceData = await createIoTDeviceData.run(deviceData);
    return iotDeviceDataRepository;
}

//We set up the use case
beforeAll(async () => {
    await iotDeviceDataRepositoryWithCreatedRecord();
});

//We test the IoT device data creation by the use case
it('IoT device data is created successfully', () => {
    expect(createdIoTDeviceData.toPrimitives()).toMatchObject(deviceData);
});

//We test the IoT device data primitives persistence in the IoT device data repository
it('IoT device is stored correctly in the data repository', async () => {
    const createdIoTDeviceInDatabase = iotDeviceDataRepository.search(createdIoTDeviceData.id.toString());
    expect(createdIoTDeviceData.toPrimitives()).toMatchObject(createdIoTDeviceInDatabase);
});