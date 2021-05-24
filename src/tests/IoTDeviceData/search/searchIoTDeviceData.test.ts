//Domain
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData';
//Use cases
import CreateIoTDeviceData from '../../../application/IoTDeviceData/application/create/CreateIoTDeviceData';
import SearchIoTDeviceData from '../../../application/IoTDeviceData/application/search/SearchIoTDeviceData';
//Shared domain
import Uuid from '../../../application/Shared/domain/value-object/Uuid';
import PaginatedDataResult from '../../../application/Shared/domain/requests/PaginatedDataResult';
//Repository contract
import { IoTDeviceDataRepository } from '../../../application/IoTDeviceData/domain/IoTDeviceDataRepository';
//Mock repository
import InMemoryRepository from '../../Shared/infrastructure/Persistence/InMemoryRepository';


//Global variables
let searchIoTDeviceData: SearchIoTDeviceData;
let createdIoTDeviceData: IoTDeviceData;
let foundIoTDeviceData: PaginatedDataResult<IoTDeviceData>;
const iotDeviceDataRepository: IoTDeviceDataRepository = new InMemoryRepository<IoTDeviceData>();

//Mock data
const deviceData = {
    key: 'HeartRate',
    value: '110bpm',
    deviceId: Uuid.random().toString()
}

//We set up the use case
beforeAll(async () => {
    //We create and IoT device data record
    const createIoTDeviceData: CreateIoTDeviceData = new CreateIoTDeviceData(iotDeviceDataRepository);
    createdIoTDeviceData = await createIoTDeviceData.run(deviceData);
    //We create the use case
    searchIoTDeviceData = new SearchIoTDeviceData(iotDeviceDataRepository);
    //We execute the use case
    foundIoTDeviceData = await searchIoTDeviceData.byDeviceId({
        limit: undefined,
        deviceId: createdIoTDeviceData.deviceId.toString(),
        startingAt: undefined
    });
});

//We test the IoT device data search use case
it('IoT device data is found by device ID', () => {
    expect(foundIoTDeviceData.data).toContainEqual(createdIoTDeviceData.toPrimitives());
});

//We test the last IoT device data record
it('Last IoT device data is retrieved by event key and device ID', async () => {
    const foundRecord = await searchIoTDeviceData.lastRecordByDeviceIdAndEventType({
        eventKey: createdIoTDeviceData.key.toString(),
        deviceId: createdIoTDeviceData.deviceId.toString()
    });
    expect(foundRecord).toMatchObject(createdIoTDeviceData.toPrimitives());
});
