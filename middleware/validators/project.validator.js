const { body, query } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
];

exports.addProject = [
	body("title", "VALIDATION.PROJECT.TITLE").trim().notEmpty(),
	body("type", "VALIDATION.PROJECT.TYPE").trim().notEmpty(),
	body("total_episodes", "VALIDATION.PROJECT.TOTAL_EPISODES").optional(),
	body("total_blocks", "VALIDATION.PROJECT.TOTAL_BLOCKS").optional(),
];
