const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { USER_ROLE, SECURITY_ACCESS, JWT } = require("../configs/constants");
const userModel = new (require("../models/auth.model"))();

async function verifyJwtTokenAndGetUser(req, res) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.handler.validationError(`${errors.errors[0].msg}`);
		}

		const authToken = req?.headers?.authorization;

		if (!authToken) return res.handler.unauthorized();

		if (!authToken.startsWith("Bearer")) return res.handler.unauthorized();

		const token = authToken.split(" ")[1];

		const decodedToken = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);

		if (!decodedToken) return res.handler.unauthorized();

		const user = await userModel.getUserById(decodedToken._id);

		if (!user) return res.handler.unauthorized();
		const userDetails = { ...user._doc };

		if (!userDetails.is_active)
			return res.handler.unauthorized("VALIDATION.MESSAGE.INACTIVE_USER");

		return userDetails;
	} catch (err) {
		if (JWT.expired === err?.message) {
			res.handler.unauthorized();
			return;
		}
		res.handler.serverError();
	}
}

module.exports.authAdmin = async function (req, res, next) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.handler.validationError(`${errors.errors[0].msg}`);
		}

		const { baseUrl } = req;

		const authToken = req.headers.authorization;

		if (!authToken) {
			return res.handler.unauthorized();
		}

		if (!authToken.startsWith("Bearer")) return res.handler.unauthorized();

		const token = authToken.split(" ")[1];

		const decodedToken = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);

		const user = userModel.getUserById(decodedToken.id);

		if (!user) return res.handler.unauthorized();

		const adminRole = userModel.findRoleIdByRole(USER_ROLE["admin"]);

		if (
			adminRole._id !== decodedToken.role ||
			!SECURITY_ACCESS[USER_ROLE["admin"]].includes(baseUrl)
		) {
			return res.handler.forbidden("STATUS.UNAUTHORIZED");
		}

		req.admin = user;

		next();
	} catch (err) {
		return res.handler.serverError();
	}
};

module.exports.authUser = async function (req, res, next) {
	try {
		const user = verifyJwtTokenAndGetUser(req, res);

		const userRole = await userModel.findRoleIdByRole(USER_ROLE["user"]);

		if (userRole._id !== decodedToken.role) {
			return res.handler.forbidden("STATUS.UNAUTHORIZED");
		}

		req.user = user;

		next();
	} catch (err) {
		return res.handler.serverError(err.message);
	}
};

module.exports.authOrganization = async function (req, res, next) {
	try {
		const user = await verifyJwtTokenAndGetUser(req, res);

		if (!user) return res.handler.unauthorized();

		req.user = user;
		next();
		return;
	} catch (err) {
		return;
	}
};

module.exports.superAdmin = async function (req, res, next) {
	try {
		const user = await verifyJwtTokenAndGetUser(req, res);

		if (!user) return res.handler.unauthorized();

		// const adminRole = userModel.findRoleIdByRole(USER_ROLE["superAdmin"]);

		if (
			USER_ROLE["superAdmin"] === user?.role ||
			USER_ROLE["admin"] === user?.role
		) {
			req.user = user;
			next();
			return;
		}
		return res.handler.unauthorized("STATUS.UNAUTHORIZED");
	} catch (err) {
		return;
	}
};

module.exports.publicRoute = function (req, res, next) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.handler.validationError(`${errors.errors[0].msg}`);
		}

		next();
	} catch (error) {
		return res.handler.serverError(err.message);
	}
};

module.exports.isValidToken = async function (req, res, next) {
	try {
		const user = await verifyJwtTokenAndGetUser(req, res);
		if (!user) return res.handler.unauthorized();
		req.user = user;
		next();
		return;
	} catch (error) {
		return;
	}
};

module.exports.haveAccess = function (accessDetails) {
	return async function (req, res, next) {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.handler.validationError(`${errors.errors[0].msg}`);
			}

			const authToken = req.headers.authorization;

			if (!authToken) {
				return res.handler.unauthorized();
			}

			if (!authToken.startsWith("Bearer"))
				return res.handler.unauthorized();

			const token = authToken.split(" ")[1];

			const decodedToken = await promisify(jwt.verify)(
				token,
				process.env.JWT_SECRET
			);

			const user = userModel.getUserById(decodedToken.id);

			if (!user) {
				return res.handler.notFound();
			}

			const userRole = userModel.findRoleIdByRole(
				USER_ROLE[accessDetails.role]
			);

			if (userRole._id !== decodedToken.role) {
				return res.handler.unauthorized();
			}

			const accessList = userModel.findAccessForRoleById(userRole._id);

			if (
				!accessList[accessDetails.moduleName] ||
				!accessList[accessDetails.moduleName][accessDetails.operation]
			) {
				return res.handler.unauthorized();
			}

			req.user = user;
			next();
		} catch (err) {
			return res.handler.serverError();
		}
	};
};
