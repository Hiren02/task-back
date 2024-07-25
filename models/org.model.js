const { OrganizationSchema } = require("../database/schemas");

module.exports = class {
	createOrg(name) {
		return OrganizationSchema.create(name);
	}

	findOrgByName(name) {
		return OrganizationSchema.findOne({ name });
	}

	findOrgById(id) {
		return OrganizationSchema.findOne({ _id: id });
	}

	findAll() {
		return OrganizationSchema.find();
	}

	getAllOrganization(skip, limit) {
		return OrganizationSchema.aggregate([
			{
				$facet: {
					data: [{ $skip: skip }, { $limit: limit }],
					totalCount: [
						{
							$count: "count",
						},
					],
				},
			},
			{ $unwind: "$totalCount" },
		]);
	}
};
