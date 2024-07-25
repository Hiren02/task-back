const { BlocksSchema } = require("../database/schemas");

module.exports = class {
	createBlock(data) {
		return BlocksSchema.create(data);
	}

	findBlockById(_id) {
		return BlocksSchema.findOne({ _id });
	}

	getBlocks(condition) {
		return BlocksSchema.findOne(condition);
	}

	addBlockDetail(id, data) {
		return BlocksSchema.updateOne(
			{ _id: id },
			{ $push: { block_details: data } }
		);
	}

	updateBlockDetail(id, detail_id, data) {
		return BlocksSchema.updateOne(
			{
				_id: id,
				"block_details._id": detail_id,
			},
			{
				$set: {
					"block_details.$.block_number": data.block_number,
					"block_details.$.title": data.title,
					"block_details.$.trt": data.trt,
					"block_details.$.episodes": data.episodes,
				},
			}
		);
	}

	addShootDetail(id, data) {
		return BlocksSchema.updateOne(
			{ _id: id },
			{ $push: { "block_details.$[].shooting": data } }
		);
	}

	getShootDetailByEpisode(episodeId) {
		return BlocksSchema.aggregate([
			{
				$unwind: "$block_details",
			},
			{
				$unwind: "$block_details.episodes",
			},
			{
				$match: {
					"block_details.episodes._id": new mongoose.Types.ObjectId(
						episodeId
					),
				},
			},
			{
				$project: {
					_id: 1,
					shooting: "$block_details.shooting",
					episode: "$block_details.episodes",
				},
			},
		]);
	}

	updateSceneTracker(blockId, id, data) {
		return BlocksSchema.updateOne(
			{
				_id: new mongoose.Types.ObjectId(blockId),
				"block_details.shooting._id": new mongoose.Types.ObjectId(id),
			},
			{
				$set: {
					"block_details.$[].shooting.$[inner].circle_take":
						data?.circle_take,
					"block_details.$[].shooting.$[inner].vfx": data?.vfx,
					"block_details.$[].shooting.$[inner].scene_cut":
						data?.scene_cut,
				},
			},
			{
				arrayFilters: [
					{
						"inner._id": new mongoose.Types.ObjectId(id),
					},
				],
			}
		);
	}

	updateShootDetail(project_id, detail_id, shoot_id, data) {
		return BlocksSchema.updateOne(
			{
				_id: project_id,
				"block_details._id": detail_id,
				"block_details.shooting._id": shoot_id,
			},
			{
				$set: {
					"block_details.$[outer].shooting.$[inner].location":
						data.location,
					"block_details.$[outer].shooting.$[inner].activity":
						data.activity,
					"block_details.$[outer].shooting.$[inner].start_date":
						data.start_date,
					"block_details.$[outer].shooting.$[inner].end_date":
						data.end_date,
					"block_details.$[outer].shooting.$[inner].no_of_days":
						data.no_of_days,
					"block_details.$[outer].shooting.$[inner].scene_selection":
						data.scene_selection,
					"block_details.$[outer].shooting.$[inner].designated_script":
						data.designated_script,
				},
			},
			{
				arrayFilters: [
					{ "outer._id": detail_id },
					{ "inner._id": shoot_id },
				],
			}
		);
	}
};
