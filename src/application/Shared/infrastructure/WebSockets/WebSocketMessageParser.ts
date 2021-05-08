import { WebSocketMessageTypes } from './WebSocketMessageTypes';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Class to handle the received message and parse it to Object type, according to the
 * ParsedWebSocketMessage specification.
 */
export default class WebSocketMessageParser {
    /**
     * Returns the message parsed to object type.
     * @param {string} message Message to parse.
     */
    static parse = (message: string): ParsedWebSocketMessage => {
        try {
            const parsedMessage = JSON.parse(message);
            return { 
                type: parsedMessage.type,
                payload: parsedMessage.payload,
            };
        } catch {
            return { type: WebSocketMessageTypes.GENERIC_MESSAGE, payload: message };
        }
    } 
}

//Helpers
export interface ParsedWebSocketMessage {
    type: WebSocketMessageTypes | string;
    payload: any;
}