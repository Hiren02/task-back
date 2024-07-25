const express = require("express");
const CommonController = new (require("../../controllers/common.controller"))();
const { isValidToken } = require("../../middleware/authentication");

const router = express.Router();

router.get("/user-role-list", isValidToken, CommonController.getUserRoleList);
router.get(
	"/get-all-projects-details",
	isValidToken,
	CommonController.getAllProjectDetails
);

module.exports = router;
