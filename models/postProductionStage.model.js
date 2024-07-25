const { default: mongoose } = require("mongoose");
const {
	EpisodesSchema,
	PostProductionStageSchema,
} = require("../database/schemas");

module.exports = class {
	createPostProductionStage(data) {
		return PostProductionStageSchema.create(data);
	}

	findPostProductionById(id) {
		return PostProductionStageSchema.findById(id);
	}

	findPostProductionByMember(id, userId) {
		return PostProductionStageSchema.aggregate([
			{
				$match: {
					_id: id,
					"members.user": userId,
				},
			},
		]);
	}

	getPostProductionDetails(id) {
		return PostProductionStageSchema.aggregate([
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
						offline: 1,
						online: 1,
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

	createOffline(id, data) {
		return PostProductionStageSchema.findByIdAndUpdate(id, {
			$push: {
				offline: data,
			},
		});
	}

	updateOffline(id, projectId, data) {
		return PostProductionStageSchema.updateOne(
			{
				_id: projectId,
				"offline._id": id,
			},
			{
				$set: data,
			}
		);
	}

	createOnline(id, data) {
		return PostProductionStageSchema.findByIdAndUpdate(id, {
			$push: {
				online: data,
			},
		});
	}

	updateOnline(id, projectId, data) {
		return PostProductionStageSchema.updateOne(
			{
				_id: projectId,
				"online._id": id,
			},
			{
				$set: data,
			}
		);
	}

	getOfflineDetails(projectId) {
		return EpisodesSchema.aggregate([
			{
				$match: {
					project: new mongoose.Types.ObjectId(projectId),
				},
			},
			{
				$lookup: {
					from: "blocks",
					let: { episodeId: "$_id" },
					pipeline: [
						{ $unwind: "$block_details" },
						{ $unwind: "$block_details.shooting" },
						{
							$match: {
								$expr: {
									$eq: [
										"$block_details.shooting.episode._id",
										"$$episodeId",
									],
								},
							},
						},
						{
							$group: {
								_id: "$block_details.shooting.episode",
								shoot_start_date: {
									$min: "$block_details.shooting.start_date",
								},
								shoot_end_date: {
									$max: "$block_details.shooting.end_date",
								},
								total_no_of_days: {
									$sum: "$block_details.shooting.no_of_days",
								},
								shootingDetails: {
									$push: "$block_details.shooting",
								},
							},
						},
					],
					as: "shootingDetails",
				},
			},
			{
				$addFields: {
					shoot_start_date: {
						$arrayElemAt: ["$shootingDetails.shoot_start_date", 0],
					},
					shoot_end_date: {
						$arrayElemAt: ["$shootingDetails.shoot_end_date", 0],
					},
					total_no_of_days: {
						$arrayElemAt: ["$shootingDetails.total_no_of_days", 0],
					},
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "user",
					foreignField: "_id",
					as: "userDetail",
				},
			},
			{
				$unwind: {
					path: "$userDetail",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$project: {
					name: 1,
					title: 1,
					weeks: 1,
					trt: 1,
					start_date: 1,
					project: 1,
					shoot_start_date: 1,
					shoot_end_date: 1,
					total_no_of_days: 1,
					"userDetail.first_name": 1,
					"userDetail.last_name": 1,
				},
			},
		]);
	}

	addMember(id, data) {
		return PostProductionStageSchema.findByIdAndUpdate(
			{ _id: id },
			{
				$push: {
					members: data,
				},
			}
		);
	}

	updateMember(project_id, member_id, data) {
		return PostProductionStageSchema.updateOne(
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
