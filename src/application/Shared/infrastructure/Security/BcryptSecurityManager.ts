import { compare, hash } from 'bcrypt';
import SecurityManager from './SecurityManager';


export default class BcryptSecurityManager implements SecurityManager {
    readonly saltOrRounds: number;

    constructor(saltOrRounds: number = 5) {
        this.saltOrRounds = saltOrRounds;
    }

    encrypt = async (plainText: string) => {
        return await hash(plainText, this.saltOrRounds)
    }

    compare = async (plainText: string, hashedValue: string) => {
        return await compare(plainText, hashedValue);
    }

    /**
     * Static accessor to the encrypt method.
     * @param {string} plainText Plain text to encrypt.
     * @returns 
     */
    static encrypt = (plainText: string, saltOrRounds?: number) => new BcryptSecurityManager(saltOrRounds).encrypt(plainText)

    /**
     * Static accessor to the compare method.
     * @param {string} hashedValue Hash text to compare.
     * @returns 
     */
    static compare = (plainText: string, hashedValue: string) => new BcryptSecurityManager().compare(plainText, hashedValue);
}