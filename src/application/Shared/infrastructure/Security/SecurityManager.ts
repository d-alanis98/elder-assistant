/**
 * @author Damián Alanís Ramírez
 * @version 1.0.3
 * @description Security manager specification.
 */
export default interface SecurityManager {
    encrypt(plainText: string, saltOrRounds?: number): Promise<string>;
    compare?(plainText: string, hashedText: string): Promise<Boolean>;
    decrypt?(hashedText: string): Promise<string>;
}