//Domain
import AggregateRoot from '../AggregateRoot';

/**
 * @author Damián Alanís Ramírez
 * @version 2.3.3
 * @description Definition of an authenticator, which needs to implement at least one authenticate method. 
 */
export default interface Authenticator {
    //Method to sign the data, wether in a JWT, cookie with session Id or another method.
    sign?(data: AggregateRoot, passphrase?: string): Promise<string>;

    //Method to verify the authorization serialized data (wether a token, cookie value, etc)
    authenticate(serializedData: string, passphrase?: string): Promise<Object>;
}