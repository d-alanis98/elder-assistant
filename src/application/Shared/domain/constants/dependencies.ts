//To get the identifiers of the dependencies stored in the container.
export default {
    //Shared
    Logger: 'Shared.Logger',
    EmailHasher: 'Shared.EmailHasher',
    Authenticator: 'Shared.Authenticator',
    PasswordHasher: 'Shared.PasswordHasher',
    //User
    UserFindUseCase: 'Users.UseCases.UserFinder',
    UserCreateUseCase: 'Users.UseCases.UserCreator',
    UserAuthenticationUseCase: 'Users.UseCases.UserAuthentication',
    //User controllers
    UserFinderController: 'Users.Controllers.UserFinderController',
    UserRegisterController: 'Users.Controllers.UserRegisterController',
    UserAuthenticationController: 'Users.Controllers.UserAuthenticationController'

}