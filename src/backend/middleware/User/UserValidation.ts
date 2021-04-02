import { check } from 'express-validator';
//Domain
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';


export default class UserValidation {
    /**
     * Validations for the user register
     * @returns Array of chained validations
     */
    static registerValidator = () => [
        check('name')
            .notEmpty()
            .withMessage('Name is required')
            .bail()
            .not()
            .custom(value => /[^A-Za-z0-9\s]/g.test(value))
            .withMessage('Name cannot contain special characters')
            .bail()
            .isLength({ max: 25 })
            .withMessage('The maximum number of characters for the name is 25'),
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .bail()
            .isEmail()
            .withMessage('It must be a valid email'),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8, max: 50 })
            .withMessage('Password must have at least 8 characters and max 50'),
        check('type')
            .notEmpty()
            .withMessage('User type is required')
            .bail()
            .custom(value => value === AllowedUserTypes.PRIMARY || value === AllowedUserTypes.SECONDARY)
            .withMessage('User type not valid'),
        check('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .bail()
            .not()
            .custom(value => /[^A-Za-z0-9\s]/g.test(value))
            .withMessage('Last name cannot contain special characters')
            .isLength({ max: 40 })
            .withMessage('The maximum number of characters for the last name is 40'),
    ]
    
}