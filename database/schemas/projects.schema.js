const mongoose = require("mongoose");
const { PROJECT_TYPE } = require("../../configs/constants");

const projectsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
		},
		type: {
			type: String,
			enum: [
				PROJECT_TYPE.NON_SCRIPTED,
				PROJECT_TYPE.SCRIPTED,
				PROJECT_TYPE.SCRIPTED_PRODUCTION,
				PROJECT_TYPE.NON_SCRIPTED_PRODUCTION,
			],
		},
		total_episodes: {
			type: Number,
			default: 0,
		},
		total_blocks: {
			type: Number,
			default: 0,
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("projects", projectsSchema);
