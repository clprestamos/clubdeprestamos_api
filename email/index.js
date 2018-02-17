const nodemailer = require('nodemailer');

const USER = process.env.MAIL_USER;
const PASS = process.env.MAIL_PASS;

function createTransport({ user, pass }) {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: { user, pass },
	});
}

function contact({ message, sender, senderName, subject, phone }) {
	const transporter = createTransport({ user: USER, pass: PASS });

	const mailOptions = {
		to: `${USER}`,
		subject: `"${senderName}" <${sender}>: ${subject}`,
		text: `Persona: ${senderName}\nTel: ${phone}\nMensage: ${message}`,
	};

	return transporter.sendMail(mailOptions);
}

function sendmailto({ message, sender, subject }) {
	const transporter = createTransport({ user: USER, pass: PASS });

	const mailOptions = {
		to: `${sender}`,
		from: `${USER}`,
		subject: `${subject}`,
		text: `Mensage: ${message}`,
	};

	return transporter.sendMail(mailOptions);
}

module.exports = { contact, sendmailto };
