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

module.exports = transporterConfig;
