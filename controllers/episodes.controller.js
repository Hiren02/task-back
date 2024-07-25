const { formateDate, calculateEndDateByWeeks } = require("../utils/helpers");

const episodeModel = new (require("../models/episode.model"))();
const projectModel = new (require("../models/project.model"))();

module.exports = class {
	async addEpisode(req, res) {
		try {
			const { project_id } = req.query;
			let { episodes } = req.body;

			const project = await projectModel.findOneProject(project_id);
			if (!project)
				return res.handler.notFound("VALIDATION.PROJECT.NOT_FOUND");

			const episodePromises = episodes.map((episode) => {
				if (episode?.start_date) {
					episode.start_date = formateDate(episode?.start_date);
					episode.end_date = calculateEndDateByWeeks(
						episode?.start_date,
						episode?.weeks
					);
				}
				if (episode?._id) {
					return episodeModel.updateEpisode(
						{ _id: episode._id },
						{
							name: episode?.name,
							title: episode?.title,
							trt: episode?.trt,
							weeks: episode?.weeks,
							start_date: episode?.start_date,
							end_date: episode?.end_date,
						}
					);
				} else {
					return episodeModel.createEpisode({
						...episode,
						project: project_id,
					});
				}
			});

			await Promise.all(episodePromises);

			return res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			if (error.customError) {
				return res.handler.badRequest(error.message);
			}
			return res.handler.serverError(error.message);
		}
	}

	async getEpisode(req, res) {
		try {
			const { project_id } = req.query;

			const episodeData = await episodeModel.findEpisode({
				project: project_id,
			});

			res.handler.success(episodeData, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async addEpisodeDetails(req, res) {
		try {
			const { id } = req.query;
			let findEpisode = await episodeModel.findEpisodeById(id);
			if (!findEpisode) return res.handler.notFound();

			let addDetails = await episodeModel.addEpisodeDetails(id, req.body);

			res.handler.success(addDetails, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async deleteEpisode(req, res) {
		try {
			const { id } = req.query;
			let findEpisode = await episodeModel.findEpisodeById(id);
			if (!findEpisode) return res.handler.notFound();

			await episodeModel.deleteEpisode(id);
			res.handler.success();
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateEpisodeDetails(req, res) {
		try {
			const { id, detail_id } = req.query;
			let findEpisode = await episodeModel.findEpisodeById(id);
			if (!findEpisode) return res.handler.notFound();

			let updateDetails = await episodeModel.updateEpisodeDetails(
				id,
				detail_id,
				req.body
			);
			res.handler.success(updateDetails, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async deleteEpisodeDetails(req, res) {
		try {
			const { id, detail_id } = req.query;
			let findEpisode = await episodeModel.findEpisodeById(id);
			if (!findEpisode) return res.handler.notFound();

			await episodeModel.deleteEpisodeDetails(id, detail_id);
			res.handler.success();
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getEpisodeDetails(req, res) {
		try {
			const { id } = req.query;
			const episodeDetails = await episodeModel.getEpisodeDetails(id);

			res.handler.success(episodeDetails, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getEpisodeScriptList(req, res) {
		try {
			const { ids } = req.body;
			const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

			const episodes = await episodeModel.getEpisodeScriptList(objectIds);

			res.handler.success(episodes, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}
};
