const express = require("express");

const router = express.Router();
const developmentRoute = require("./development.route");
const preProductionRoute = require("./preProduction.route");
const projectRoute = require("./project.route");
const memberRoute = require("./member.route");
const episodeRoute = require("./episode.route");
const blockRoute = require("./block.route");
const productionRoute = require("./production.route");
const postProductionRoute = require("./postProduction.route");

router.use("/", projectRoute);
router.use("/development", developmentRoute);
router.use("/pre-production", preProductionRoute);
router.use("/member", memberRoute);
router.use("/episode", episodeRoute);
router.use("/block", blockRoute);
router.use("/production", productionRoute);
router.use("/post-production", postProductionRoute);

module.exports = router;
