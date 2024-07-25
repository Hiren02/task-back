const { ProjectsSchema } = require("../database/schemas");

module.exports = class {
	createProject(data) {
		return ProjectsSchema.create(data);
	}

	findOneProject(_id) {
		return ProjectsSchema.findOne({ _id });
	}

	findProjectByUser(id, userId) {
		return ProjectsSchema.findOne({ _id: id, created_by: userId });
	}

	findAllProject() {
		return ProjectsSchema.find();
	}

	updateProject(conditions, updateData, ...extraArgs) {
		return ProjectsSchema.updateOne(conditions, updateData, ...extraArgs);
	}

	deleteProject(_id) {
		return ProjectsSchema.deleteOne({ _id });
	}
};
