const mongoose = require("mongoose");

const screenTrackerSchema = new mongoose.Schema(
	{
		scene_number: { type: String },
		shooting_date: { type: Date },
		script: { type: String },
		circle_take: [String],
		vfx: { type: Boolean },
		screen_cut: { type: Boolean },
		episode: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "episodes",
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("screen_tracker", screenTrackerSchema);
