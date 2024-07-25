const { body, query } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.PRE_PRODUCTION.ID").trim().notEmpty(),
];

exports.productionStageValidation = [
	query("project_id", "VALIDATION.PRE_PRODUCTION.PROJECT_ID_REQUIRED")
		.trim()
		.notEmpty(),
	// mini writer rooms
	body("rooms.mini_writer_room.start_date").optional().toDate(),
	body("rooms.mini_writer_room.weeks").optional().isNumeric(),

	// pre writer rooms
	body("rooms.pre_writer_room.start_date").optional().toDate(),
	body("rooms.pre_writer_room.weeks").optional().isNumeric(),

	// writer rooms
	body("rooms.writer_room.start_date").optional().toDate(),
	body("rooms.writer_room.weeks").optional().isNumeric(),

	// others
	body("project_green_light").optional().toDate(),

	body("production_kick_off").optional().toDate(),

	body("pre_studio_show_and_tell").optional().toDate(),

	body("studio_show_and_tell").optional().toDate(),

	body("pre_studio_network_show_and_tell").optional().toDate(),

	body("studio_network_show_and_tell").optional().toDate(),

	body("camera_hair_wardrobe_test").optional().toDate(),

	body("cast_read_through").optional().toDate(),

	body("cast_dinner").optional().toDate(),
];

exports.updatePreProductionStage = [...this.productionStageValidation];
