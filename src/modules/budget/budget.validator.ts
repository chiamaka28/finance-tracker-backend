import  type { NextFunction, Request, Response } from 'express';
import {body, validationResult } from 'express-validator';


export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       const mapped = errors.mapped();
       const errorList = Object.entries(mapped).map(([field, err]) => ({
      field: field ?? 'unknown',
      message: typeof err.msg === 'string' ? err.msg : String(err.msg),
    }));

        return res.status(400).json({ 
            errors: errorList ,
            success: false,
            message: 'Validation failed'
        });

    }
    next();
}

export const validateBudget = [
    body('maxSpend')
        .exists().withMessage('maxSpend is required')
        .isFloat({ gt: 0 }).withMessage('maxSpend must be a positive number'),
        handleValidationErrors,
];