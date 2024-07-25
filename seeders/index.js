const mongoose = require("mongoose");
const userTypeSeeder = require("./userType.seeder");
// before running seeder using command remove comments from env file & not run seeders while running server
mongoose
	.connect(process.env.MONGODB_URL, {
		dbName: process.env.DB_NAME,
	})
	.then(() => {
		console.log(
			`${process.env.DB_NAME} database connected successfully :) \n`
		);

		Promise.all([userTypeSeeder()])
			.then(() => {
				mongoose.connection.close();
				console.log("seeding is finished");
			})
			.catch((err) => {
				console.log("Unexpected Error...", err);
				process.exit(1);
			});
	})
	.catch((err) => console.log("error", err));
