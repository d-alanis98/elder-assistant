import WebSocket from 'ws';
//Web socket utils
import WebSocketClients from './WebSocketClients';
import { WebSocketMessageTypes } from './WebSocketMessageTypes';
//Domain
import { UserPrimitives } from '../../../User/domain/User';
import UserNotAuthenticated from '../../../User/domain/exceptions/UserNotAuthenticated';
//Dependency injection
import container from '../../../../backend/dependency-injection';
import dependencies from '../../domain/constants/dependencies';


/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Class to handle the WebSocket authentication process.
 */
export default class WebSocketAuthentication {
    //Constants
    private static readonly AUTHENTICATION_TIMEOUT = 3000;
    //Properties
    private authenticated = false;
    private readonly webSocket: WebSocket;
    private readonly authenticationTimeout: NodeJS.Timeout;

    constructor(webSocket: WebSocket) {
        this.webSocket = webSocket;
        //We set the authentication timeout, to close the connection if no authentication was provided during that time
        this.authenticationTimeout = this.startAuthenticationTimeout();
    }

    /**
     * Method to verify the autentication of the web socket connection via a received message of ParsedWebSocketMessage type.
     * @param webSocket Web socket reference.
     * @param {string} messageType Message type.
     * @param {string} authenticationToken Authentication token.
     */
    authenticate = async (
        messageType: string, 
        authenticationToken: string
    ) => {
        try {
            //We expect the first message to be the authentication
            if(messageType !== WebSocketMessageTypes.AUTHENTICATION)
                throw new UserNotAuthenticated();
            //We clear the interval, because we received the authorization message and now it is task of the authenticator to determine if it is valid
            clearInterval(this.authenticationTimeout);
            //We get the authenticator
            const authenticator = container.get(dependencies.Authenticator);
            //We verify the provided token
            const userData: UserPrimitives = await authenticator.authenticateAuthToken(authenticationToken);
            //We register the web socket in the clients dictionary
            WebSocketClients.registerWebSocketClient(userData._id, this.webSocket);
            this.authenticated = true;
        } catch {
            this.authenticated = false;
            this.closeWebSocketConnection();
        }
    }

    /**
     * Method to start the authentication timeout, ie: the maximum allowed time the web socket can be alive without 
     * an authentication message being received. Once the timeout is reached, the connection is closed.
     * @returns The interval reference.
     */
    startAuthenticationTimeout = () => setTimeout(() => {
        if(!this.isAuthenticated())
            this.closeWebSocketConnection();
    }, WebSocketAuthentication.AUTHENTICATION_TIMEOUT);

    /**
     * Method to close the web socket connection.
     */
    closeWebSocketConnection = () => {
        this.webSocket.terminate();
    }

    /**
     * Method to get the status of the authentication process.
     * @returns The authenticated flag value.
     */
    public isAuthenticated = () => this.authenticated;
}