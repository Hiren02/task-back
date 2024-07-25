const { ProjectMembersSchema, ProjectsSchema } = require("../database/schemas");

class ProjectMembersModel {
	createProjectMembers(data) {
		return ProjectMembersSchema.create(data);
	}

	updateProjectMembers(_id, data) {
		return ProjectMembersSchema.updateOne(
			{ _id },
			{ $set: { members: data } }
		);
	}

	getProjectList(userId) {
		return ProjectMembersSchema.aggregate([
			{
				$match: {
					members: userId,
				},
			},
			{
				$lookup: {
					from: "projects",
					localField: "_id",
					foreignField: "_id",
					as: "data",
				},
			},
			{ $unwind: "$data" },
		]);
	}

	getAllProjectDetails(id) {
		return ProjectsSchema.aggregate([
			[
				{
					$match: {
						_id: new mongoose.Types.ObjectId(id),
					},
				},
				{
					$lookup: {
						from: "developments",
						localField: "_id",
						foreignField: "_id",
						as: "developments",
					},
				},
				{ $unwind: "$developments" },
				{
					$lookup: {
						from: "pre_productions",
						localField: "_id",
						foreignField: "_id",
						as: "preProductions",
					},
				},
				{ $unwind: "$preProductions" },
				{
					$lookup: {
						from: "post_productions",
						localField: "_id",
						foreignField: "_id",
						as: "postProductions",
					},
				},
				{ $unwind: "$postProductions" },
				{
					$lookup: {
						from: "episodes",
						localField: "_id",
						foreignField: "project",
						as: "episodes",
					},
				},
				{
					$project: {
						_id: 1,
						"developments.decks": 1,
						"preProductions._id": 1,
						"preProductions.preparation_weeks": 1,
						"preProductions.rooms": 1,
						"preProductions.project_green_light": 1,
						"preProductions.production_kick_off": 1,
						"preProductions.pre_studio_show_and_tell": 1,
						"preProductions.studio_show_and_tell": 1,
						"preProductions.pre_studio_network_show_and_tell": 1,
						"preProductions.studio_network_show_and_tell": 1,
						"preProductions.camera_hair_wardrobe_test": 1,
						"preProductions.cast_read_through": 1,
						"preProductions.cast_dinner": 1,
						"postProductions._id": 1,
						"postProductions.offline": 1,
						"postProductions.online": 1,
						"episodes.title": 1,
						"episodes.name": 1,
						"episodes._id": 1,
						"episodes.start_date": 1,
						"episodes.end_date": 1,
						"episodes.details": 1,
					},
				},
			],
		]);
	}
}

module.exports = ProjectMembersModel;
