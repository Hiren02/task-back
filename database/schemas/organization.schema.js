const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: [true, "Organization name is require"],
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("organization", OrganizationSchema);
