const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		block_details: [
			{
				block_number: { type: Number },
				trt: { type: String },
				title: { type: String },
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
				shooting: [
					{
						location: { type: String },
						activity: { type: String },
						start_date: { type: Date },
						end_date: { type: Date },
						no_of_days: { type: Number },
						scene_selection: { type: String },
						episode: {
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
						designated_script: { type: String },
						circle_take: String,
						vfx: { type: Boolean, defaultValue: false },
						scene_cut: { type: Boolean, defaultValue: false },
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

module.exports = mongoose.model("blocks", blockSchema);
