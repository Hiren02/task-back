const express = require("express");

const authRoute = require("./auth.route");
const projectRoute = require("./project");
const commonRoute = require("./common.route");
const OrgRoute = require("./org.routes");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/project", projectRoute);
router.use("/common", commonRoute);
router.use("/org", OrgRoute);

module.exports = router;
