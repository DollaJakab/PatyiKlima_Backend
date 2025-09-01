// server.js (Express example)
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const allowedOrigins = ['https://www.patyi-klima.hu', 'https://www.patyiklima.hu']; // your React site URL

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true); // allow tools like Postman
			if (!allowedOrigins.includes(origin)) {
				// Reject the request but don't crash
				return callback(null, false);
			}
			return callback(null, true);
		},
	})
);

app.use(express.json());

app.post('/api/send-email', async (req, res) => {
	const { name, email, mobileNumber, zip, message } = req.body;
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.USER_NAME,
			pass: process.env.USER_PASSWORD,
		},
	});

	try {
		console.log(req.body);

		await transporter.sendMail({
			from: 'patyiklima@gmail.com',
			to: 'patyiklima@gmail.com',
			subject: 'New Contact Form Submission',
			text: `
        Név: ${name}
        Email: ${email}
        Telefonszám: ${mobileNumber}
        Irányítószám: ${zip}
        Üzenet: ${message}
      `,
		});
		res.status(200).send('Email sent');
	} catch (err) {
		res.status(500).send('Failed to send email');
	}
});

app.listen(3001, () => console.log('Server running on port 3001'));
