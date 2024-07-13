import MailgunSDK from 'mailgun-js-sdk'

const Mailgun = new MailgunSDK({
    apiKey: process.env.MAILGUN_API_KEY,
});



export const sendMail = async (mailOptions) => {
    await Mailgun.sendMessage(process.env.MAILGUN_DOMAIN, mailOptions )
};