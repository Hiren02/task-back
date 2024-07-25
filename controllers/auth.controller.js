const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const generator = require("generate-password");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { USER_ROLE } = require("../configs/constants");
const userModel = new (require("../models/auth.model"))();
const orgModel = new (require("../models/org.model"))();
const FileManager = require("../manager/fileManager");
const { updateprofile_images } = require("../utils/constant");
const {
	inviteUserMail,
	inviteInWebsiteMail,
	forgotPasswordMail,
} = require("../utils/emailHelper");

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	signToken(
		userId,
		user,
		tokenExpireTime = process.env.JWT_EXPIRES_IN,
		secret = process.env.JWT_SECRET
	) {
		const token = jwt.sign({ _id: userId, user }, secret, {
			expiresIn: tokenExpireTime,
		});
		return token;
	}

	signForgotPasswordToken(
		userId,
		tokenExpireTime = process.env.FORGOT_PASSWORD_JWT_EXPIRES_IN,
		secret = process.env.JWT_SECRET
	) {
		const token = jwt.sign({ _id: userId }, secret, {
			expiresIn: tokenExpireTime,
		});
		return token;
	}

	async signUp(req, res) {
		try {
			let { organization, email } = req.body;

			const isUserExist = await userModel.getUser({ email });

			if (isUserExist) return res.handler.conflict("STATUS.CONFLICT");

			// const userRole = await userModel.findRoleIdByRole(role);

			// if (!userRole)
			// 	return res.handler.notFound("VALIDATION.NOT_FOUND.USER_ROLE");

			// req.body.role = userRole._id;

			let orgExits = await orgModel.findOrgByName(organization);

			if (orgExits)
				return res.handler.badRequest("VALIDATION.EXISTS.ORGANIZATION");

			await orgModel.createOrg({
				name: req.body.organization,
			});

			// req.body.organization = orgExits?._id;

			let newUser = await userModel.createUser(req.body);

			newUser.password = undefined;

			// await userModel.createPermission({
			// 	user: newUser?._id,
			// 	userOrg: req.body.organization,
			// 	userRole: req.body.role,
			// });

			// const permission = await userModel.findUserPermission({
			// 	user: newUser?._id,
			// 	userOrg: req.body.organization,
			// 	userRole: req.body.role,
			// });

			// if (!permission) res.handler.badRequest("STATUS.NOT_FOUND");

			// const roles = permission.userRole;
			// const userOrg = permission.userOrg;
			const token = self.signToken(newUser._id, newUser);

			res.handler.success({ user: newUser, token }, "STATUS.CREATED");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async login(req, res) {
		try {
			let user = await userModel.getUser(
				{
					email: req.body.email,
				},
				undefined,
				true
			);

			if (!user) {
				return res.handler.notFound("VALIDATION.NOT_FOUND.USER");
			}

			const isUserAuthenticated = await user.correctPassword(
				req.body.password,
				user.password
			);

			if (!isUserAuthenticated) {
				return res.handler.badRequest("VALIDATION.PASSWORD.INCORRECT");
			}

			user.password = undefined;

			if (!user.is_active)
				return res.handler.badRequest(
					"VALIDATION.MESSAGE.INACTIVE_USER"
				);

			// const permissions = await userModel.findAllUserPermission({
			// 	user: user?._id,
			// 	is_active: true,
			// });

			// if (!permissions?.length) {
			// 	return res.handler.badRequest(
			// 		"VALIDATION.MESSAGE.INACTIVE_USER"
			// 	);
			// }

			let token;
			// const userRole = permissions[0].userRole;
			// const userOrg = permissions[0].userOrg;
			token = self.signToken(user._id, user);
			return res.handler.success({ token, user });
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async forgotPassword(req, res) {
		try {
			const userExist = await userModel.getUser({
				email: req.body?.email,
			});

			if (!userExist)
				return res.handler.notFound("VALIDATION.NOT_FOUND.USER");

			const token = self.signForgotPasswordToken(userExist._id);

			forgotPasswordMail(
				req.body.email,
				`${
					process.env.FRONT_END_BASE_URL +
					`/reset-password?token=${token}`
				}`
			);

			res.handler.success({}, "STATUS.SEND_EMAIL_SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async resetPassword(req, res) {
		try {
			const { token } = req.query;
			const { password } = req.body;

			if (!token)
				return res.handler.notFound(
					undefined,
					"VALIDATION.NOT_FOUND.TOKEN"
				);

			const decodedToken = await promisify(jwt.verify)(
				token,
				process.env.JWT_SECRET
			);

			if (!decodedToken)
				return res.handler.badRequest(
					undefined,
					"VALIDATION.USER.TOKEN"
				);

			const newPass = await bcrypt.hash(password, 12);

			const user = await userModel.findByIdAndUpdateUser(
				{
					_id: decodedToken?._id,
				},
				{ password: newPass }
			);
			user.password = undefined;

			res.handler.success({ user }, "STATUS.SUCCESS");
		} catch (error) {
			if (error.message === "jwt expired")
				return res.handler.badRequest("VALIDATION.USER.TOKEN");
			res.handler.serverError(error);
		}
	}

	// ADMIN
	async inviteAdmin(req, res) {
		try {
			let body = {
				...req.body,
				profile_image: req.body?.profile_image
					? req.body?.profile_image[0]
					: null,
				role: USER_ROLE["admin"],
			};
			const { email } = body;

			const isUserExist = await userModel.getUser({ email });
			// const roles = await userModel.findRoleIdByRole(role);

			if (isUserExist) {
				return res.handler.conflict("STATUS.CONFLICT");
			}

			const password = generator.generate({
				length: 8,
				numbers: true,
				symbols: true,
				lowercase: true,
				uppercase: true,
			});

			let newUser = await userModel.createUser({
				...body,
				password,
			});

			newUser.password = undefined;

			if (body?.profile_image) {
				await FileManager.uploadToCloud(
					body.profile_image,
					`profile-images/${newUser._id}`,
					"original"
				);
			}

			inviteUserMail(email, password);
			inviteInWebsiteMail(email);

			// await userModel.createPermission({
			// 	user: userData?._id,
			// 	userOrg: new mongoose.Types.ObjectId(req.user.userOrg._id),
			// 	userRole: roles._id,
			// });

			res.handler.success({ user: newUser }, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async editAdmin(req, res) {
		try {
			const { first_name, last_name, phone_number, is_active } = req.body;
			const profile_image =
				req.body?.profile_image && req.body.profile_image[0];

			const { id } = req.query;
			if (!id) return res.handler.badRequest("STATUS.NOT_FOUND.USER");

			const exitsUser = await userModel.getUserById(id);
			if (!exitsUser)
				return res.handler.badRequest("VALIDATION.NOT_FOUND.USER");

			if (profile_image) {
				const awsOperationsPromises = [
					FileManager.uploadToCloud(
						profile_image,
						`profile-images/${id}`,
						"original"
					),
				];
				if (exitsUser.profile_image) {
					awsOperationsPromises.unshift(
						FileManager.delete(
							FileManager.getFileNameFromUrl(
								exitsUser.profile_image
							),
							`profile-images/${id}`
						)
					);
				}

				await Promise.all(awsOperationsPromises);
			}

			let user;
			if (
				first_name ||
				last_name ||
				phone_number ||
				profile_image ||
				is_active
			) {
				user = await userModel.findByIdAndUpdateUser(
					{ _id: new mongoose.Types.ObjectId(id) },
					{
						first_name,
						last_name,
						phone_number,
						profile_image,
						is_active,
					}
				);
			}

			if (!user) return res.handler.badRequest("STATUS.NOT_FOUND");

			res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async deleteAdmin(req, res) {
		try {
			const { id } = req.query;
			if (!id) return res.handler.badRequest("STATUS.NOT_FOUND.USER");

			const user = await userModel.findByIdAndDeleteUser(id);

			if (!user) {
				res.handler.badRequest("STATUS.NOT_FOUND");
				return;
			}

			res.handler.success({ user }, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getAdminList(req, res) {
		try {
			let { page = 1, limit = 15 } = req.query;
			page = Number(page);
			limit = Number(limit);
			const skip = (page - 1) * limit;

			let adminList = await userModel.getAllUser(
				{
					role: USER_ROLE["admin"],
				},
				skip,
				limit,
				req?.user?._id
			);

			const { data, totalCount } =
				(adminList && adminList?.length && adminList[0]) || [];

			adminList = await updateprofile_images(data);

			let hasMore = false;

			if (totalCount?.count >= page * limit) hasMore = true;

			res.handler.success(
				{ adminList, totalCount: totalCount?.count ?? 0, hasMore },
				"STATUS.SUCCESS"
			);
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	// USER

	async inviteUser(req, res) {
		try {
			let body = {
				...req.body,
				profile_image: req.body?.profile_image
					? req.body?.profile_image[0]
					: null,
				role: USER_ROLE["user"],
			};

			const { email } = body;

			const isUserExist = await userModel.getUser({ email });
			if (isUserExist) return res.handler.conflict("STATUS.CONFLICT");

			const password = generator.generate({
				length: 8,
				numbers: true,
				symbols: true,
				lowercase: true,
				uppercase: true,
			});

			let newUser = await userModel.createUser({
				...body,
				password,
			});

			newUser.password = undefined;

			if (body?.profile_image) {
				await FileManager.uploadToCloud(
					body.profile_image,
					`profile-images/${newUser._id}`,
					"original"
				);
			}

			inviteUserMail(email, password);
			inviteInWebsiteMail(email);

			res.handler.success({ user: newUser }, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async editUser(req, res) {
		try {
			const { first_name, last_name, phone_number, is_active } = req.body;
			const profile_image =
				req.body?.profile_image && req.body.profile_image[0];
			const { id } = req.query;

			if (!id) return res.handler.badRequest("VALIDATION.NOT_FOUND.USER");

			const exitsUser = await userModel.getUserById(id);
			if (!exitsUser)
				return res.handler.badRequest("VALIDATION.NOT_FOUND.USER");

			let user;
			if (profile_image) {
				const awsOperationsPromises = [
					FileManager.uploadToCloud(
						profile_image,
						`profile-images/${id}`,
						"original"
					),
				];
				if (exitsUser.profile_image) {
					awsOperationsPromises.unshift(
						FileManager.delete(
							FileManager.getFileNameFromUrl(
								exitsUser.profile_image
							),
							`profile-images/${id}`
						)
					);
				}

				await Promise.all(awsOperationsPromises);
			}

			if (
				first_name ||
				last_name ||
				phone_number ||
				profile_image ||
				is_active
			) {
				user = await userModel.findByIdAndUpdateUser(
					{ _id: new mongoose.Types.ObjectId(id) },
					{
						first_name,
						last_name,
						phone_number,
						profile_image,
						is_active,
					}
				);
			}

			if (!user) {
				res.handler.badRequest("STATUS.NOT_FOUND");
				return;
			}
			res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async deleteUser(req, res) {
		try {
			const { id } = req.query;
			if (!id) res.handler.badRequest("STATUS.NOT_FOUND.USER");

			const user = await userModel.findByIdAndDeleteUser(id);

			if (!user) {
				res.handler.badRequest("STATUS.NOT_FOUND");
				return;
			}
			res.handler.success({ user }, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getUserList(req, res) {
		try {
			let { page = 1, limit = 15 } = req.query;
			page = Number(page);
			limit = Number(limit);
			const skip = (page - 1) * limit;

			let userList = await userModel.getAllUser(
				{
					role: USER_ROLE["user"],
				},
				skip,
				limit,
				req?.user?._id
			);

			const { data, totalCount } =
				(userList && userList?.length && userList[0]) || [];

			userList = await updateprofile_images(data);

			let hasMore = false;

			if (totalCount?.count >= page * limit) hasMore = true;

			res.handler.success(
				{ userList, totalCount: totalCount?.count ?? 0, hasMore },
				"STATUS.SUCCESS"
			);
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}
};
