import jwt from 'jsonwebtoken';
//Domain
import Authenticator from '../../domain/authentication/Authenticator';
import AggregateRoot from '../../domain/AggregateRoot';
import AuthorizationNotProvided from '../../domain/exceptions/AuthorizationNotProvided';
//Configuration variables
import app from '../../../../configuration/app';
import NotAuthorized from '../../domain/exceptions/NotAuthorized';

/**
 * @author Dmaián Alanís Ramírez
 * @version 1.4.7
 */
export default class JWTAuthenticator implements Authenticator {

    private jwtOptions: Object;
    private readonly expirationDate: string = '1h';

    constructor(jwtOptions: Object = { }) {
        this.jwtOptions = {
            expiresIn: this.expirationDate,
            ...jwtOptions
        }
    }
    /**
     * Method to generate a JWT with signed data and expiration date of 1 hour;
     * @param {AggregateRoot} data Resource to sign instance.
     * @param {string} passphrase JWT private key. 
     * @returns 
     */
    public sign = async (data: AggregateRoot, passphrase: string): Promise<string> => (
        JWTAuthenticator.sign(
            data,
            passphrase,
            this.jwtOptions
        )
    );

    /**
     * Static method to generate a JWT with signed data and custom options;
     * @param data Resource to sign instance.
     * @param passphrase JWT private key. 
     * @param jwtOptions JWT options.
     * @returns 
     */
    static sign = async (
        data: AggregateRoot, 
        passphrase: string, 
        jwtOptions: Object = { }
    ): Promise<string> => new Promise(
        (resolve, reject) => {
            try {
                const token = jwt.sign(
                    data.toPrimitives(),
                    passphrase,
                    jwtOptions  
                );
                resolve(token);
            } catch(error) {
                reject(error);
            }
        }
    );

    /**
     * Method to get the data stored in a valid JWT, it throws an exception if no valid token was provided.
     * @param {string} headerWithToken String that contains the token.
     * @param {string} passphrase JWT private key. 
     * @returns 
     */
    public authenticate = async (headerWithToken: string, passphrase: string): Promise<Object> => {
        let token: string | undefined = this.getToken(headerWithToken);
        if(!token)
            throw new AuthorizationNotProvided();
        //We verify the token signature and get the value
        try {
            const data: Object = jwt.verify(token, passphrase);
            return data;
        } catch(error) {
            //If we get an error veryfing the signature it is because the token is invalid or malformed
            throw new NotAuthorized('Invalid or malformed token');
        }
    }

    /**
     * Method to get the token from the header string.
     * @param {string} token String that contains the token. 
     * @returns 
     */
    private getToken = (token: string): string | undefined => {
        //Validation of the string that contains the token
        if(!token || token.indexOf('Bearer ') === -1)
            return;
        //We get the token only
        return token.replace('Bearer ', '');
    }

    //Facade methods 

    /**
     * Method to get the signed JWT for authentication.
     * @param {AggregateRoot} data 
     * @returns 
     */
    public signAuthToken = async (data: AggregateRoot) => this.sign(
        data,
        app.jwtPrivateKey
    );

    /**
     * Method to get the signed refresh token.
     * @param {AggregateRoot} data 
     * @returns 
     */
    public signRefreshToken = async (data: AggregateRoot) => JWTAuthenticator.sign(
        data,
        app.jwtRefreshPrivateKey,
        { expiresIn: '1w' } //Refresh tokens last 1 week
    );

    /**
     * Method to validate the authentication token.
     * @param {string} tokenString String with the token.
     * @returns 
     */
    public authenticateAuthToken = async (tokenString: string) => this.authenticate(
        tokenString,
        app.jwtPrivateKey
    );

    /**
     * Method to authenticate the refresh token.
     * @param {string} tokenString String with the token.
     * @returns 
     */
    public authenticateRefreshToken = async (tokenString: string) => this.authenticate(
        tokenString,
        app.jwtRefreshPrivateKey
    );

}