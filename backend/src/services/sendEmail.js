require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log('SMTP config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
  });
 
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    bcc: process.env.EMAIL_CCO, // 👈 esta línea
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
