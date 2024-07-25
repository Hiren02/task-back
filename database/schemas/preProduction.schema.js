const mongoose = require("mongoose");

const preProductionStageSchema = new mongoose.Schema(
	{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "projects",
		},
		rooms: {
			mini_writer_room: {
				start_date: Date,
				weeks: Number,
				end_date: Date,
			},
			pre_writer_room: {
				start_date: Date,
				weeks: Number,
				end_date: Date,
			},
			writer_room: {
				start_date: Date,
				weeks: Number,
				end_date: Date,
			},
		},

		preparation_weeks: {
			soft_prep_weeks: {
				weeks: Number,
				start_date: Date,
				end_date: Date,
				dates: [{ start_date: Date, end_date: Date }],
			},
			pre_prep_weeks: {
				weeks: Number,
				start_date: Date,
				end_date: Date,
				dates: [{ start_date: Date, end_date: Date }],
			},
			prep_weeks: {
				weeks: Number,
				start_date: Date,
				end_date: Date,
				dates: [{ start_date: Date, end_date: Date }],
			},
		},

		project_green_light: Date,
		production_kick_off: Date,
		pre_studio_show_and_tell: Date,
		studio_show_and_tell: Date,
		pre_studio_network_show_and_tell: Date,
		studio_network_show_and_tell: Date,
		camera_hair_wardrobe_test: Date,
		cast_read_through: Date,
		cast_dinner: Date,

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

module.exports = mongoose.model("pre_production", preProductionStageSchema);
require("../change.stream/preProduction");
