const { usersSchema, userRolesSchema } = require("../database/schemas");
const emailHandle = require("../configs/email");
const generator = require("generate-password");
const { inviteUserMail } = require("../utils/emailHelper");

module.exports = class {
	createUser(user) {
		return usersSchema.create(user);
	}

	getUserById(userId, isPasswordRequired = false) {
		if (isPasswordRequired) {
			return usersSchema.findById(userId).select("+password");
		}

		return usersSchema.findById(userId).populate();
	}

	getUser(condition, projection = {}, isPasswordRequired = false) {
		if (isPasswordRequired) {
			return usersSchema
				.findOne(condition, projection)
				.select("+password");
		}

		return usersSchema.findOne(condition, projection);
	}

	getUserRoleByRole(role) {
		return userRolesSchema.find({ role }).select("-permission");
	}

	getUserRoleList() {
		return userRolesSchema.find();
	}

	findRoleIdByRole(role) {
		return userRolesSchema.findOne({ role });
	}

	findRoleIdBySubRole(subRole) {
		return userRolesSchema.findOne({ subRole });
	}

	findByIdAndUpdateUser(userId, updatedValue, option) {
		return usersSchema.findOneAndUpdate(userId, updatedValue, option);
	}

	findByIdAndDeleteUser(userId) {
		return usersSchema.findByIdAndDelete(userId);
	}

	getAllUser(condition, skip, limit, exitId) {
		return usersSchema.aggregate([
			{ $match: condition },
			{ $match: { _id: { $ne: exitId } } },
			{
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					totalCount: [
						{
							$count: "count",
						},
					],
				},
			},
			{ $unwind: "$totalCount" },
		]);
	}

	async getOrCreateUser(data) {
		const { email, first_name, last_name } = data;
		let user = await this.getUser({ email });
		if (!user) {
			const password = generator.generate({
				length: 8,
				numbers: true,
				symbols: true,
				lowercase: true,
				uppercase: true,
			});

			user = await this.createUser({
				email,
				first_name,
				last_name,
				password,
			});

			inviteUserMail(email, password);
		}
		return user;
	}
};
