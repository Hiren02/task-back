const { ProductionStageSchema } = require("../database/schemas");

module.exports = class {
	createProductionStage(data) {
		return ProductionStageSchema.create(data);
	}

	deleteProductionStage(project) {
		return ProductionStageSchema.deleteOne({ project });
	}

	findProductionById(id) {
		return ProductionStageSchema.findById(id);
	}

	findProductionDocument(id) {
		return ProductionStageSchema.aggregate([
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
						_id: 1,
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
		return ProductionStageSchema.findByIdAndUpdate(
			{ _id: id },
			{
				$push: {
					members: data,
				},
			}
		);
	}

	updateMember(project_id, member_id, data) {
		return ProductionStageSchema.updateOne(
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
};
