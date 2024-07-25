const mongoose = require("mongoose");

const DevelopmentStageSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		development_weeks: Number,
		members: [
			{
				start_date: { type: Date, required: true },
				end_date: { type: Date, required: true },
				sub_role: { type: String, required: true },
				weeks: { type: Number, required: true },
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "users",
					required: true,
				},
				episodes: [
					{
						_id: {
							type: mongoose.Schema.Types.ObjectId,
							ref: "episodes",
							required: true,
						},
						name: {
							type: String,
							required: true,
						},
					},
				],
			},
		],
		decks: [
			{
				column: {
					type: String,
				},
				date: {
					type: Date,
				},
				end_date: {
					type: Date,
				},
				version: {
					type: String,
				},
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

module.exports = mongoose.model("development", DevelopmentStageSchema);
require("../change.stream/development");
