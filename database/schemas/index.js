const usersSchema = require("./users.schema");
const userRolesSchema = require("./usersRole.schema");
const OrganizationSchema = require("./organization.schema");
const BlocksSchema = require("./blocks.schema");
const EpisodesSchema = require("./episodes.schema");
const ProjectsSchema = require("./projects.schema");
const SceneTrackerSchema = require("./sceneTracker.schema");
const UnitsSchema = require("./units.schema");
const DevelopmentStageSchema = require("./development.schema");
const ProductionStageSchema = require("./production.schema");
const PreProductionStageSchema = require("./preProduction.schema");
const PostProductionStageSchema = require("./postProduction.schema");
const ProjectMembersSchema = require("./projectMembers.schema");

module.exports = {
	usersSchema,
	userRolesSchema,
	OrganizationSchema,
	BlocksSchema,
	EpisodesSchema,
	ProjectsSchema,
	SceneTrackerSchema,
	UnitsSchema,
	DevelopmentStageSchema,
	ProductionStageSchema,
	PreProductionStageSchema,
	PostProductionStageSchema,
	ProjectMembersSchema,
};
