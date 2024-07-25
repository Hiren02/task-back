const mongoose = require("mongoose");

const postProductionStageSchema = new mongoose.Schema(
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
				weeks: { type: String },
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
		offline: [
			{
				episodes: {
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
				air_date: {
					type: Date,
				},
				editor: {
					type: String,
				},
				days_for_editor_cut: {
					type: String,
				},
				editor_cut_date: {
					type: Date,
				},
				days_for_editor_cut_2: {
					type: String,
				},
				editor_cut_date_2: {
					type: Date,
				},
				days_for_director_cut: {
					type: String,
				},
				director_cut_date: {
					type: Date,
				},
				days_for_studio_cut: {
					type: String,
				},
				studio_cut_date: {
					type: Date,
				},

				days_for_studio_cut_2: {
					type: String,
				},
				studio_cut_date_2: {
					type: Date,
				},
				days_for_network_cut: {
					type: String,
				},
				network_cut_date: {
					type: Date,
				},
				days_for_pre_lock_cut: {
					type: String,
				},
				pre_lock_cut_date: {
					type: Date,
				},
				days_for_lock_cut: {
					type: String,
				},
				lock_cut_date: {
					type: Date,
				},
			},
		],
		online: [
			{
				vfx_date: {
					type: Date,
				},
				vfx_weeks: {
					type: String,
				},
				color_start_date: {
					type: Date,
				},
				color_end_date: {
					type: Date,
				},
				days_for_color: {
					type: String,
				},
				color_review_date: {
					type: Date,
				},
				days_for_mix: {
					type: String,
				},
				mix_start_date: {
					type: Date,
				},
				mix_end_date: {
					type: Date,
				},
				days_for_music_effects: {
					type: String,
				},
				music_effects_date: {
					type: Date,
				},
				days_for_qc: {
					type: String,
				},
				qc_start_date: {
					type: Date,
				},
				qc_end_date: {
					type: Date,
				},
				qc_accepted: {
					type: Date,
				},
				days_for_localization: {
					type: String,
				},
				localization_master_to_network: {
					type: Date,
				},
				days_for_master_delivery: {
					type: String,
				},
				final_master_to_network: {
					type: Date,
				},
				final_delivery_accepted: {
					type: Date,
				},
			},
		],
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

module.exports = mongoose.model("post_production", postProductionStageSchema);
require("../change.stream/postProduction");
