//Use cases
import UpdateIoTDevice from '../../../application/IoTDevice/application/update/UpdateIoTDevice';
//IoT device repository contract
import { IoTDeviceRepository } from '../../../application/IoTDevice/domain/IoTDeviceRepository';
//User repository contract
import UserRepository from '../../../application/User/domain/UserRepository';
//Mock users repository
import mockUsersRepository from '../../Shared/infrastructure/User/mockUsersRepository';
//Mock iot device repository with data
import { createdIoTDevice } from '../create/createIoTDevice.test';
import { iotDeviceRepositoryWithLinkedDevice } from '../link/linkIoTDevice.test';



//Global variables
let updateIoTDevice: UpdateIoTDevice;
const usersRepository: UserRepository = mockUsersRepository;
let iotDeviceRepository: IoTDeviceRepository;

//We initialize the use case
beforeAll(async () => {
    //We get the IoT device repository with a created device
    iotDeviceRepository = await iotDeviceRepositoryWithLinkedDevice();
    //We create the find IoT device use case
    updateIoTDevice = new UpdateIoTDevice(usersRepository, iotDeviceRepository); 
});

//We test the IoT device name update
it('IoT device name is updated successfully', async () => {
    const updatedName = 'Updated name';
    const updatedIoTDevice = await updateIoTDevice.run({ 
        _id: createdIoTDevice.id.toString(),
        name: updatedName
    });
    expect(updatedIoTDevice.toPrimitives().name).toBe(updatedName);
});


//We test the IoT device configuration update
it('IoT device configuration is updated successfully', async () => {
    const updatedConfiguration = {
        testProperty: 'test_value'
    };
    const updatedIoTDevice = await updateIoTDevice.run({ 
        _id: createdIoTDevice.id.toString(),
        configuration: updatedConfiguration
    });
    expect(updatedIoTDevice.toPrimitives().configuration).toEqual(updatedConfiguration);
});

//We test the IoT device configuration update
it('IoT device owner is reset', async () => {
    const updatedIoTDevice = await updateIoTDevice.run({ 
        _id: createdIoTDevice.id.toString(),
        restoreOwner: true
    });
    expect(updatedIoTDevice.toPrimitives().ownedBy).toBeUndefined();
});
