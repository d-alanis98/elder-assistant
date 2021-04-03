import { createHash } from 'crypto';
import SecurityManager from './SecurityManager';

/**
 * @author Damián Alanís Ramírez
 * @version 1.1.2
 * @description SHA256 hasher that implements the security manager interface, to provide access to SHA256 hashing across the app in 
 * a consistent way. 
 */
export default class SHASecurityManager implements SecurityManager {
    private readonly algorithm     = 'sha1';
    private readonly textEncoding  = 'utf-8';
    private readonly digestFormat  = 'hex';

    /**
     * Method that receives a plain text string and returns a SHA256 hash for it.
     * @param {string} plainText 
     * @returns Hash obtained with SHA256 algorithm.
     */
    encrypt = async (plainText: string) => {
        const { algorithm, textEncoding, digestFormat } = this;
        //Creating a hash Object, providing the algorithm to use
        const hash = createHash(algorithm);
        //Passing the data to be hashed
        const data = hash.update(plainText, textEncoding);
        return await data.digest(digestFormat);
    }


    /**
     * Static accessor to the encrypt method.
     * @param {string} plainText Plain text to encrypt.
     * @returns 
     */
    static encrypt = (plainText: string, saltOrRounds?: number) => new SHASecurityManager().encrypt(plainText)

}