const express = require("express");
const AuthController = new (require("../../controllers/auth.controller"))();
const {
	publicRoute,
	isValidToken,
	superAdmin,
} = require("../../middleware/authentication");
const authValidation = require("../../middleware/validators/auth.validator");
const upload = require("../../manager/fileManager").upload;
const fileValidator =
	new (require("../../middleware/validators/file.validator"))();

const router = express.Router();

// ---- Create ----`
router.post(
	"/sign-up",
	authValidation.signUp,
	publicRoute,
	AuthController.signUp
);

router.post("/login", authValidation.login, publicRoute, AuthController.login);

router.post(
	"/forgot-password",
	authValidation.forgotPassword,
	publicRoute,
	AuthController.forgotPassword
);

router.post(
	"/reset-password",
	authValidation.resetPassword,
	publicRoute,
	AuthController.resetPassword
);

// ADMIN
router.post(
	"/invite-admin",
	fileValidator.checkprofile_imageType,
	upload().single("profile_image"),
	authValidation.inviteAdmin,
	superAdmin,
	AuthController.inviteAdmin
);

router.put(
	"/edit-admin",
	fileValidator.checkprofile_imageType,
	upload().single("profile_image"),
	authValidation.editAdmin,
	superAdmin,
	AuthController.editAdmin
);

router.delete("/delete-admin", superAdmin, AuthController.deleteAdmin);

router.get("/get-admin-list", superAdmin, AuthController.getAdminList);

// USER
router.post(
	"/invite-user",
	fileValidator.checkprofile_imageType,
	upload().single("profile_image"),
	authValidation.inviteUser,
	isValidToken,
	AuthController.inviteUser
);

router.put(
	"/edit-user",
	fileValidator.checkprofile_imageType,
	upload().single("profile_image"),
	authValidation.editUser,
	isValidToken,
	AuthController.editUser
);

router.delete("/delete-user", isValidToken, AuthController.deleteUser);

router.get("/get-user-list", isValidToken, AuthController.getUserList);

module.exports = router;
