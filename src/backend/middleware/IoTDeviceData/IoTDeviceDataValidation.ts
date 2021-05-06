import { check } from 'express-validator';

/**
 * @author Damián Alanís Ramírez
 * @version 1.2.1
 * @description Middlewares to apply to the IoTDeviceData requests.
 */
export default class IoTDeviceDataValidation {
    /**
     * Validations for the IoTDeviceData creation. The body must contain thekey and the value.
     * @returns Array of chained validations.
     */
    static validateBody = () => [
        check('key')
            .notEmpty()
            .withMessage('Key of the record is required')
            .bail()
            .trim()
            .escape(),
        check('value')
            .notEmpty()
            .withMessage('Value of the record is required')
            .bail()
    ];
}