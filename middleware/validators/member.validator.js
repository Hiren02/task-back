const { body, query } = require("express-validator");

exports.addMember = [
	query("project_id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
	body("start_date", "VALIDATION.MEMBER.START_DATE").toDate().notEmpty(),
	body("sub_role", "VALIDATION.MEMBER.SUB_ROLE").trim().notEmpty(),
	body("weeks", "VALIDATION.MEMBER.WEEKS").isNumeric().notEmpty(),
	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.USER.EMAIL_NOT_VALID"),
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().notEmpty(),
	body("last_name", "VALIDATION.USER.LAST_NAME").trim().notEmpty(),
	body("episodes.*._id", "VALIDATION.EPISODE.ID").trim().notEmpty(),
	body("episodes.*.name", "VALIDATION.EPISODE.NAME").trim().notEmpty(),
];

exports.updateMember = [
	...this.addMember,
	query("id", "VALIDATION.MEMBER.ID").trim().notEmpty().isMongoId(),
];
