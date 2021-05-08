//Server
import Server from './Server';
//Web sockets server
import WebSocketsServer from '../application/Shared/infrastructure/WebSockets/WebSocketsServer';
//Configuration
import app from '../configuration/app';


/**
 * @author Damián Alanís Ramírez
 * @version 1.3.2
 * @description App container class, it creates the servers and set them to start listening to requests.
 */
export default class App {
    private server?: Server;
    private _webSocketsServer?: WebSocketsServer;

    start = async () => {
        const port: number | string = app.serverPort;
        //We set the server
        this.server = new Server(port);
        await this.server.listen();
        //We set the web sockets server
        this._webSocketsServer = new WebSocketsServer(this.server.getHTTPServer());
        this._webSocketsServer.listen();
        return;
    }

    stop = () => {
        return this.server?.stop();
    }

    get httpServer() {
        return this.server?.getHTTPServer();
    }

    get webSocketsServer() {
        return this._webSocketsServer?.instance;
    }
}