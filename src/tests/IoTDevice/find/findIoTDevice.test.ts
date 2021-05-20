//Use cases
import FindIoTDevice from '../../../application/IoTDevice/application/find/FindIoTDevice';
//IoT device repository contract
import { IoTDeviceRepository } from '../../../application/IoTDevice/domain/IoTDeviceRepository';
//User repository contract
import UserRepository from '../../../application/User/domain/UserRepository';
//Mock users repository
import mockUsersRepository from '../../Shared/domain/User/mockUsersRepository';
import { primaryUser } from '../../Shared/domain/User/testUsers';
//Mock iot device repository with data
import { createdIoTDevice } from '../create/createIoTDevice.test';
import { linkedIoTDevice, iotDeviceRepositoryWithLinkedDevice } from '../link/linkIoTDevice.test';


//Global variables
let findIoTDevice: FindIoTDevice;
const usersRepository: UserRepository = mockUsersRepository;
let iotDeviceRepository: IoTDeviceRepository;

//We initialize the use case
beforeAll(async () => {
    //We get the IoT device repository with a created device
    iotDeviceRepository = await iotDeviceRepositoryWithLinkedDevice();
    //We create the find IoT device use case
    findIoTDevice = new FindIoTDevice(usersRepository, iotDeviceRepository); 
});

//We test the IoT device search by ID
it('IoT device is successfully found by ID', async () => {
    const foundIoTDevice = await findIoTDevice.run({ id: createdIoTDevice.id.toString() });
    expect(foundIoTDevice.toPrimitives()).toMatchObject(createdIoTDevice.toPrimitives());
});


//We test the IoT device search by owner ID
it('IoT device is successfully found by owner ID', async () => {
    const foundIoTDevice = await findIoTDevice.byUserId({ userId: primaryUser.id.toString() });
    const primitiveFoundIoTDevice = foundIoTDevice.map(device => device.toPrimitives());
    expect(primitiveFoundIoTDevice).toContainEqual(linkedIoTDevice.toPrimitives());
});
