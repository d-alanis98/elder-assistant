import WebSocket, { Server } from 'ws';
import { Server as HTTPServer } from 'http';
//WebSocket utils
import WebSocketClients from './WebSocketClients';
import WebSocketMessageParser from './WebSocketMessageParser';
import WebSocketAuthentication from './WebSocketAuthentication';

/**
 * @author Damián Alanís Ramírez
 * @version 2.2.1
 * @description WebSockets server implementation with ws module, to handle the bidirectional RTC across the app.
 */
export default class WebSocketsServer {
    private readonly httpServer: HTTPServer;
    private static webSocketServer: Server;


    constructor(httpServer?: HTTPServer) {
        this.httpServer = httpServer || new HTTPServer();
        this.setServerInstance();
    }

    /**
     * Getter method of the server instance
     */
    public get instance() {
        return WebSocketsServer.webSocketServer;
    }

    /**
     * Method to start listening to websocket connections.
     */
    public listen = () => {
        this.instance.on('connection', webSocket => {
            this.handleReceivedMessage(webSocket);
        });
    }

    /**
     * Method to handle the received message (ideally the authentication message, additional data may be only received
     * via the Rest API). 
     * When the connection is authenticated, the websocket is associated to the user, so the application could retrieve the
     * active web sockets for a user and emit data to them.
     * @param webSocket Web socket reference.
     */
    handleReceivedMessage = (webSocket: WebSocket) => {
        //Authenticator instance
        const authenticator = new WebSocketAuthentication(webSocket);
        //We handle the received message
        webSocket.on('message', async (message: string) => {
            //We parse the message to an object
            const { type, payload } = WebSocketMessageParser.parse(message);
            //We authenticate the connection if the falg is set to false (on just created connection)
            //The authenticator awaits for 1 second at max for the authentication message, if not provided, the connection will be closed automatically
            if(!authenticator.isAuthenticated()) 
                authenticator.authenticate(type, payload);
            WebSocketClients.handleTerminationMessage(type, payload, webSocket);
        });
    }


    /**
     * Method to set the webSocketServer instance.
     */
    private setServerInstance = () => {
        WebSocketsServer.webSocketServer = new Server({ server: this.httpServer });
    }

    /**
     * Facade.
     * These are the methods that could be called anywhere across the app backend (controllers, ideally).
     * The methods above are only for one-time invoking, when an instance of the server is created in the App start.
     */

    /**
     * Static method to get the webSocket server without creating a new instance of the whole class.
     * @returns The web socket server instance.
     */
    static instance = () => WebSocketsServer.webSocketServer;

}

