const express = require("express");
const OrgController = new (require("../../controllers/org.controller"))();
const { isValidToken, superAdmin } = require("../../middleware/authentication");

const router = express.Router();

router.get("/get-list", superAdmin, OrgController.getOrganizationList);

module.exports = router;
