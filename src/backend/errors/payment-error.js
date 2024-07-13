export class PaymentError extends Error{

    error;
    constructor(message, error = undefined) {
        super(message);
        this.error = error;
    }
}
