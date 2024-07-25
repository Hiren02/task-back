const { userRolesModel } = require("../database/schemas");

const seedFunction = async function () {
	const userRoles = [
		{
			sub_role: "Executive Producer",
		},
		{
			sub_role: "Director",
		},
		{
			sub_role: "Showrunner",
		},
		{
			sub_role: "Co-Executive Producer",
		},
		{
			sub_role: "Supervising Producer",
		},
		{
			sub_role: "Consulting Producer",
		},
		{
			sub_role: "Producer",
		},
		{
			sub_role: "Consultant",
		},
		{
			sub_role: "Executive Story Editor",
		},
		{
			sub_role: "Story Editor",
		},
		{
			sub_role: "Staff Writer",
		},
		{
			sub_role: "Script Coordinator",
		},
		{
			sub_role: "Writer Assistant",
		},
		{
			sub_role: "Post Co-Producer",
		},
		{
			sub_role: "Post Associate Producer",
		},
		{
			sub_role: "VFX Editor",
		},
		{
			sub_role: "VFX Assistant Editor",
		},
		{
			sub_role: "VFX Supervisor",
		},
		{
			sub_role: "VFX Producer",
		},
		{
			sub_role: "VFX Coordinator",
		},
		{
			sub_role: "VFX Production Assistant",
		},
		{
			sub_role: "VFX Artists",
		},
		{
			sub_role: "Music Editor",
		},
		{
			sub_role: "Data Wrangler",
		},
	];

	await userRolesModel.deleteMany({}, { timeout: false });
	await userRolesModel.insertMany(userRoles, { timeout: false });
};

module.exports = seedFunction;
