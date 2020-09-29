const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        port: process.env.EMAIL_PORT,
        host: process.env.EMAIL_HOST,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'The Ultra Webmaster <webmaster@natours.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: ``
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
