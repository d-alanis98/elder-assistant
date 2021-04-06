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