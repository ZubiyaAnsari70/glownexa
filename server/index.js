require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 6,
  message: { success: false, error: 'Too many requests, try again later.' }
});
app.use('/api/contact', limiter);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.error('Nodemailer verify failed:', error);
  } else {
    console.log('Nodemailer server is ready to take messages');
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_TO_EMAIL,
      subject: subject || 'Contact Form Message',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br/>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error('Mail send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
