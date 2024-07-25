const express = require("express");
const memberController =
	new (require("../../../controllers/member.controller"))();
const { isValidToken } = require("../../../middleware/authentication");
const memberValidation = require("../../../middleware/validators/member.validator");

const router = express.Router();

router.post(
	"/add",
	memberValidation.addMember,
	isValidToken,
	memberController.addMember
);

router.put(
	"/edit",
	memberValidation.addMember,
	isValidToken,
	memberController.editMember
);

module.exports = router;
