//To get the identifiers of the dependencies stored in the container.
export default {
    //Shared
    Logger: 'Shared.Logger',
    EmailHasher: 'Shared.EmailHasher',
    Authenticator: 'Shared.Authenticator',
    PasswordHasher: 'Shared.PasswordHasher',
    //User
    //Use cases
    UserFindUseCase: 'Users.UseCases.UserFinder',
    UserCreateUseCase: 'Users.UseCases.UserCreator',
    //Controllers
    UserFinderController: 'Users.Controllers.UserFinderController',
    UserRegisterController: 'Users.Controllers.UserRegisterController',
    //UserAuthentication
    //Use cases
    UserAuthenticationUseCase: 'UserAuthentication.UseCases.UserAuthentication',
    //Controllers
    UserAuthenticationController: 'UserAuthentication.Controllers.UserAuthenticationController',

}

//IoTDevice entity
export const iotDeviceDependencies = {
    UseCases: {
        FindIoTDevice: 'IoTDevice.FindIoTDevice',
        LinkIoTDevice: 'IoTDevice.LinkIoTDevice',
        CreateIoTDevice: 'IoTDevice.CreateIoTDevice',
        UpdateIoTDevice: 'IoTDevice.UpdateIoTDevice',
        SearchIoTDeviceData: 'IoTDevice.SearchIoTDeviceData',
        CreateIoTDeviceData: 'IoTDevice.CreateIoTDeviceData',
    },
    Controllers: {
        IoTDeviceFindController: 'IoTDevice.IoTDeviceFindController',
        IoTDeviceLinkController: 'IoTDevice.IoTDeviceLinkController',
        IoTDeviceCreateController: 'IoTDevice.IoTDeviceCreateController',
        IoTDeviceDataSearchController: 'IoTDevice.IoTDeviceDataSearchController',
        IoTDeviceDataCreateController: 'IoTDevice.IoTDeviceDataCreateController'
    }
};

//Subscriptions entity
export const subscriptionsDependencies = {
    UseCases: {
        FindSubscription: 'Subscriptions.FindSubscription',
        CreateSubscription: 'Subscriptions.CreateSubscription',
        UpdateSubscription: 'Subscriptions.UpdateSubscription',
    },
    Controllers: {
        FindSubscriptionController: 'Subscriptions.FindSubscriptionController',
        CreateSubscriptionController: 'Subscriptions.CreateSubscriptionController'
    }
}

//Chat entity
export const chatDependencies = {
    UseCases: {
        CreateChat: 'Chat.CreateChat',
        SearchChat: 'Chat.SearchChat',
        UpdateChat: 'Chat.UpdateChat'
    },
    Controllers: {
        CreateChatController: 'Chat.CreateChatController'
    }
}

//Chat messages entity
export const chatMessageDependencies = {
    UseCases: {
        CreateChatMessage: 'ChatMessage.CreateChatMessage',
        SearchChatMessage: 'ChatMessage.SearchChatMessage',
    },
    Controllers: {
        ChatMessageController: 'ChatMessage.ChatMessageController',
    }
}

//Notifications entity
export const notificationsDependencies = {
    UseCases: {
        CreateNotification: 'Notifications.CreateNotification',
        SearchNotification: 'Notifications.SearchNotification'
    },
    Controllers: {
        NotificationsController: 'Notifications.NotificationsController'
    }
}