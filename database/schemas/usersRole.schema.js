const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema(
	{
		sub_role: {
			type: String,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("user_roles", userRoleSchema);
