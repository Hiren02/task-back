const appRoute = require("./app");
module.exports = (app) => {
	app.get("/", (req, res) => {
		res.status(STATUS_CODES.SUCCESS).send(
			"Welcome to " + process.env.PROJECT_NAME
		);
	});
	// app.use("/cms", require("./CMS"));
	app.use("/app" + "/" + process.env.API_VERSION, appRoute);
};
