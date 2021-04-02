//Server
import Server from './Server';
//Configuration
import app from '../configuration/app';



export default class App {
    private server?: Server;

    async start() {
        const port: number | string = app.serverPort;
        //We set the server
        this.server = new Server(port);
        return this.server.listen();
    }

    async stop() {
        return this.server?.stop();
    }

    get httpServer() {
        return this.server?.getHTTPServer();
    }
}