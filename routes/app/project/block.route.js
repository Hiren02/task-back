const express = require("express");
const blockController =
	new (require("../../../controllers/block.controller"))();
const { isValidToken } = require("../../../middleware/authentication");
const blockValidation = require("../../../middleware/validators/block.validator");

const router = express.Router();

router
	.route("/")
	.post(blockValidation.addBlock, isValidToken, blockController.addBlock)
	.get(blockValidation.getBlock, isValidToken, blockController.getBlock)
	.put(
		blockValidation.updateBlock,
		isValidToken,
		blockController.updateBlock
	);

router
	.route("/shoot")
	.post(blockValidation.addShoot, isValidToken, blockController.addShoot)
	.put(
		blockValidation.updateShoot,
		isValidToken,
		blockController.updateShoot
	);
router
	.route("/scene-tracker")
	.get(isValidToken, blockController.getSceneTracker)
	.post(isValidToken, blockController.addUpdateSceneTracker);
module.exports = router;
