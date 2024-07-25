const mongoose = require("mongoose");
const { calculateEndDateByWeeks, formateDate } = require("../utils/helpers");
const projectModel = new (require("../models/project.model"))();
const projectMembersModal = new (require("../models/projectMembers.model"))();
const episodeModel = new (require("../models/episode.model"))();
const developmentStageModel = new (require("../models/development.model"))();
const preProductionStageModel =
	new (require("../models/preProductionStage.model"))();
const productionStageModel = new (require("../models/productionStage.model"))();
const postProductionStageModel =
	new (require("../models/postProductionStage.model"))();

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async addProject(req, res) {
		try {
			const { title, type, total_episodes, total_blocks, episodes } =
				req.body;

			const project = await projectModel.createProject({
				title,
				type,
				total_episodes,
				total_blocks,
				created_by: req.user._id,
			});

			if (!project)
				return res.handler.badRequest("STATUS.NOT_VALID_DATA");

			await projectMembersModal.createProjectMembers({
				_id: project._id,
			});

			await developmentStageModel.createDevelopmentStage({
				_id: project._id,
			});

			await productionStageModel.createProductionStage({
				_id: project._id,
			});

			await preProductionStageModel.createPreProductionStage({
				_id: project._id,
			});

			await postProductionStageModel.createPostProductionStage({
				_id: project._id,
				created_by: req.user._id,
			});

			await projectMembersModal.updateProjectMembers(project._id, [
				req.user._id,
			]);

			const episodesDetails = episodes?.map((episode) => {
				if (episode?.start_date) {
					episode.start_date = formateDate(episode?.start_date);
					episode.end_date = calculateEndDateByWeeks(
						episode?.start_date,
						episode?.weeks
					);
				}
				return {
					name: episode?.name,
					title: episode?.title,
					trt: episode?.trt,
					weeks: episode?.weeks,
					start_date: episode?.start_date,
					end_date: episode?.end_date,
					project: project._id,
				};
			});

			if (episodesDetails?.length)
				await episodeModel.insertManyEpisodes(episodesDetails);

			res.handler.success(project, "STATUS.CREATED");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async updateProject(req, res) {
		try {
			const { id } = req.query;
			console.log(req.body);
			const project = await projectModel.updateProject(
				{ _id: new mongoose.Types.ObjectId(id) },
				{ ...req.body.data }
			);
			res.handler.success(project, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getProjectList(req, res) {
		try {
			const userId = req?.user?._id;
			const project = await projectMembersModal.getProjectList(
				new mongoose.Types.ObjectId(userId)
			);

			res.handler.success(project, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getProjectDetail(req, res) {
		try {
			const { id } = req.query;
			const project = await projectModel.findOneProject(id);

			if (!project) return res.handler.notFound();

			res.handler.success(project, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getUserPermissions(req, res) {
		try {
			const { id } = req.query;

			const project = await projectModel.findProjectByUser(
				id,
				req.user._id
			);
			const postProduction =
				await postProductionStageModel.findPostProductionByMember(
					new mongoose.Types.ObjectId(id),
					req.user._id
				);

			let isProjectCreator = false;
			let isPostProductionMember = false;

			if (project) {
				isProjectCreator = true;
			}

			if (postProduction && postProduction.length) {
				isPostProductionMember = true;
			}

			return res.handler.success(
				{
					isProjectCreator: isProjectCreator,
					isPostProductionMember: isPostProductionMember,
				},
				"STATUS.SUCCESS"
			);
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}
};
