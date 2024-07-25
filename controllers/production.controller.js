const ProductionModel = new (require("../models/productionStage.model"))();
const authModel = new (require("../models/auth.model"))();
const episodeModel = new (require("../models/episode.model"))();
const { USER_SUB_ROLES } = require("../utils/constant");
const { inviteInWebsiteMail } = require("../utils/emailHelper");
const { calculateEndDateByWeeks } = require("../utils/helpers");

class PreProduction {
	async get(req, res) {
		try {
			const { query } = req;
			let findDetails = await ProductionModel.findProductionDocument(
				query?.id
			);
			if (!findDetails)
				return res.handler.notFound("PRE_PRODUCTION_STAGE.NOT_FOUND");
			res.handler.success(findDetails?.[0] || {}, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async addMember(req, res) {
		try {
			const { start_date, weeks, email } = req.body;
			const { project_id } = req.query;

			const user = await authModel.getOrCreateUser(req.body);

			if (req.body.sub_role === USER_SUB_ROLES.Director) {
				await episodeModel.updateManyEpisodes(req.body.episodes, {
					user: user._id,
				});
			}

			req.body.end_date = calculateEndDateByWeeks(start_date, weeks);
			req.body.user = user?._id;
			const addedMember = await ProductionModel.addMember(
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
			const { start_date, weeks } = req.body;

			const findDevelopmentOfProject =
				await ProductionModel.findProductionById(project_id);

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
			const updatedMember = await ProductionModel.updateMember(
				project_id,
				id,
				req.body
			);
			return res.handler.success(updatedMember, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}
}

module.exports = PreProduction;
