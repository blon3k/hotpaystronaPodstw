import { body } from 'express-validator'

export const notEmpty = (field) => {
    return body(field)
        .custom(value => value.length !== 0)
        .withMessage((value, { path }) => {
            return `To pole jest wymagane.`
        })
}

export const checkEmail = (field) => {
    return body(field)
        .isEmail()
        .withMessage('Podany adres e-mail wygląda na niepoprawny.')
}


export const checkIsPositiveNumber = (field) => {
    return body(field)
        .custom(value => value >= 0)
        .withMessage(`To pole musi być większe lub równe zero.`)
}

export const isString = (field) => {
    return body(field)
        .isString()
        .withMessage(`To pole musi być wartością tekstową.`)
}
