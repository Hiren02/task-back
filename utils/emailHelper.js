const emailHelper = require("../configs/email");

const transporterConfig = {
	service: "gmail",
	port: 587,
	host: "smtp.gmail.com",
	secure: false,
	auth: {
		user: process.env.EMAIL_ADDRESS,
		pass: process.env.EMAIL_PASSWORD,
	},
};

module.exports.sendResetPasswordMailHelper = function (receiverMail, otp) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Password Reset  For Your Schedule wood Account ",
			senderEmail: process.env.EMAIL_ADDRESS,
			templateName: "resetPassword.ejs",
			templateReplaceValue: {
				otp: `${otp}`,
				baseUrl: process.env.FRONTEND_BASE_URL,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.inviteInWebsiteMail = function (receiverMail) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Invitation",
			senderEmail: process.env.EMAIL_ADDRESS,
			templateName: "inviteProject.ejs",
			templateReplaceValue: {
				baseUrl: process.env.FRONTEND_BASE_URL,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.inviteUserMail = function (receiverMail, password) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Invitation",
			senderEmail: process.env.EMAIL_ADDRESS,
			templateName: "inviteEmail.ejs",
			templateReplaceValue: {
				baseUrl: process.env.FRONTEND_BASE_URL,
				password,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.forgotPasswordMail = function (receiverMail, resetLink) {
	try {
		emailHelper.sendMail({
			receiverMail: receiverMail,
			subject: "Reset Password",
			templateName: "forgotPasswordEmail.ejs",
			templateReplaceValue: {
				resetLink: resetLink,
			},
			transporterConfig,
		});
	} catch (err) {
		console.log(err);
	}
};
