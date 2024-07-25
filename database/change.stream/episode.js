const EpisodesSchema = require("../schemas/episodes.schema");
const DevelopmentSchema = require("../schemas/development.schema");

EpisodesSchema.watch([], { fullDocument: "updateLookup" }).on(
	"change",
	async (value) => {
		try {
			const {
				fullDocument: { project, _id, name },
			} = value;

			await DevelopmentSchema.updateMany(
				{
					_id: project,
				},
				{
					$set: {
						"members.$[].episodes.$[elem].name": name,
					},
				},
				{
					arrayFilters: [{ "elem._id": { $eq: _id } }],
				}
			);
		} catch (error) {
			console.log("🚀 ~ error:", error);
		}
	}
);
