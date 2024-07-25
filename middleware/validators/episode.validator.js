const { body, query } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.PROJECT.ID").trim().notEmpty(),
];

exports.addEpisode = [
	query("project_id", "VALIDATION.PROJECT.ID").notEmpty(),
	body("episodes.*.name", "VALIDATION.EPISODE.NAME").trim().notEmpty(),
	body("episodes.*.title", "VALIDATION.EPISODE.TITLE").trim().notEmpty(),
	body("episodes.*.weeks", "VALIDATION.EPISODE.WEEKS").isNumeric().notEmpty(),
];

exports.updateEpisode = [
	query("id", "VALIDATION.EPISODE.ID").notEmpty(),
	body("name", "VALIDATION.EPISODE.NAME").trim().notEmpty(),
	body("title", "VALIDATION.EPISODE.TITLE").trim().notEmpty(),
	body("weeks", "VALIDATION.EPISODE.WEEKS").isNumeric().notEmpty(),
];

exports.addEpisodeDetails = [
	query("id", "VALIDATION.EPISODE.ID").notEmpty(),
	body("version_name", "VALIDATION.EPISODE.VERSION_NAME").trim().notEmpty(),
	body("version_no", "VALIDATION.EPISODE.VERSION_NO").trim().notEmpty(),
	body("page", "VALIDATION.EPISODE.PAGE")
		.isNumeric()
		.withMessage("VALIDATION.EPISODE.PAGE_MUST_NUMBER")
		.notEmpty(),
	body("color", "VALIDATION.EPISODE.COLOR").trim().notEmpty(),
	body("version_date", "VALIDATION.EPISODE.VERSION_DATE").toDate().notEmpty(),
	body("naming_convention", "VALIDATION.EPISODE.NAMING_CONVENTION")
		.trim()
		.notEmpty(),
];

exports.getEpisodes = [query("project_id", "VALIDATION.PROJECT.ID").notEmpty()];

exports.updateEpisodeDetails = [
	query("detail_id", "VALIDATION.EPISODE.DETAIL_ID").trim().notEmpty(),
	...this.addEpisodeDetails,
];

exports.deleteEpisode = [query("id", "VALIDATION.EPISODE.ID").notEmpty()];

exports.deleteEpisodeDetails = [
	query("detail_id", "VALIDATION.EPISODE.DETAIL_ID").trim().notEmpty(),
	query("id", "VALIDATION.EPISODE.ID").trim().notEmpty(),
];

exports.getEpisodeScript = [
	body("ids", "VALIDATION.EPISODE.IDS")
		.isArray()
		.toArray()
		.notEmpty()
		.withMessage("VALIDATION.EPISODE.IDS")
		.custom((value) => {
			if (!value.length) throw new Error("VALIDATION.EPISODE.IDS");
			return true;
		}),
];
