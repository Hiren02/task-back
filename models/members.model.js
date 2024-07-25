const { MembersSchema } = require("../database/schemas");

module.exports = class {
	insertManyMembers(data) {
		return MembersSchema.insertMany(data);
	}

	createMember(data) {
		return MembersSchema.create(data);
	}

	editMember(condition, data) {
		return MembersSchema.findByIdAndUpdate(condition, data);
	}

	getMemberData(condition) {
		return MembersSchema.aggregate([
			{ $match: condition },
			{
				$lookup: {
					from: "episodes",
					localField: "episodes",
					foreignField: "_id",
					as: "episodes",
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "user",
				},
			},
			{ $unwind: "$user" },
		]);
	}
};
