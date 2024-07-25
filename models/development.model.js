const { DevelopmentStageSchema } = require("../database/schemas");
const mongoose = require("mongoose");

module.exports = class {
	createDevelopmentStage(data) {
		return DevelopmentStageSchema.create(data);
	}

	updateDevelopmentStage(conditions, updateData) {
		return DevelopmentStageSchema.findOneAndUpdate(conditions, updateData, {
			new: true,
		});
	}

	getDevelopmentStageData(payload) {
		return DevelopmentStageSchema.findOne(payload);
		// return DevelopmentStageSchema.aggregate([
		// 	{
		// 		$match: {
		// 			_id: new mongoose.Types.ObjectId(_id),
		// 		},
		// 	},
		// 	// {
		// 	// 	$lookup: {
		// 	// 		from: "developmentstages",
		// 	// 		localField: "_id",
		// 	// 		foreignField: "project",
		// 	// 		as: "developmentStageData",
		// 	// 		// pipeline: [
		// 	// 		// 	{
		// 	// 		// 		$project: {
		// 	// 		// 			members: 0,
		// 	// 		// 		},
		// 	// 		// 	},
		// 	// 		// 	{
		// 	// 		// 		$lookup: {
		// 	// 		// 			from: "members",
		// 	// 		// 			localField: "developmentstages.members",
		// 	// 		// 			foreignField: "members._id",
		// 	// 		// 			as: "membersData",
		// 	// 		// 		},
		// 	// 		// 	},
		// 	// 		// ],
		// 	// 	},
		// 	// },

		// 	// {
		// 	// 	$lookup: {
		// 	// 		from: "decks",
		// 	// 		localField: "_id",
		// 	// 		foreignField: "project",
		// 	// 		as: "deckData",
		// 	// 	},
		// 	// },
		// 	{
		// 		$unwind: "$developmentStageData",
		// 	},
		// ]).exec();
	}

	deleteDevelopmentStage(project) {
		return DevelopmentStageSchema.deleteOne({ project });
	}

	findDevelopment(id) {
		return DevelopmentStageSchema.findById(id);
	}

	createDeck(id, data) {
		return DevelopmentStageSchema.findByIdAndUpdate(id, {
			$push: {
				decks: data,
			},
		});
	}

	updateDeck(project_id, data) {
		const bulkOps = data.map((deck) => ({
			updateOne: {
				filter: { _id: project_id, "decks._id": deck._id },
				update: {
					$set: {
						"decks.$.column": deck.column,
						"decks.$.date": deck.date,
						"decks.$.end_date": deck?.end_date,
						"decks.$.version": deck?.version,
					},
				},
			},
		}));

		return DevelopmentStageSchema.bulkWrite(bulkOps);
	}

	getDecks(id) {
		return DevelopmentStageSchema.findOne(
			{ _id: id },
			{ decks: 1, _id: 0 }
		);
	}

	deleteDeck(project_id, deck_id) {
		return DevelopmentStageSchema.updateOne(
			{ _id: project_id },
			{
				$pull: {
					decks: { _id: deck_id },
				},
			}
		);
	}

	getDeckById(project_id, deck_id) {
		return DevelopmentStageSchema.findOne({
			_id: project_id,
			"decks._id": deck_id,
		});
	}

	addMember(id, data) {
		return DevelopmentStageSchema.findByIdAndUpdate(
			{ _id: id },
			{
				$push: {
					members: data,
				},
			}
		);
	}

	updateMember(project_id, member_id, data) {
		return DevelopmentStageSchema.updateOne(
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

	getDevelopmentDetailsById(id) {
		return DevelopmentStageSchema.aggregate([
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
						decks: 1,
						episodes: 1,
						users: 1,
						development_weeks: 1,
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

	updateDevelopmentDetails(id, body) {
		return DevelopmentStageSchema.updateOne({ _id: id }, body);
	}
};
