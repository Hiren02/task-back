const mongoose = require("mongoose");

const projectMembersSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users",
				required: true,
			},
		],
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("project_members", projectMembersSchema);
