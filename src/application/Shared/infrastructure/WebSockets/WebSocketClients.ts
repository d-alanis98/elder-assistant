import WebSocket from 'ws';
//Web socket utils
import { WebSocketMessageTypes } from './WebSocketMessageTypes';

/**
 * @author Damián Alanís Ramírez
 * @version 3.3.2
 * @description Class to manage the web socket clients, either registering or unregistering the sockets, associating them 
 * to the user via its ID.
 */
export default class WebSocketClients {
    //Web socket clients dictionary
    public static webSocketClients: WebSocketClientsDictionary = { };

    /**
     * Method to register a web socket client in the dictionary, associated to a user by its ID.
     * @param {string} userId Id of the user who owns the web socket connection.
     * @param {WebSocket} webSocket Web socket instance.
     */
    registerWebSocketClient = (userId: string, webSocket: WebSocket) => {
        WebSocketClients.registerWebSocketClient(userId, webSocket);
    }

    //Facade
    /**
     * Static method to register a web socket client in the dictionary, associated to a user by its ID.
     * @param {string} userId Id of the user who owns the web socket connection.
     * @param {WebSocket} webSocket Web socket instance.
     */
    static registerWebSocketClient = (userId: string, webSocket: WebSocket) => {
        if(!WebSocketClients.webSocketClients[userId])
            WebSocketClients.webSocketClients[userId] = [];
        WebSocketClients.webSocketClients[userId].push(webSocket);
        //We also unregister all the closed sockets taking advantage of the fact that we received the user ID.
        WebSocketClients.unregisterAllClosedSockets(userId);
    }

    /**
     * Static method to unregister all the web socket clients that are not connected.
     * @param {string} userId Id of the user who owns the web socket connections.
     * @returns 
     */
    static unregisterAllClosedSockets = (userId: string) => {
        if(!WebSocketClients.webSocketClients[userId])
            return;
        let sockets = WebSocketClients.webSocketClients[userId];
        sockets = sockets.filter(socket => socket.readyState === socket.OPEN);
    }

    /**
     * Static method to unregister a web socket.
     * @param {string} userId Id of the user who owns the web socket connection.
     * @param {WebSocket} webSocket Web socket instance.
     */
    static closeAndUnregisterSocket = (userId: string, webSocket: WebSocket) => {
        try {
            webSocket.terminate();
        }
        finally {
            WebSocketClients.unregisterAllClosedSockets(userId);
        }
    }

    /**
     * Method to handle the termination request, closing and unregistering the web socket.
     * @param messageType Message type according to the ParsedWebSocket message specification.
     * @param userId Payload of the web socket message must be the userId.
     * @param webSocket Web socket to unregister.
     * @returns 
     */
    static handleTerminationMessage = (messageType: string, userId: string, webSocket: WebSocket) => {
        //Is a close is requested, we unregister the socket
        if(messageType !== WebSocketMessageTypes.CLOSE_CONNECTION)
            return;
        //The user ID must come as the payload
        WebSocketClients.closeAndUnregisterSocket(userId, webSocket);
    }

    /**
     * Method to send data to a user web sockets.
     * @param userId Id of the user whom we want to send the data.
     * @param data Data to send.
     * @returns 
     */
    static emitDataToUser = (
        userId: UserId, 
        messageType: string,  
        messageData: any
    ) => {
        if(!WebSocketClients.webSocketClients[userId])
            return;
        WebSocketClients.webSocketClients[userId].forEach(webSocket => {
            //We validate the web socket state
            if(webSocket.readyState !== webSocket.OPEN) {
                if(webSocket.readyState !== webSocket.CONNECTING) 
                    WebSocketClients.closeAndUnregisterSocket(userId, webSocket);
                return;
            }
            //We send the data
            webSocket.send(JSON.stringify({
                type: messageType,
                payload: messageData 
            }));
        });
    }

    /**
     * Method to send data to multiple users via web sockets.
     * @param userId Id of the user whom we want to send the data.
     * @param data Data to send.
     * @returns 
     */
    static emitDataToUsers = (
        users: UserId[], 
        messageType: string,
        messageData: any
    ) => {
        //We emit the data for each user
        users.forEach(user => WebSocketClients.emitDataToUser(user, messageType, messageData));
    }
}

//Helpers
export interface WebSocketClientsDictionary {
    //The user ID will be associated to the WebSocket array.
    [userId: string]: WebSocket[];
}


type UserId = string;
