import winston, { Logger as WinstonLoggerType } from 'winston';
import Logger from '../domain/Logger';

enum Levels {
    DEBUG = 'debug',
    ERROR = 'error',
    INFO = 'info'
}

/**
 * @author Damián Alanís Ramírez
 * @version 0.1.1
 * @description Class that implements the Logger interface. It is provided via dependency injection, to act as the logger of
 * the application.
 */
export default class WinstonLogger implements Logger {
    private logger: WinstonLoggerType;

    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(
                winston.format.prettyPrint(),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.colorize(),
                winston.format.simple()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: `logs/${Levels.DEBUG}.log`, level: Levels.DEBUG }),
                new winston.transports.File({ filename: `logs/${Levels.ERROR}.log`, level: Levels.ERROR }),
                new winston.transports.File({ filename: `logs/${Levels.INFO}.log`, level: Levels.INFO })
            ]
        });
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    error(message: string | Error) {
        this.logger.error(message);
    }

    info(message: string) {
        this.logger.info(message);
    }
}
