const { body } = require("express-validator");

exports.signUp = [
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().notEmpty(),

	body("last_name", "VALIDATION.USER.LAST_NAME").trim().notEmpty(),

	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.USER.EMAIL_NOT_VALID"),

	body("password", "VALIDATION.USER.PASSWORD_REQUIRED")
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.PASSWORD.PASSWORD_VALID_LENGTH")
		.isStrongPassword()
		.withMessage("VALIDATION.PASSWORD.TOO_SIMPLE"),

	body("organization", "VALIDATION.USER.ORG").trim().notEmpty(),

	body("profile_image", "VALIDATION.USER.PROFILE_IMAGE").trim().optional(),
];

exports.login = [
	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.NOT_FOUND.USER"),

	body("password", "VALIDATION.USER.PASSWORD_REQUIRED").trim().notEmpty(),
];

exports.loggedInUser = [body("orgId", "VALIDATION.USER.ORG").trim().notEmpty()];

exports.forgotPassword = [
	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.NOT_FOUND.USER"),
];

exports.resetPassword = [
	body("password", "VALIDATION.USER.PASSWORD_REQUIRED")
		.trim()
		.notEmpty()
		.isLength({ min: 8, max: 16 })
		.withMessage("VALIDATION.PASSWORD.PASSWORD_VALID_LENGTH")
		.isStrongPassword()
		.withMessage("VALIDATION.PASSWORD.TOO_SIMPLE"),
];

exports.inviteAdmin = [
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().notEmpty(),

	body("last_name", "VALIDATION.USER.LAST_NAME").trim().notEmpty(),

	body("phone_number", "VALIDATION.USER.PHONE_NUMBER").trim().notEmpty(),

	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.USER.EMAIL_NOT_VALID"),
];

exports.editAdmin = [
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().optional(),

	body("last_name", "VALIDATION.USER.LAST_NAME").trim().optional(),

	body("phone_number", "VALIDATION.USER.ROLE").trim().optional(),

	body("is_active").trim().optional(),
];

exports.inviteUser = [
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().notEmpty(),

	body("last_name", "VALIDATION.USER.LAST_NAME").trim().notEmpty(),

	// body("subRole", "VALIDATION.USER.ROLE").trim().notEmpty(),

	body("profile_image", "VALIDATION.USER.PROFILE_IMAGE").trim().optional(),

	body("phone_number", "VALIDATION.USER.PHONE_NUMBER").trim().notEmpty(),

	body("email", "VALIDATION.USER.EMAIL_REQUIRED")
		.notEmpty()
		.trim()
		.isEmail()
		.withMessage("VALIDATION.USER.EMAIL_NOT_VALID"),
];

exports.editUser = [
	body("first_name", "VALIDATION.USER.FIRST_NAME").trim().optional(),

	body("last_name", "VALIDATION.USER.LAST_NAME").trim().optional(),

	// body("subRole", "VALIDATION.USER.ROLE").trim().optional(),

	body("phone_number", "VALIDATION.USER.ROLE").trim().optional(),

	body("is_active").trim().optional(),
];
