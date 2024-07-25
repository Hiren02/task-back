const userModel = new (require("../Models/Auth.Model"))();

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async getUser(req) {
		try {
			const user = await userModel.getUser({
				$or: [{ email: req.body?.email }, { id: req.body?.id }],
			});
			return user;
		} catch (err) {
			console.log(err.message);
		}
	}

	async checkUserExists(req, res, next) {
		const user = await self.getUser(req);
		if (!user) {
			res.handler.notFound("VALIDATION.NOT_FOUND.USER");
		} else {
			req.user = user;
			next();
		}
	}

	async checkUserNotExists(req, res, next) {
		const user = await self.getUser(req);
		if (user) {
			res.handler.conflict("VALIDATION.EXISTS.USER");
		} else {
			next();
		}
	}
};
