const mongoose = require("mongoose");

const episodesSchema = new mongoose.Schema(
	{
		name: String,
		title: String,
		weeks: Number,
		trt: String,
		start_date: Date,
		end_date: Date,
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		project: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		details: [
			{
				version_name: {
					type: String,
					trim: true,
					required: true,
				},
				version_no: { type: String, trim: true, required: true },
				page: { type: Number, required: true },
				color: { type: String, trim: true, required: true },
				version_date: { type: Date, required: true },
				naming_convention: { type: String, trim: true, required: true },
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

module.exports = mongoose.model("episodes", episodesSchema);
require("../change.stream/episode");
