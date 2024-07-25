const { query, body } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.PRE_PRODUCTION.ID").trim().notEmpty(),
];

exports.projectId = [
	query("project_id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
];

exports.createOffline = [
	...this.projectId,
	body("episodes._id", "VALIDATION.EPISODE.ID").trim().notEmpty(),
	body("episodes.name", "VALIDATION.EPISODE.NAME").trim().notEmpty(),
	body("editor", "VALIDATION.POST_PRODUCTION_OFFLINE.EDITOR")
		.trim()
		.optional(),
	body("air_date", "VALIDATION.POST_PRODUCTION_OFFLINE.AIR_DATE")
		.toDate()
		.optional(),
	body(
		"days_for_editor_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_EDITOR_CUT"
	)
		.trim()
		.optional(),
	body(
		"editor_cut_date",
		"VALIDATION.POST_PRODUCTION_OFFLINE.EDITOR_CUT_DATE"
	)
		.toDate()
		.optional(),
	body(
		"days_for_editor_cut_2",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_EDITOR_CUT_2"
	)
		.trim()
		.optional(),
	body(
		"editor_cut_date_2",
		"VALIDATION.POST_PRODUCTION_OFFLINE.EDITOR_CUT_DATE_2"
	)
		.toDate()
		.optional(),
	body(
		"days_for_director_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_DIRECTOR_CUT"
	)
		.trim()
		.optional(),
	body(
		"director_cut_date",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DIRECTOR_CUT_DATE"
	)
		.toDate()
		.optional(),
	body(
		"days_for_studio_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_STUDIO_CUT"
	)
		.trim()
		.optional(),
	body(
		"studio_cut_date",
		"VALIDATION.POST_PRODUCTION_OFFLINE.STUDIO_CUT_DATE"
	)
		.toDate()
		.optional(),
	body(
		"days_for_studio_cut_2",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_STUDIO_CUT_2"
	)
		.trim()
		.optional(),
	body(
		"studio_cut_date_2",
		"VALIDATION.POST_PRODUCTION_OFFLINE.STUDIO_CUT_DATE_2"
	)
		.toDate()
		.optional(),
	body(
		"days_for_network_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_NETWORK_CUT"
	)
		.trim()
		.optional(),
	body(
		"network_cut_date",
		"VALIDATION.POST_PRODUCTION_OFFLINE.NETWORK_CUT_DATE"
	)
		.toDate()
		.optional(),
	body(
		"days_for_pre_lock_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_PRE_LOCK_CUT"
	)
		.trim()
		.optional(),
	body(
		"pre_lock_cut_date",
		"VALIDATION.POST_PRODUCTION_OFFLINE.PRE_LOCK_CUT_DATE"
	)
		.toDate()
		.optional(),
	body(
		"days_for_lock_cut",
		"VALIDATION.POST_PRODUCTION_OFFLINE.DAYS_FOR_LOCK_CUT"
	)
		.trim()
		.optional(),
	body("lock_cut_date", "VALIDATION.POST_PRODUCTION_OFFLINE.LOCK_CUT_DATE")
		.toDate()
		.optional(),
];

exports.createOnline = [
	...this.projectId,
	body("vfx_date", "VALIDATION.POST_PRODUCTION_ONLINE.VFX_DATE")
		.toDate()
		.optional(),
	body("vfx_weeks", "VALIDATION.POST_PRODUCTION_ONLINE.VFX_WEEKS")
		.trim()
		.optional(),
	body(
		"color_start_date",
		"VALIDATION.POST_PRODUCTION_ONLINE.COLOR_START_DATE"
	)
		.toDate()
		.optional(),
	body("color_end_date", "VALIDATION.POST_PRODUCTION_ONLINE.COLOR_END_DATE")
		.toDate()
		.optional(),
	body("days_for_color", "VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_COLOR")
		.trim()
		.optional(),
	body(
		"color_review_date",
		"VALIDATION.POST_PRODUCTION_ONLINE.COLOR_REVIEW_DATE"
	)
		.toDate()
		.optional(),
	body("days_for_mix", "VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_MIX")
		.trim()
		.optional(),
	body("mix_start_date", "VALIDATION.POST_PRODUCTION_ONLINE.MIX_START_DATE")
		.toDate()
		.optional(),
	body("mix_end_date", "VALIDATION.POST_PRODUCTION_ONLINE.MIX_END_DATE")
		.toDate()
		.optional(),
	body(
		"days_for_music_effects",
		"VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_MUSIC_EFFECTS"
	)
		.trim()
		.optional(),
	body(
		"music_effects_date",
		"VALIDATION.POST_PRODUCTION_ONLINE.MUSIC_EFFECTS_DATE"
	)
		.toDate()
		.optional(),
	body("days_for_qc", "VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_QC")
		.trim()
		.optional(),
	body("qc_start_date", "VALIDATION.POST_PRODUCTION_ONLINE.QC_START_DATE")
		.toDate()
		.optional(),
	body("qc_end_date", "VALIDATION.POST_PRODUCTION_ONLINE.QC_END_DATE")
		.toDate()
		.optional(),
	body("qc_accepted", "VALIDATION.POST_PRODUCTION_ONLINE.QC_ACCEPTED")
		.toDate()
		.optional(),
	body(
		"days_for_localization",
		"VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_LOCALIZATION"
	)
		.trim()
		.optional(),
	body(
		"localization_master_to_network",
		"VALIDATION.POST_PRODUCTION_ONLINE.LOCALIZATION_MASTER_TO_NETWORK"
	)
		.toDate()
		.optional(),
	body(
		"days_for_master_delivery",
		"VALIDATION.POST_PRODUCTION_ONLINE.DAYS_FOR_MASTER_DELIVERY"
	)
		.trim()
		.optional(),
	body(
		"final_master_to_network",
		"VALIDATION.POST_PRODUCTION_ONLINE.FINAL_MASTER_TO_NETWORK"
	)
		.toDate()
		.optional(),
	body(
		"final_delivery_accepted",
		"VALIDATION.POST_PRODUCTION_ONLINE.FINAL_DELIVERY_ACCEPTED"
	)
		.toDate()
		.optional(),
];
exports.updateOffline = [
	...this.queryIdRequiredValidation,
	...this.createOffline,
];

exports.updateOnline = [
	...this.queryIdRequiredValidation,
	...this.createOnline,
];
