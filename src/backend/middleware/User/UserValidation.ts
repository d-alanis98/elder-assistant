import { check } from 'express-validator';
//Domain
import { AllowedUserTypes } from '../../../application/User/domain/value-objects/UserType';

/**
 * @author Damián Alanís Ramírez
 * @version 1.3.6
 * @description Middlewares to validate User requests.
 */
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
            .withMessage('The maximum number of characters for the name is 25')
            .trim()
            .escape(),
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .bail()
            .trim()
            .escape()
            .isEmail()
            .withMessage('It must be a valid email'),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8, max: 50 })
            .withMessage('Password must have at least 8 characters and max 50')
            .trim()
            .escape(),
        check('type')
            .notEmpty()
            .withMessage('User type is required')
            .bail()
            .custom(value => Object.values(AllowedUserTypes).includes(value))
            .withMessage('User type not valid'),
        check('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .bail()
            .not()
            .custom(value => /[^A-Za-z0-9\s]/g.test(value))
            .withMessage('Last name cannot contain special characters')
            .isLength({ max: 40 })
            .withMessage('The maximum number of characters for the last name is 40')
            .trim()
            .escape(),
        check('dateOfBirth')
            .notEmpty()
            .withMessage('Date of birth is required')
            .bail()
            .isDate()
            .withMessage('Date must have a valid format (ISO).')
            .bail()
            .trim()
            .escape(),
    ]

    /**
     * Validations for the user login
     * @returns Array of chained validations
     */
    static loginValidator = ()  => [
        check('email')
            .notEmpty()
            .withMessage('Email is required')
            .bail()
            .trim()
            .escape()
            .normalizeEmail()
            .isEmail()
            .withMessage('It must be a valid email'),
        check('password')
            .notEmpty()
            .withMessage('Password is required')
            .bail()
            .isLength({ min: 8, max: 50 })
            .withMessage('Password must have at least 8 characters and max 50')
            .trim()
            .escape(),
    ] 
    
}