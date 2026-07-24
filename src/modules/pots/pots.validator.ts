import type { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const mapped = errors.mapped();
        const errorList = Object.entries(mapped).map(([field, err]) => ({
            field: field ?? 'unknown',
            message: typeof err.msg === 'string' ? err.msg : String(err.msg),
        }));

        return res.status(400).json({
            errors: errorList,
            success: false,
            message: 'Validation failed'
        });
    }
    next();
}
export const validatePot = [
    body('name')
        .exists().withMessage('name is required')
        .isString().withMessage('name must be a string')
        .isLength({ min: 1 }).withMessage('name cannot be empty'),
    body('target')
        .exists().withMessage('target is required')
        .isFloat({ gt: 0 }).withMessage('target must be a positive number'),
    body('color')
        .exists().withMessage('color is required')
        .isString().withMessage('color must be a string'),
    handleValidationErrors
];