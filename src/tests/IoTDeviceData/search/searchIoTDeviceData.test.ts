//Domain
import IoTDeviceData from '../../../application/IoTDeviceData/domain/IoTDeviceData';
//Use cases
import SearchIoTDeviceData from '../../../application/IoTDeviceData/application/search/SearchIoTDeviceData';
//Shared domain
import PaginatedDataResult from '../../../application/Shared/domain/requests/PaginatedDataResult';
//Repository contract
import { IoTDeviceDataRepository } from '../../../application/IoTDeviceData/domain/IoTDeviceDataRepository';
//Mock repository
import { 
    createdIoTDeviceData, 
    iotDeviceDataRepositoryWithCreatedRecord 
} from '../create/createIoTDeviceData.test';


//Global variables
let searchIoTDeviceData: SearchIoTDeviceData;
let iotDeviceDataRepository: IoTDeviceDataRepository;
let foundIoTDeviceData: PaginatedDataResult<IoTDeviceData>;


//We set up the use case
beforeAll(async () => {
    //We get the repository and create the use case
    iotDeviceDataRepository = await iotDeviceDataRepositoryWithCreatedRecord();
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
