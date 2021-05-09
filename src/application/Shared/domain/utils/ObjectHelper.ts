
/**
 * @author Damián Alanís Ramírez
 * @version 1.1.1
 * @description Util class for objects.
 */
export default class ObjectHelper {
    /**
     * Method to determine if a given object is empty.
     * @param object Object to analyze.
     * @returns True when the object has no keys, otherwise, false.
     */
    static isEmpty = (object: Object) => Object.keys(object).length === 0;
}