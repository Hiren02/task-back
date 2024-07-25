const express = require("express");
const ProductionController =
	new (require("../../../controllers/production.controller"))();
const ProductionValidator = require("../../../middleware/validators/production.validator");
const MemberValidator = require("../../../middleware/validators/member.validator");
const router = express.Router();

const { isValidToken } = require("../../../middleware/authentication");

router
	.route("/")
	.get(
		ProductionValidator.queryIdRequiredValidation,
		isValidToken,
		ProductionController.get
	);

router
	.route("/member")
	.post(
		MemberValidator.addMember,
		isValidToken,
		ProductionController.addMember
	)
	.put(
		MemberValidator.updateMember,
		isValidToken,
		ProductionController.updateMember
	);

module.exports = router;
