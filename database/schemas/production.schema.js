const mongoose = require("mongoose");

const productionStageSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		members: [
			{
				start_date: { type: Date },
				end_date: { type: Date },
				sub_role: { type: String },
				weeks: { type: Number },
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "users",
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
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

module.exports = mongoose.model("production", productionStageSchema);
require("../change.stream/production");
