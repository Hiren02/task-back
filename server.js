// PARSE .ENV
require("dotenv").config();
const actuator = require("express-actuator");
// FOR SERVER
// CHECK WITH PROTOCOL TO USE
const http = require("http");
const path = require("path");

const express = require("express"); // NODE FRAMEWORK
const bodyParser = require("body-parser"); // TO PARSE POST REQUEST
const cors = require("cors"); // ALLOW CROSS ORIGIN REQUESTS

// ---------------------------    SERVER CONFIGS ----------------------------------
// SSL CONFIG
const port = process.env.SERVER_PORT || 9000;
const app = express();
const server = http.createServer(app);

// GLOBAL SETTINGS FILES
require("./configs/globals");

// --------------------------   LANGUAGE    ----------------------------------------
// Define unique Key - pair in Locales / Messages.js
// It will add entry in respective json files
/* By default language is set to english  User can change by  passing  language in
	Header :
	Accept-Language : 'en'
	Query : 
	url?lang=en
*/
const language = require("i18n");
language.configure({
	locales: ["en"],
	defaultLocale: "en",
	autoReload: true,
	directory: __dirname + "/locales",
	queryParameter: "lang",
	objectNotation: true,
	syncFiles: true,
});

// ------------------------      GLOBAL MIDDLEWARE -------------------------
app.use(actuator({ infoGitMode: "full" }));

app.use(
	bodyParser.json({
		type: [
			"application/json",
			"application/encrypted-json",
			"multipart/form-data; boundary=<calculated when request is sent>",
		],
	})
);
// app.use(bodyParser.json()); // ALLOW APPLICATION JSON
app.use(express.urlencoded({ extended: true })); // ALLOW APPLICATION JSON
app.use(bodyParser.urlencoded({ extended: false })); // ALLOW URL ENCODED PARSER
app.use(cors()); // ALLOWED ALL CROSS ORIGIN REQUESTS
app.use(express.static(__dirname + "/Assets")); // SERVE STATIC IMAGES FROM ASSETS FOLDER
app.use(express.static(__dirname + "/Logs")); // SERVE STATIC IMAGES FROM ASSETS FOLDER
app.use(language.init); // MULTILINGUAL SETUP
app.set("view engine", "ejs"); //Set ejs view engine
app.set("views", __dirname + "/Views");

app.use("/images", express.static(path.join(__dirname, "Assets/Images/Users")));

// ------------------------    RESPONSE HANDLER    -------------------
app.use((req, res, next) => {
	const ResponseHandler = require("./configs/response");
	res.handler = new ResponseHandler(req, res);
	next();
});

// --------------------------    ROUTES    ------------------
const appRoutes = require("./routes");
const chalk = require("chalk");
appRoutes(app);

// --------------------------    GLOBAL ERROR HANDLER    ------------------
app.use((err, req, res, next) => {
	if (res.headersSent) {
		return next(err);
	}
	res.handler.serverError(err);
});

// --------------------------    START SERVER    ---------------------
server.listen(port, () => {
	console.log(
		chalk.bold.cyanBright(
			`\nServer started on ${chalk.white.bold(port)} :) \n`
		)
	);
});
