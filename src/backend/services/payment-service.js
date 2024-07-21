import axios from 'axios'
import crypto from 'crypto'
import { PaymentError } from '../errors/payment-error.js'
import { sendMail } from '../providers/mailgun.js'
import { createHash } from 'node:crypto'

class PaymentService {
	async startPayment(body) {
		const orderId = crypto.randomUUID()
		const www = process.env.HOTPAY_SHOP_URL
		const secret = process.env.HOTPAY_SHOP_SECRET

		let FORMULARZ = {
			SEKRET: secret,
			KWOTA: body['amount'],
			NAZWA_USLUGI: body['title_service'],
			ADRES_WWW: www,
			ID_ZAMOWIENIA: orderId,
			TYP: 'INIT',
		}

		const form = new FormData()
		form.append('KWOTA', FORMULARZ.KWOTA)
		form.append('NAZWA_USLUGI', FORMULARZ.NAZWA_USLUGI)
		form.append('ADRES_WWW', FORMULARZ.ADRES_WWW)
		form.append('ID_ZAMOWIENIA', FORMULARZ.ID_ZAMOWIENIA)
		form.append('SEKRET', FORMULARZ.SEKRET)
		form.append('TYP', 'INIT')
		form.append(
			'HASH',
			createHash('sha3-256')
				.update(
					'HASLO_Z_USTAWIEN' +
						';' +
						FORMULARZ.KWOTA +
						';' +
						FORMULARZ.NAZWA_USLUGI +
						';' +
						FORMULARZ.ADRES_WWW +
						';' +
						FORMULARZ.ID_ZAMOWIENIA +
						';' +
						FORMULARZ.SEKRET
				)
				.digest('hex')
		)
		const options = {
			method: 'POST',
			url: 'https://platnosc.hotpay.pl/',
			headers: { 'Content-Type': 'multipart/form-data;' },
			data: '[form]',
		}
		axios
			.request(options)
			.then(function (response) {
				try {
					var ob = JSON.parse(response.data)
					if (ob && typeof ob === 'object') {
						if (ob.STATUS) {
							console.log('ADRES PLATNOSCI: ' + ob.URL)
						}
						return { success: true, payment_url: ob.URL }
					}
				} catch (e) {
					console.log(response.data)
					console.log(e)
				}
			})
			.catch(function (error) {
				console.error(error)
			})
	}

	async notifyPayment(body) {
		const { KWOTA, ID_PLATNOSCI, ID_ZAMOWIENIA, STATUS, SEKRET, SECURE, HASH } = body
		const password = process.env.HOTPAY_NOTIFY_PASSWORD

		const hashString = `${password};${KWOTA};${ID_PLATNOSCI};${ID_ZAMOWIENIA};${STATUS};${SECURE};${SEKRET}`
		const hashCheck = crypto.createHash('sha256').update(hashString).digest('hex')

		if (hashCheck !== HASH) {
			throw new PaymentError('Niepoprawny hash!')
		}

		if (STATUS === 'SUCCESS') {
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
			return
		}
		if (STATUS === 'FAILURE') {
			throw new PaymentError('Płatność się niepowiodła')
		}
	}
}
export default new PaymentService()
