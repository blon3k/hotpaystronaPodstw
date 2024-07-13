import PaymentService from '../services/payment-service.js';

class PaymentGatewayController {

    async startPayment(req, res) {
        try {
            const data = await PaymentService.startPayment(req.body);
            res.redirect(301, data.payment_url);
        } catch (err) {
            res.status(400).json({success: false, message: 'Nie udało się rozpocząć autoryzacji płatności'});
        }
    }

    async notify(req, res) {
        try {
            await PaymentService.notifyPayment(req.body);
            res.end();
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    }

}

export default new PaymentGatewayController();