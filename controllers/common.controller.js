const userModel = new (require("../models/auth.model"))();
const projectMembersModel = new (require("../models/projectMembers.model"))();

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async getUserRoleList(req, res) {
		try {
			const userList = await userModel.getUserRoleList();
			res.handler.success(userList, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}

	async getAllProjectDetails(req, res) {
		try {
			const { id } = req.query;
			if (!id) return res.handler.badRequest("VALIDATION.PROJECT.ID");

			const details = await projectMembersModel.getAllProjectDetails(id);
			res.handler.success(details?.[0] || {}, "STATUS.SUCCESS");
		} catch (error) {
			res.handler.serverError(error.message);
		}
	}
};
