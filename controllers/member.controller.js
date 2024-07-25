const generator = require("generate-password");

const emailHandle = require("../configs/email");

const membersModel = new (require("../models/members.model"))();
const userModel = new (require("../models/auth.model"))();
const developmentStageModel = new (require("../models/development.model"))();

const { getEndDate, validateStartDate } = require("../utils/helpers");
const { USER_ROLE } = require("../configs/constants");

let self;
module.exports = class {
	constructor() {
		self = this;
	}

	async addMember(req, res) {
		try {
			const { email, first_name, last_name, startDate, weeks } = req.body;

			let userPayload = {
				email,
				first_name,
				last_name,
				role: USER_ROLE["user"],
			};

			let userDetails = await userModel.getUser({ email });

			if (!userDetails) {
				const password = generator.generate({
					length: 8,
					numbers: true,
					symbols: true,
					lowercase: true,
					uppercase: true,
				});

				userDetails = await userModel.createUser({
					...userPayload,
					password,
				});

				userDetails.password = undefined;

				emailHandle.sendMail({
					receiverMail: email,
					subject: "Invitation",
					templateName: "inviteEmail.ejs",
					templateReplaceValue: {
						// orgName: `${req.user.userOrg.name}`,
						password: `${password}`,
					},
					// transporterConfig: transporterConfig,
				});
			}

			const isValidStartDate = validateStartDate(startDate);

			if (!isValidStartDate)
				return res.handler.badRequest(
					"VALIDATION.DATE.INVALID_START_DATE"
				);

			const endDate = getEndDate(startDate, weeks);

			const memberPayload = {
				...req.body,
				endDate: endDate,
				user: userDetails?._id,
			};

			const addedMember = await membersModel.createMember(memberPayload);

			if (!addedMember)
				return res.handler.badRequest("STATUS.SOMETHING_WRONG");

			return res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			if (error.customError) {
				return res.handler.badRequest(error.message);
			}
			return res.handler.serverError(error.message);
		}
	}
	async editMember(req, res) {
		try {
			const { id } = req.query;
			const { startDate, weeks } = req.body;

			const isValidStartDate = validateStartDate(startDate);

			if (!isValidStartDate)
				return res.handler.badRequest(
					"VALIDATION.DATE.INVALID_START_DATE"
				);

			const endDate = getEndDate(startDate, weeks);

			const editDeckData = await membersModel.editMember(id, {
				...req.body,
				endDate,
			});

			if (!editDeckData)
				return res.handler.badRequest("STATUS.SOMETHING_WRONG");

			return res.handler.success({}, "STATUS.SUCCESS");
		} catch (error) {
			return res.handler.serverError(error.message);
		}
	}
};
