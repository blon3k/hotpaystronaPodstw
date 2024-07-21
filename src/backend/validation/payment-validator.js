import {checkEmail, checkIsPositiveNumber, isString, notEmpty} from '../utils/validation-utils.js';

export const initializePayment = [
    notEmpty(['amount', 'title_service']),
    isString(['title_service']),
    checkIsPositiveNumber('amount')
]