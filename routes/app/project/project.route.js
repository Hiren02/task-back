const express = require("express");
const projectController =
	new (require("../../../controllers/project.controller"))();
const { isValidToken } = require("../../../middleware/authentication");
const ProjectValidation = require("../../../middleware/validators/project.validator");

const router = express.Router();

router
	.route("/")
	.post(
		ProjectValidation.addProject,
		isValidToken,
		projectController.addProject
	)
	.put(
		ProjectValidation.queryIdRequiredValidation,
		isValidToken,
		projectController.updateProject
	)
	.get(isValidToken, projectController.getProjectList);

router.get(
	"/details",
	ProjectValidation.queryIdRequiredValidation,
	isValidToken,
	projectController.getProjectDetail
);

router.get(
	"/get-permissions",
	ProjectValidation.queryIdRequiredValidation,
	isValidToken,
	projectController.getUserPermissions
);
module.exports = router;
