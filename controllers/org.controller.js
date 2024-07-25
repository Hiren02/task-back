const orgModel = new (require("../models/org.model"))();

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async getOrganizationList(req, res) {
		try {
			let { page = 1, limit = 200 } = req.query;
			page = Number(page);
			limit = Number(limit);
			const skip = (page - 1) * limit;
			const organizationList = await orgModel.getAllOrganization(
				skip,
				limit
			);

			const { data, totalCount } =
				(organizationList &&
					organizationList?.length &&
					organizationList[0]) ||
				[];

			let hasMore = false;

			if (totalCount?.count >= page * limit) hasMore = true;

			res.handler.success(
				{
					organizationList: data ?? [],
					hasMore,
					totalCount: totalCount?.count ?? 0,
				},
				"STATUS.SUCCESS"
			);
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}
};
