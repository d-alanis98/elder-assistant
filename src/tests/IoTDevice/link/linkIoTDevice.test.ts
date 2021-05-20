//IoTDevice domain
import IoTDevice from '../../../application/IoTDevice/domain/IoTDevice';
//Use cases
import LinkIoTDevice from '../../../application/IoTDevice/application/link/LinkIoTDevice';
//IoT device repository contract
import { IoTDeviceRepository } from '../../../application/IoTDevice/domain/IoTDeviceRepository';
//Mock repository
import UserRepository from '../../../application/User/domain/UserRepository';
//Mock users
import { primaryUser } from '../../Shared/domain/User/testUsers';
//Mock devices
import { createdIoTDevice } from '../create/createIoTDevice.test';
//Mock repositories
import mockUsersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
import { iotDeviceRepositoryWithCreatedDevice } from '../create/createIoTDevice.test';


//Global variables
export let linkedIoTDevice: IoTDevice;
const usersRepository: UserRepository = mockUsersRepository;
let iotDeviceRepository: IoTDeviceRepository;

export const iotDeviceRepositoryWithLinkedDevice = async () => {
    //We get the devices repository with a created device
    iotDeviceRepository = await iotDeviceRepositoryWithCreatedDevice();
    //We create the link use case
    const linkIoTDevice: LinkIoTDevice = new LinkIoTDevice(usersRepository, iotDeviceRepository);
    //We execute the use case
    linkedIoTDevice = await linkIoTDevice.run({
        userId: primaryUser.id.toString(),
        deviceId: createdIoTDevice.id.toString()
    });
    return iotDeviceRepository;
}

//We set up the use case
beforeAll(async () => {
    await iotDeviceRepositoryWithLinkedDevice();
});

//We test the IoT device link use case
it('The device is linked successfully to the user', () => {
    expect(linkedIoTDevice.ownedBy?.toString()).toBe(primaryUser.id.toString()); 
});