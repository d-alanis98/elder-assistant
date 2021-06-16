import { Router } from 'express';
//Dependency injection
import container from '../dependency-injection';
import { iotDeviceDependencies } from '../../application/Shared/domain/constants/dependencies';
//Middlewares
import upload from '../middleware/Shared/FileUpload';
import MiddlewareGroup from '../middleware/Shared/MiddlewareGroup';
import UserAuthorization from '../middleware/User/UserAuthorization';
import UserAuthentication from '../middleware/User/UserAuthentication';
import IoTDeviceValidation from '../middleware/IoTDevice/IoTDeviceValidation';
import SubscriptionValidation from '../middleware/Subscription/SubscriptionValidation';
import IoTDeviceAuthorization from '../middleware/IoTDevice/IoTDeviceAuthorization';
import IoTDeviceDataValidation from '../middleware/IoTDeviceData/IoTDeviceDataValidation';
import SubscriptionPermissions from '../middleware/Subscription/SubscriptionPermissions';
import IoTDeviceAuthentication from '../middleware/IoTDevice/IoTDeviceAuthentication';
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
    router.put(
        '/iot/device/:deviceId',
        //We validate the presence of the JWT, and we pass the user in the request to the next middlewares
        UserAuthentication.validateAuthToken,
        //We validate that the user is a primary user
        UserAuthorization.validatePrimaryRole,
        //We validate the device ownership
        IoTDeviceAuthorization.validateDeviceOwnership,
        //Finally, we provide the controller to handle the request
        iotDeviceCreateController.update.bind(iotDeviceCreateController)
    );


    //Find device by id
    const iotDeviceFindController: IoTDeviceFindController = container.get(iotDeviceDependencies.Controllers.IoTDeviceFindController);
    router.get(
        '/iot/device/:deviceId',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        IoTDeviceAuthorization.validateDeviceOwnership,
        iotDeviceFindController.run.bind(iotDeviceFindController)
    );


    //Get data of the device (intended for the device itself, to load configuration, etc)
    router.get(
        '/iot/device',
        IoTDeviceAuthentication.validateToken,
        iotDeviceFindController.searchById.bind(iotDeviceFindController)
    );

    //Get devices owned by a primary user
    router.get(
        '/iot/devices',
        UserAuthentication.validateAuthToken,
        UserAuthorization.validatePrimaryRole,
        iotDeviceFindController.handleDevicesByOwnerRequest.bind(iotDeviceFindController)
    );

    //Get devices of a user, this endpoint is for secondary users with a subscription to the target primary user
    router.get(
        '/user/:primaryUserId/iot/devices',
        UserAuthentication.validateAuthToken,
        SubscriptionValidation.verifySubscription,
        SubscriptionPermissions.hasPermission('readOwnerData'),
        iotDeviceFindController.handleDevicesByOwnerRequest.bind(iotDeviceFindController)
    );

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
        UserAuthorization.validatePrimaryRole,
        IoTDeviceAuthorization.validateDeviceOwnership,
        iotDeviceLinkController.unlink.bind(iotDeviceLinkController)
    )

    /**
     * IoT device data
     */

    //Add IoTDevice data record
    const iotDeviceDataCreateController: IoTDeviceDataCreateController = container.get(iotDeviceDependencies.Controllers.IoTDeviceDataCreateController);
    router.post(
        '/iot/device/data',
        IoTDeviceDataValidation.validateBody(),
        IoTDeviceAuthentication.validateToken,
        upload('PanicAlerts').single('audioFile'),
        iotDeviceDataCreateController.run.bind(iotDeviceDataCreateController)
    );

    //Get IoT device data records, for the owner of the device (primary user)
    const iotDeviceDataSearchController: IoTDeviceDataSearchController = container.get(iotDeviceDependencies.Controllers.IoTDeviceDataSearchController);
    router.get(
        '/iot/device/:deviceId/data',
        //We create a middleware group, to determine the middlewares to apply depending on the user type
        UserAuthentication.validateAuthToken,
        new MiddlewareGroup(
            [//Middlewares to apply if the user is of primary type
                UserAuthorization.validatePrimaryRole,
                IoTDeviceAuthorization.validateDeviceOwnership,
            ], 
            [//Middlewares to apply if the user is of secondary type
                SubscriptionValidation.verifySubscription,
                SubscriptionPermissions.hasPermission('readOwnerData')
            ]
        ).apply,
        iotDeviceDataSearchController.run.bind(iotDeviceDataSearchController)
    );

    //Get latest IoT device data records
    router.get(
        '/iot/device/:deviceId/latest',
        //We create a middleware group, to determine the middlewares to apply depending on the user type
        UserAuthentication.validateAuthToken,
        new MiddlewareGroup(
            [//Middlewares to apply if the user is of primary type
                UserAuthorization.validatePrimaryRole,
                IoTDeviceAuthorization.validateDeviceOwnership,
            ], 
            [//Middlewares to apply if the user is of secondary type
                SubscriptionValidation.verifySubscription,
                SubscriptionPermissions.hasPermission('readOwnerData')
            ]
        ).apply,
        iotDeviceDataSearchController.searchLastRecordByDeviceIDAndEventType.bind(iotDeviceDataSearchController)
    );
}