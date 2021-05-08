/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Valid web socket message types. For consistency across the app.
 */
export enum WebSocketMessageTypes {
    //App domain
    AUTHENTICATION      = 'Authentication',
    GENERIC_MESSAGE     = 'GenericMessage',
    CLOSE_CONNECTION    = 'CloseConnection'
}
