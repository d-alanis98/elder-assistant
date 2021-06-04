import { Router } from 'express';
//Dependency injection
import container from '../dependency-injection';
import { iotDeviceDependencies } from '../../application/Shared/domain/constants/dependencies';
//Middlewares
import UserAuthorization from '../middleware/User/UserAuthorization';
import UserAuthentication from '../middleware/User/UserAuthentication';
import IoTDeviceValidation from '../middleware/IoTDevice/IoTDeviceValidation';
import IoTDeviceDataValidation from '../middleware/IoTDeviceData/IoTDeviceDataValidation';
//Controllers
import IoTDeviceFindController from '../controllers/IoTDevice/IoTDeviceFindController';
import IoTDeviceLinkController from '../controllers/IoTDevice/IoTDeviceLinkController';
import IoTDeviceCreateController from '../controllers/IoTDevice/IoTDeviceCreateController';
import IoTDeviceDataCreateController from '../controllers/IoTDeviceData/IoTDeviceDataCreateController';
import IoTDeviceDataSearchController from '../controllers/IoTDeviceData/IoTDeviceDataSearchController';


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

    //Update device
    /**
     * @todo Add validateAllowedRoles.
     */
    router.put(
        '/iot/device/:deviceId',
        //We validate the presence of the JWT, and we pass the user in the request to the next middlewares
        UserAuthentication.validateAuthToken,
        //Finally, we provide the controller to handle the request
        iotDeviceCreateController.update.bind(iotDeviceCreateController)
    );

    /**
     * @todo Add validateAllowedRoles.
     */
    //Find device by id
    const iotDeviceFindController: IoTDeviceFindController = container.get(iotDeviceDependencies.Controllers.IoTDeviceFindController);
    router.get(
        '/iot/device/:deviceId',
        UserAuthentication.validateAuthToken,
        //UserAuthorization.validateAllowedRoles,
        iotDeviceFindController.run.bind(iotDeviceFindController)
    );

    /**
     * @todo Replace validatePrimaryRole middleware with validateAllowedRoles, which includes the primary user and
     * the secondary users with permission.
     */
    //Get devices owned by a user
    router.get(
        '/iot/devices',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceFindController.findByUserId.bind(iotDeviceFindController)
    );

    /**
     * @todo Verify that device was not previously owned by someone.
     * @todo Generate JWT and refresh token for devices after device link and emmit it via broadcast or UDP.
     */
    //Link device to user
    const iotDeviceLinkController: IoTDeviceLinkController = container.get(iotDeviceDependencies.Controllers.IoTDeviceLinkController);
    router.post(
        '/iot/device/:deviceId/link',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceLinkController.run.bind(iotDeviceLinkController)
    );

    //Unlink device
    router.post(
        '/iot/device/:deviceId/unlink',
        UserAuthentication.validateAuthToken,
        iotDeviceLinkController.unlink.bind(iotDeviceLinkController)
    )

    /**
     * @todo, Validate device JWT instead of user one, because the request is going to be made from the IoT device. Also,
     * remove the validation of primary role.
     */
    //Add IoTDevice data record
    const iotDeviceDataCreateController: IoTDeviceDataCreateController = container.get(iotDeviceDependencies.Controllers.IoTDeviceDataCreateController);
    router.post(
        '/iot/device/:deviceId/data',
        IoTDeviceDataValidation.validateBody(),
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceDataCreateController.run.bind(iotDeviceDataCreateController)
    );

    /**
     * @todo Add validateAllowedRoles.
     */
    //Get IoT device data records
    const iotDeviceDataSearchController: IoTDeviceDataSearchController = container.get(iotDeviceDependencies.Controllers.IoTDeviceDataSearchController);
    router.get(
        '/iot/device/:deviceId/data',
        UserAuthentication.validateAuthToken,
        //UserAuthorization.validateAllowedRoles,
        iotDeviceDataSearchController.run.bind(iotDeviceDataSearchController)
    );

    //Get latest IoT device data records
    router.get(
        '/iot/device/:deviceId/latest',
        UserAuthentication.validateAuthToken,
        iotDeviceDataSearchController.searchLastRecordByDeviceIDAndEventType.bind(iotDeviceDataSearchController)
    );
}