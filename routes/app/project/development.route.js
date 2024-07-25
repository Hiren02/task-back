const express = require("express");
const developmentController =
	new (require("../../../controllers/development.controller"))();
const { isValidToken } = require("../../../middleware/authentication");
const developmentValidator = require("../../../middleware/validators/development.validator");
const router = express.Router();

router
	.route("/deck")
	.post(isValidToken, developmentController.addDeck)
	.put(isValidToken, developmentController.updateDeck)

	.get(
		developmentValidator.getDecks,
		isValidToken,
		developmentController.getDecks
	)
	.delete(
		developmentValidator.deleteDeck,
		isValidToken,
		developmentController.deleteDeck
	);

router
	.route("/member")
	.post(
		developmentValidator.addMember,
		isValidToken,
		developmentController.addMember
	)
	.put(
		developmentValidator.updateMember,
		isValidToken,
		developmentController.updateMember
	);

router
	.route("/")
	.get(
		developmentValidator.getDevelopmentDetails,
		isValidToken,
		developmentController.getDevelopmentDetails
	)
	.put(
		developmentValidator.updateDevelopmentDetails,
		isValidToken,
		developmentController.updateDevelopmentDetails
	);

module.exports = router;
