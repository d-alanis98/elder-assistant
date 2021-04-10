import { check } from 'express-validator';
//Domain
import { IoTDeviceValidTypes } from '../../../application/IoTDevice/domain/value-objects/IoTDeviceType';

/**
 * @author Damián Alanís Ramírez
 * @verison 1.1.1
 */
export default class IoTDeviceValidation {
    /**
     * Validations for the device register
     * @returns Array of chained validations
     */
    static creationValidator = () => [
        check('name')
            .notEmpty()
            .withMessage('Device name is required')
            .bail()
            .not()
            .custom(value => /[^A-Za-z0-9\s]/g.test(value))
            .withMessage('Name cannot contain special characters')
            .bail()
            .isLength({ max: 25 })
            .withMessage('The maximum number of characters for the device name is 25')
            .trim()
            .escape(),
        check('type')
            .notEmpty()
            .withMessage('Device type is required')
            .bail()
            .custom(value => Object.values(IoTDeviceValidTypes).includes(value))
            .withMessage('Device type is not valid')
            .trim()
            .escape(),
    ]
}