const { body, query } = require("express-validator");

exports.addDeck = [
	query("id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
	body("deck_creation.start_date", "VALIDATION.DECK.START_DATE")
		.toDate()
		.notEmpty(),
	body("deck_creation.end_date", "VALIDATION.DECK.END_DATE")
		.toDate()
		.notEmpty(),
	body("deck_finishing.start_date", "VALIDATION.DECK.START_DATE")
		.toDate()
		.notEmpty(),
	body("deck_finishing.end_date", "VALIDATION.DECK.END_DATE")
		.toDate()
		.notEmpty(),
	body("deck_creation_version", "VALIDATION.DECK.DECK_CREATION_VERSION")
		.trim()
		.notEmpty(),
	body(
		"deck_creation_version_date",
		"VALIDATION.DECK.DECK_CREATION_VERSION_DATE"
	)
		.toDate()
		.notEmpty(),
	body("lock_deck", "VALIDATION.DECK.LOCK_DECK").toDate().notEmpty(),
];

exports.updateDeck = [
	query("project_id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
	query("id", "VALIDATION.DECK.ID").trim().notEmpty(),
	body("deck_creation.start_date", "VALIDATION.DECK.START_DATE")
		.toDate()
		.optional(),
	body("deck_creation.end_date", "VALIDATION.DECK.END_DATE")
		.toDate()
		.optional(),
	body("deck_finishing.start_date", "VALIDATION.DECK.START_DATE")
		.toDate()
		.optional(),
	body("deck_finishing.end_date", "VALIDATION.DECK.END_DATE")
		.toDate()
		.optional(),
	body("deck_creation_version", "VALIDATION.DECK.DECK_CREATION_VERSION")
		.trim()
		.notEmpty(),
	body("deck_creation_version_date", "VALIDATION.DECK.DECK_CREATION_VERSION")
		.toDate()
		.optional(),
	body("lock_deck", "VALIDATION.DECK.LOCK_DECK").toDate().optional(),
];

exports.getDecks = [
	query("project_id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
];

exports.deleteDeck = [
	query("project_id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
	query("id", "VALIDATION.DECK.ID").trim().notEmpty(),
];

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

exports.getDevelopmentDetails = [
	query("id", "VALIDATION.DEVELOPMENT.ID").trim().notEmpty().isMongoId(),
];

exports.updateDevelopmentDetails = [
	query("id", "VALIDATION.DEVELOPMENT.ID").trim().notEmpty().isMongoId(),
	body("development_weeks").isNumeric().notEmpty(),
];
