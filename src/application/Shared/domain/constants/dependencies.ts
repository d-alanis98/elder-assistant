export default {
    //Shared
    Logger: 'Shared.Logger',
    EmailHasher: 'Shared.EmailHasher',
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