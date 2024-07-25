const blockModel = new (require("../models/block.model"))();
const projectModel = new (require("../models/project.model"))();
const { calculateEndDateByDays, formateDate } = require("../utils/helpers");

module.exports = class {
	async addBlock(req, res) {
		try {
			const { project_id } = req.query;

			const project = await projectModel.findOneProject(project_id);
			if (!project)
				return res.handler.notFound("VALIDATION.PROJECT.NOT_FOUND");

			let isBlockCreated = await blockModel.findBlockById(project_id);

			if (!isBlockCreated) {
				isBlockCreated = await blockModel.createBlock({
					_id: project_id,
				});
			}

			const addedBlock = await blockModel.addBlockDetail(
				project_id,
				req.body
			);

			return res.handler.success(addedBlock, "STATUS.SUCCESS");
		} catch (error) {
			if (error.customError) {
				return res.handler.badRequest(error.message);
			}
			return res.handler.serverError(error.message);
		}
	}

	async getBlock(req, res) {
		try {
			const { project_id } = req.query;

			const blockData = await blockModel.getBlocks({
				_id: project_id,
			});

			res.handler.success(blockData ?? [], "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async updateBlock(req, res) {
		try {
			const { id, project_id } = req.query;
			await blockModel.updateBlockDetail(project_id, id, req.body);
			res.handler.success();
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async getSceneTracker(req, res) {
		try {
			const { episode_id } = req.query;
			if (!episode_id)
				return res.handler.badRequest("VALIDATION.EPISODE.ID");
			const shoot = await blockModel.getShootDetailByEpisode(episode_id);
			res.handler.success(shoot?.[0] || [], "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async addUpdateSceneTracker(req, res) {
		try {
			const { id, blockId } = req.query;
			if (!id || !blockId)
				return res.handler.badRequest("VALIDATION.NOT_FOUND.ID");
			const updateScene = await blockModel.updateSceneTracker(
				blockId,
				id,
				req.body
			);
			res.handler.success(updateScene, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async addShoot(req, res) {
		try {
			const { project_id } = req.query;
			const { no_of_days, start_date, scene_selection } = req.body;

			req.body.end_date = calculateEndDateByDays(start_date, no_of_days);

			const project = await projectModel.findOneProject(project_id);

			if (!project)
				return res.handler.notFound("VALIDATION.PROJECT.NOT_FOUND");

			const sceneArray = scene_selection?.split(",");

			const payload = sceneArray?.map((item) => {
				return { ...req.body, scene_selection: item };
			});

			const addedShoot = await blockModel.addShootDetail(
				project_id,
				payload
			);

			return res.handler.success(addedShoot, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}

	async updateShoot(req, res) {
		try {
			const { id, project_id, shootId } = req.query;
			const { no_of_days, start_date } = req.body;

			req.body.end_date = calculateEndDateByDays(start_date, no_of_days);

			const updatedShoot = await blockModel.updateShootDetail(
				project_id,
				id,
				shootId,
				req.body
			);
			res.handler.success(updatedShoot, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error);
		}
	}
};
