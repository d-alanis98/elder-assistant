
import express, { Request, Response, Express } from 'express';
import compress from 'compression';
import errorHandler from 'errorhandler';

import Router from 'express-promise-router';
import helmet from 'helmet';
import * as http from 'http';
import httpStatus from 'http-status';
import Logger from '../application/Shared/domain/Logger';
//Dependency injection
import container from './dependency-injection';
//Routes
import { registerRoutes } from './routes';

export default class Server {
    private express: Express;
    private port: number | string;
    private logger: Logger;
    private httpServer?: http.Server;

    constructor(port: number | string) {
        //Network parameters
        this.port = port;
        //Logger
        this.logger = container.get('Shared.Logger');
        //Express
        this.express = express();
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(helmet.xssFilter());
        this.express.use(helmet.noSniff());
        this.express.use(helmet.hidePoweredBy());
        this.express.use(helmet.frameguard({ action: 'deny' }));
        this.express.use(compress());
        //Routes
        const router = Router();
        router.use(errorHandler());
        this.express.use(router);
        //We register the routes
        registerRoutes(router);
        //And we supply the routes to the 
        router.use((err: Error, req: Request, res: Response, next: Function) => {
            this.logger.error(err);
            res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
        });
    }

    async listen(): Promise<void> {
        return new Promise(resolve => {
            this.httpServer = this.express.listen(this.port, () => {
                this.logger.info(
                    `  Mock Backend App is running at http://localhost:${this.port} in ${this.express.get('env')} mode`
                );
                this.logger.info('  Press CTRL-C to stop\n');
                resolve();
            });
        });
    }

    getHTTPServer() {
        return this.httpServer;
    }

    async stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.httpServer) {
                this.httpServer.close(error => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve();
                });
            }

            return resolve();
        });
    }
}