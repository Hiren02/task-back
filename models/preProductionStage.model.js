const { PreProductionStageSchema } = require("../database/schemas");
const {
	Types: { ObjectId },
} = require("mongoose");

class PreProductionModel {
	createPreProductionStage(data) {
		return PreProductionStageSchema.create(data);
	}

	async updatePreProductionStage(_id, data) {
		return await PreProductionStageSchema.updateOne({ _id }, data);
	}

	async deletePreProductionStage(project) {
		return await PreProductionStageSchema.deleteOne({ project });
	}

	findPreProductionById(id) {
		return PreProductionStageSchema.findById(id);
	}

	async findPreProductionDocument(id) {
		return PreProductionStageSchema.aggregate([
			[
				{ $match: { _id: new mongoose.Types.ObjectId(id) } },
				{
					$lookup: {
						from: "users",
						localField: "members.user",
						foreignField: "_id",
						as: "users",
					},
				},
				{
					$project: {
						rooms: 1,
						preparation_weeks: 1,
						project_green_light: 1,
						production_kick_off: 1,
						pre_studio_show_and_tell: 1,
						studio_show_and_tell: 1,
						pre_studio_network_show_and_tell: 1,
						studio_network_show_and_tell: 1,
						camera_hair_wardrobe_test: 1,
						cast_read_through: 1,
						cast_dinner: 1,
						members: {
							$map: {
								input: "$members",
								as: "member",
								in: {
									$mergeObjects: [
										"$$member",
										{
											user: {
												$cond: {
													if: {
														$in: [
															"$$member.user",
															"$users._id",
														],
													},
													then: {
														$first: {
															$filter: {
																input: "$users",
																cond: {
																	$eq: [
																		"$$this._id",
																		"$$member.user",
																	],
																},
															},
														},
													},
													else: {},
												},
											},
										},
									],
								},
							},
						},
					},
				},
			],
		]);
	}

	addMember(id, data) {
		return PreProductionStageSchema.findByIdAndUpdate(
			{ _id: id },
			{
				$push: {
					members: data,
				},
			}
		);
	}

	updateMember(project_id, member_id, data) {
		return PreProductionStageSchema.updateOne(
			{
				_id: project_id,
				"members._id": member_id,
			},
			{
				$set: {
					"members.$.start_date": data.start_date,
					"members.$.end_date": data.end_date,
					"members.$.sub_role": data.sub_role,
					"members.$.weeks": data.weeks,
					"members.$.user": data.user,
					"members.$.episodes": data.episodes,
				},
			}
		);
	}
}

module.exports = PreProductionModel;
