import { Router } from 'express';
//Dependency injection
import container from '../dependency-injection';
import { iotDeviceDependencies } from '../../application/Shared/domain/constants/dependencies';
//Middlewares
import UserAuthorization from '../middleware/User/UserAuthorization';
import UserAuthentication from '../middleware/User/UserAuthentication';
import IoTDeviceValidation from '../middleware/IoTDevice/IoTDeviceValidation';
//Controllers
import IoTDeviceCreateController from '../controllers/IoTDevice/IoTDeviceCreateController';
import IoTDeviceFindController from '../controllers/IoTDevice/IoTDeviceFindController';
import IoTDeviceLinkController from '../controllers/IoTDevice/IoTDeviceLinkController';


export const register = (router: Router) => {
    //Create device
    const iotDeviceCreateController: IoTDeviceCreateController = container.get(iotDeviceDependencies.Controllers.IoTDeviceCreateController);
    router.post(
        '/iot/device',
        //We validate the presence of the JWT, and we pass the user in the request to the next middlewares
        UserAuthentication.validateAuthToken,
        //We validate the admin role, only admins can create a new IoT device
        UserAuthorization.validateAdminRole,
        //We validate the body of the request, according to the rules in the validator
        IoTDeviceValidation.creationValidator(),
        //Finally, we provide the controller to handle the request
        iotDeviceCreateController.run.bind(iotDeviceCreateController)
    );

    //Find device by id
    const iotDeviceFindController: IoTDeviceFindController = container.get(iotDeviceDependencies.Controllers.IoTDeviceFindController);
    router.get(
        '/iot/device/:deviceId',
        UserAuthentication.validateAuthToken,
        //UserAuthorization.validateAllowedRole,
        iotDeviceFindController.run.bind(iotDeviceFindController)
    );

    //Get devices owned by a user
    router.get(
        '/iot/devices',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceFindController.findByUserId.bind(iotDeviceFindController)
    );

    //Link device to user
    const iotDeviceLinkController: IoTDeviceLinkController = container.get(iotDeviceDependencies.Controllers.IoTDeviceLinkController);
    router.post(
        '/iot/device/:deviceId/link',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceLinkController.run.bind(iotDeviceLinkController)
    );
}