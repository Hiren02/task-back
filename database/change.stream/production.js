const ProductionSchema = require("../schemas/production.schema");
const ProjectMembersSchema = require("../schemas/projectMembers.schema");

ProductionSchema.watch([], { fullDocument: "updateLookup" }).on(
	"change",
	async (value) => {
		try {
			const {
				fullDocument: { _id, members },
			} = value;

			if (!members.length) return;

			await ProjectMembersSchema.updateOne(
				{ _id: _id },
				{
					$addToSet: {
						members: members?.map((member) => member.user),
					},
				}
			);
		} catch (error) {
			console.log("🚀 ~ error:", error);
		}
	}
);
