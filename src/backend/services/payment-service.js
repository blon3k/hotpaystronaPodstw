import axios from 'axios';
import crypto from 'crypto';
import {PaymentError} from '../errors/payment-error.js';
import {sendMail} from '../providers/mailgun.js';

class PaymentService {

    async startPayment(body){

        const orderId = crypto.randomUUID();
        const www = process.env.HOTPAY_SHOP_URL;
        const secret = process.env.HOTPAY_SHOP_SECRET;
        const notificationPassword = process.env.HOTPAY_NOTIFY_PASSWORD

        const hash = crypto.createHash('sha3-256').update(`${notificationPassword};${body['amount']};${body['title_service']};${www};${orderId};${secret}`).digest('hex')

        const payload = {
            'SEKRET': secret,
            'KWOTA': body['amount'],
            'NAZWA_USLUGI': body['title_service'],
            'ADRES_WWW': www,
            'ID_ZAMOWIENIA': orderId,
            "TYP": "INIT",
            'HASH': hash,
        };

        let response;
        try {
            response  =  await axios.post('https://platnosc.hotpay.pl/', payload);
        }catch (err){
            throw err;
        }

        if (response.data.status !== 'success') {
            throw new PaymentError('Nie udało się rozpocząć płatności')
        }
        return { success: true, payment_url: response.data.payment_url };
    }

    async notifyPayment(body){
        const { KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SEKRET, SECURE, HASH } = body;
        const password = process.env.HOTPAY_NOTIFY_PASSWORD;

        const hashString = `${password};${KWOTA};${ID_PLATNOSCI};${ID_ZAMOWIENIA};${STATUS};${SECURE};${SEKRET}`;
        const hashCheck = crypto.createHash('sha256').update(hashString).digest('hex');

        if (hashCheck !== HASH) {
            throw new PaymentError('Niepoprawny hash!')
        }

        if(STATUS === 'SUCCESS'){
            await sendMail({
                from: process.env.MAILGUN_EMAIL,
                to: body['EMAIL'],
                subject: 'Hej! Twój ebook!',
                text: 'Masz swojego ebooka',
                //TODO - ZAŁĄCZANIE PLIKU DO MAILA.
                /*attachments:[
                    {
                        filename: 'ebook.pdf',
                        content: 'aGVsbG8gd29ybGQh',
                        encoding: 'base64'
                    },
                ]
                 */
            })
            return;
        }
        if(STATUS === 'FAILURE'){
            throw new PaymentError('Płatność się niepowiodła')
        }
    }
}
export default new PaymentService();