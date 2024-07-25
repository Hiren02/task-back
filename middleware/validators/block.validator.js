const { body, query } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.BLOCK.ID").trim().notEmpty(),
];

exports.addBlock = [
	query("project_id", "VALIDATION.PROJECT.ID").notEmpty(),
	body("block_number", "VALIDATION.BLOCK.BLOCK_NUMBER").trim().notEmpty(),
	body("trt", "VALIDATION.BLOCK.TRT").trim().notEmpty(),
	body("title", "VALIDATION.BLOCK.TITLE").trim().notEmpty(),
	body("episodes.*._id", "VALIDATION.BLOCK.EPISODE_ID").trim().notEmpty(),
	body("episodes.*.name", "VALIDATION.BLOCK.EPISODE_NAME").trim().notEmpty(),
];

exports.updateBlock = [
	query("id", "VALIDATION.BLOCK.ID").notEmpty(),
	...this.addBlock,
];

exports.addShoot = [
	...this.queryIdRequiredValidation,
	query("project_id", "VALIDATION.PROJECT.ID").notEmpty(),
	body("location", "VALIDATION.BLOCK.LOCATION").trim().notEmpty(),
	body("activity", "VALIDATION.BLOCK.ACTIVITY").trim().notEmpty(),
	body("start_date", "VALIDATION.BLOCK.START_DATE").notEmpty().toDate(),
	body("no_of_days", "VALIDATION.BLOCK.NO_OF_DAYS").notEmpty().isNumeric(),
	body("scene_selection", "VALIDATION.BLOCK.SCENE_SELECTION")
		.notEmpty()
		.trim(),
	body("designated_script", "VALIDATION.BLOCK.DESIGNATED_SCRIPT")
		.notEmpty()
		.trim(),
];

exports.updateShoot = [
	query("shootId", "VALIDATION.BLOCK.SHOOT_ID").notEmpty(),
	...this.addShoot,
];

exports.getBlock = [query("project_id", "VALIDATION.PROJECT.ID").notEmpty()];
