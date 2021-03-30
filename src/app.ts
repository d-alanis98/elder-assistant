//Application
import App from './backend/App';
//Exceptions

import UncaughtExceptionHandler from './shared/helpers/exceptions/handlers/UncaughtExceptionHandler';

const startApplication = async (): Promise<void> => {
    //We create an instance of the App and invoke the start method
    const application = new App();
    application.start();
    return;
}

startApplication()
    .catch(exception => new UncaughtExceptionHandler(exception).handle());


process.on('uncaughtException', error => {
    new UncaughtExceptionHandler(error).handle();
});


