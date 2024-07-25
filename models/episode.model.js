const { EpisodesSchema } = require("../database/schemas");

module.exports = class {
	createEpisode(data) {
		return EpisodesSchema.create(data);
	}

	findEpisodeById(id) {
		return EpisodesSchema.findById(id);
	}

	insertManyEpisodes(data) {
		return EpisodesSchema.insertMany(data);
	}

	findEpisode(condition) {
		return EpisodesSchema.find(condition);
	}

	updateEpisode(conditions, updateData, ...extraArgs) {
		return EpisodesSchema.updateOne(conditions, updateData, ...extraArgs);
	}

	updateManyEpisodes(episodeIds, condition) {
		return EpisodesSchema.updateMany(
			{ _id: { $in: episodeIds } },
			{ $set: condition }
		);
	}

	deleteEpisode(_id) {
		return EpisodesSchema.deleteOne({ _id });
	}

	addEpisodeDetails(id, data) {
		return EpisodesSchema.updateOne(
			{ _id: id },
			{ $push: { details: data } }
		);
	}

	updateEpisodeDetails(id, detail_id, data) {
		return EpisodesSchema.updateOne(
			{
				_id: id,
				"details._id": detail_id,
			},
			{
				$set: {
					"details.$.version_name": data.version_name,
					"details.$.version_no": data.version_no,
					"details.$.page": data.page,
					"details.$.color": data.color,
					"details.$.version_date": data.version_date,
					"details.$.naming_convention": data.naming_convention,
				},
			}
		);
	}

	deleteEpisodeDetails(episode_id, detail_id) {
		return EpisodesSchema.updateOne(
			{ _id: episode_id },
			{
				$pull: {
					details: { _id: detail_id },
				},
			}
		);
	}

	getEpisodeDetails(id) {
		return EpisodesSchema.findOne({ _id: id });
	}

	getEpisodeScriptList(objectIds) {
		return EpisodesSchema.aggregate([
			{ $match: { _id: { $in: objectIds } } },
			{ $project: { details: { naming_convention: 1 } } },
		]);
	}
};
