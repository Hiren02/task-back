const { query } = require("express-validator");

exports.queryIdRequiredValidation = [
	query("id", "VALIDATION.PRE_PRODUCTION.ID").trim().notEmpty(),
];
