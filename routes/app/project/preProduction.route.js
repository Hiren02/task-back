const express = require("express");
const PreProductionController =
	new (require("../../../controllers/preProduction.controller"))();
const PreProductionValidator = require("../../../middleware/validators/preProduction.validator");
const MemberValidator = require("../../../middleware/validators/member.validator");
const router = express.Router();

const { isValidToken } = require("../../../middleware/authentication");

router
	.route("/")
	.put(
		PreProductionValidator.updatePreProductionStage,
		isValidToken,
		PreProductionController.update
	)
	.get(
		PreProductionValidator.queryIdRequiredValidation,
		isValidToken,
		PreProductionController.get
	);

router
	.route("/member")
	.post(
		MemberValidator.addMember,
		isValidToken,
		PreProductionController.addMember
	).put(
		MemberValidator.updateMember,
		isValidToken,
		PreProductionController.updateMember
	)

module.exports = router;
