const PreProductionModel =
	new (require("../models/preProductionStage.model"))();
const authModel = new (require("../models/auth.model"))();
const episodeModel = new (require("../models/episode.model"))();
const { USER_SUB_ROLES } = require("../utils/constant");
const { inviteInWebsiteMail } = require("../utils/emailHelper");
const {
	calculateEndDateByWeeks,
	populateWeeksDate,
} = require("../utils/helpers");

class PreProduction {
	async update(req, res) {
		try {
			const {
				query: { project_id },
				body,
			} = req;
			let findPreProduction =
				await PreProductionModel.findPreProductionById(project_id);

			if (!findPreProduction)
				return res.handler.notFound("PRE_PRODUCTION_STAGE.NOT_FOUND");

			body.rooms = body?.rooms
				? { ...findPreProduction?.rooms, ...body.rooms }
				: { ...findPreProduction?.rooms };

			if (body?.rooms)
				Object.keys(body?.rooms).forEach((item) => {
					if (body.rooms[item].start_date)
						body.rooms[item].end_date = calculateEndDateByWeeks(
							body.rooms[item].start_date,
							body.rooms[item].weeks
						);
				});

			body.preparation_weeks = body?.preparation_weeks
				? {
						...findPreProduction?.preparation_weeks,
						...body.preparation_weeks,
				  }
				: { ...findPreProduction?.preparation_weeks };

			if (body?.preparation_weeks)
				Object.keys(body?.preparation_weeks).forEach((item) => {
					body.preparation_weeks[item].end_date =
						calculateEndDateByWeeks(
							body.preparation_weeks[item].start_date,
							body.preparation_weeks[item].weeks
						);

					body.preparation_weeks[item].dates = populateWeeksDate(
						body.preparation_weeks[item].start_date,
						body.preparation_weeks[item].weeks
					);
				});

			let details = await PreProductionModel.updatePreProductionStage(
				project_id,
				body
			);
			return res.handler.success(details, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async get(req, res) {
		try {
			const { query } = req;
			let findDetails =
				await PreProductionModel.findPreProductionDocument(query?.id);

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
			const addedMember = await PreProductionModel.addMember(
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
				await PreProductionModel.findPreProductionById(project_id);

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
			const updatedMember = await PreProductionModel.updateMember(
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
