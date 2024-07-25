const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { promisify } = require("util");
const path = require("path");

class Email {
	constructor(senderEmail = null) {
		this.transporter = null;
		this.fromEmail = senderEmail;
	}

	async createTransporter(config = null) {
		if (this.transporter) return;

		if (config) {
			this.transporter = nodemailer.createTransport(config);
			return;
		}

		const testAccount = await nodemailer.createTestAccount();
		this.transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false, // false for TLS
			auth: {
				user: testAccount.user,
				pass: testAccount.pass,
			},
		});
		this.fromEmail = this.fromEmail ?? testAccount.user;

		return;
	}

	async sendMail({
		receiverMail,
		subject,
		senderEmail,
		text,
		transporterConfig,
		templateName,
		templateReplaceValue,
	}) {
		try {
			await this.createTransporter(transporterConfig);
			let template = null;
			if (templateName) {
				const templatePath = path.join(
					__dirname,
					"../",
					"templates",
					templateName
				);

				template = await promisify(ejs.renderFile)(
					templatePath,
					templateReplaceValue
				);
			}
			const mailOption = {
				from: senderEmail ?? this.fromEmail,
				to: receiverMail,
				subject,
				text: text ?? "",
				html: template ?? "",
			};

			const sendingInfo = await this.transporter.sendMail(mailOption);
			console.log("Message sent: %s", sendingInfo.messageId);
			console.log(
				"Preview URL: %s",
				nodemailer.getTestMessageUrl(sendingInfo)
			);
		} catch (err) {
			console.log(err.message);
			// throw new Error(err);
		}
	}
}

module.exports = new Email();
