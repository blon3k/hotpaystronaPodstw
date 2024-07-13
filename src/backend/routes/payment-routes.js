import express from 'express';
import PaymentController from '../controllers/payment-controller.js';
import {initializePayment} from '../validation/payment-validator.js'
import {resolveValidation} from '../middlewares/resolveValidation.js';
const router = express.Router();

router.post('/payment/start', initializePayment, resolveValidation, PaymentController.startPayment);
router.post('/payment/notify', PaymentController.notify);

export default router;
