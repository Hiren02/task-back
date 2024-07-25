const express = require("express");
const episodeController =
	new (require("../../../controllers/episodes.controller"))();
const { isValidToken } = require("../../../middleware/authentication");
const episodeValidation = require("../../../middleware/validators/episode.validator");

const router = express.Router();

router
	.route("/")
	.post(
		episodeValidation.addEpisode,
		isValidToken,
		episodeController.addEpisode
	)
	.get(
		episodeValidation.getEpisodes,
		isValidToken,
		episodeController.getEpisode
	)
	.delete(
		episodeValidation.deleteEpisode,
		isValidToken,
		episodeController.deleteEpisode
	);

router
	.route("/details")
	.post(
		episodeValidation.addEpisodeDetails,
		isValidToken,
		episodeController.addEpisodeDetails
	)
	.put(
		episodeValidation.updateEpisodeDetails,
		isValidToken,
		episodeController.updateEpisodeDetails
	)
	.delete(
		episodeValidation.deleteEpisodeDetails,
		isValidToken,
		episodeController.deleteEpisodeDetails
	)
	.get(
		episodeValidation.queryIdRequiredValidation,
		isValidToken,
		episodeController.getEpisodeDetails
	);

router
	.route("/get-episode-script")
	.post(
		episodeValidation.getEpisodeScript,
		isValidToken,
		episodeController.getEpisodeScriptList
	);

module.exports = router;
