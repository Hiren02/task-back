const mongoose = require("mongoose");

const unitsSchema = new mongoose.Schema(
	{
		unit_name: String,
		location: String,
		activity: String,
		start_date: Date,
		days: Number,
		end_date: Date,
		scene_selection: [String],
		designated_script: String,
		block: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "blocks",
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("units", unitsSchema);
