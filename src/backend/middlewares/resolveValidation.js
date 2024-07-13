import { validationResult } from 'express-validator'

export const resolveValidation = (req, res, next) => {
    const result = validationResult(req)

    if (!result.isEmpty()) {
        return res.status(400).json({
            success: false,
            data: req.body,
            errors: result.mapped()
        })
    }

    next()
}