import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000;

// Ustawienia HotPay
const hotpayApiUrl = 'https://api.hotpay.pl';
const hotpayApiKey = 'YOUR_HOTPAY_API_KEY';

// Endpoint do inicjacji płatności
app.post('/create-payment', async (req, res) => {
    try {
        const paymentData = {
            amount: req.body.amount,
            currency: 'PLN',
            description: 'Test Payment',
            return_url: 'https://yourwebsite.com/return',
            notify_url: 'https://yourwebsite.com/notify',
            api_key: hotpayApiKey
        };

        const response = await axios.post(`${hotpayApiUrl}/payment`, paymentData);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint do obsługi powrotu z płatności
app.get('/return', (req, res) => {
    res.send('Płatność zakończona pomyślnie!');
});

// Endpoint do obsługi powiadomień o płatności
app.post('/notify', (req, res) => {
    // Obsługa powiadomień o płatności
    console.log('Powiadomienie o płatności:', req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
