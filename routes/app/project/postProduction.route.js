const express = require("express");
const PostProductionController =
	new (require("../../../controllers/postProduction.controller"))();
const PostProductionValidator = require("../../../middleware/validators/postProduction.validator");
const MemberValidator = require("../../../middleware/validators/member.validator");
const router = express.Router();

const { isValidToken } = require("../../../middleware/authentication");

router.route("/").get(isValidToken, PostProductionController.getPostProduction);

router
	.route("/offline")
	.get(isValidToken, PostProductionController.getOfflineDetails)
	.post(
		PostProductionValidator.createOffline,
		isValidToken,
		PostProductionController.createOffline
	)
	.put(
		PostProductionValidator.updateOffline,
		isValidToken,
		PostProductionController.updateOffline
	);

router
	.route("/online")
	.post(
		PostProductionValidator.createOnline,
		isValidToken,
		PostProductionController.createOnline
	)
	.put(
		PostProductionValidator.updateOnline,
		isValidToken,
		PostProductionController.updateOnline
	);

router
	.route("/member")
	.post(
		MemberValidator.addMember,
		isValidToken,
		PostProductionController.addMember
	)
	.put(
		MemberValidator.updateMember,
		isValidToken,
		PostProductionController.updateMember
	);

module.exports = router;
