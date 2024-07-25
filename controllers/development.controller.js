const developmentModel = new (require("../models/development.model"))();
const authModel = new (require("../models/auth.model"))();
const episodeModel = new (require("../models/episode.model"))();
const { USER_SUB_ROLES } = require("../utils/constant");
const { inviteInWebsiteMail } = require("../utils/emailHelper");
const { calculateEndDateByWeeks } = require("../utils/helpers");

module.exports = class {
	async addDeck(req, res) {
		try {
			const { id } = req.query;
			const findDevelopmentOfProject =
				await developmentModel.findDevelopment(id);
			if (!findDevelopmentOfProject) return res.handler.notFound();

			const createdDeck = await developmentModel.createDeck(
				findDevelopmentOfProject?._id,
				req.body
			);

			return res.handler.success(createdDeck, "STATUS.SUCCESS");
		} catch (error) {
			if (error.customError) {
				return res.handler.badRequest(error.message);
			}
			return res.handler.serverError(error.message);
		}
	}

	async updateDeck(req, res) {
		try {
			const { project_id } = req.query;
			const findDevelopmentOfProject =
				await developmentModel.findDevelopment(project_id);

			if (!findDevelopmentOfProject) return res.handler.notFound();

			const updatedDeck = await developmentModel.updateDeck(
				findDevelopmentOfProject?._id,
				req.body
			);
			return res.handler.success(updatedDeck, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getDecks(req, res) {
		try {
			const { project_id } = req.query;
			const getDecks = await developmentModel.getDecks(project_id);
			return res.handler.success(getDecks, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async deleteDeck(req, res) {
		try {
			const { project_id, id } = req.query;
			const getDeckDetails = await developmentModel.getDeckById(
				project_id,
				id
			);

			if (!getDeckDetails) return res.handler.notFound();

			await developmentModel.deleteDeck(project_id, id);
			return res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async addMember(req, res) {
		try {
			const { start_date, weeks, email } = req.body;

			const user = await authModel.getOrCreateUser(req.body);

			if (req.body.sub_role === USER_SUB_ROLES.Director) {
				await episodeModel.updateManyEpisodes(req.body.episodes, {
					user: user._id,
				});
			}
			const { project_id } = req.query;
			req.body.end_date = calculateEndDateByWeeks(start_date, weeks);
			req.body.user = user?._id;
			const addedMember = await developmentModel.addMember(
				project_id,
				req.body
			);

			inviteInWebsiteMail(email);

			return res.handler.success(addedMember, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateMember(req, res) {
		try {
			let { id, project_id } = req.query;
			const { start_date, weeks, email } = req.body;

			const findDevelopmentOfProject =
				await developmentModel.findDevelopment(project_id);

			if (!findDevelopmentOfProject) return res.handler.notFound();

			const user = await authModel.getOrCreateUser(req.body);

			if (req.body.sub_role === USER_SUB_ROLES.Director) {
				await episodeModel.updateManyEpisodes(req.body.episodes, {
					user: user._id,
				});
			} else {
				await episodeModel.updateManyEpisodes(req.body.episodes, {
					user: null,
				});
			}

			req.body.end_date = calculateEndDateByWeeks(start_date, weeks);
			req.body.user = user?._id;
			const updatedMember = await developmentModel.updateMember(
				project_id,
				id,
				req.body
			);
			return res.handler.success(updatedMember, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getDevelopmentDetails(req, res) {
		try {
			let { id } = req.query;

			const development =
				await developmentModel.getDevelopmentDetailsById(id);
			return res.handler.success(
				development?.[0] || [],
				"STATUS.SUCCESS"
			);
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateDevelopmentDetails(req, res) {
		try {
			let { id } = req.query;

			const findDevelopmentOfProject =
				await developmentModel.findDevelopment(id);

			if (!findDevelopmentOfProject) return res.handler.notFound();
			const development = await developmentModel.updateDevelopmentDetails(
				id,
				req.body
			);
			return res.handler.success(development, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}
};
