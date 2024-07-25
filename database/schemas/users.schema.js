const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: [true, "Provide valid first name"],
			trim: true,
		},
		last_name: {
			type: String,
			required: [true, "Provide valid last name"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email is require"],
			unique: true,
			validate: [validator.isEmail, "Provide valid email"],
		},
		role: {
			type: String,
			required: [true, "Role is required"],
			default: "user",
		},
		is_active: {
			type: Boolean,
			default: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: 8,
			select: false,
		},
		phone_number: {
			type: String,
		},
		profile_image: {
			type: String,
		},
	},
	{
		timestamps: {
			createdAt: "created_at",
			updatedAt: "updated_at",
		},
	}
);

usersSchema.pre("save", async function (next) {
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

// usersSchema.pre("save", async function (next) {
// 	if (!this.isModified("password")) return next();
// 	this.password = await bcrypt.hash(this.password, 12);
// 	next();
// });

usersSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	const isValid = await bcrypt.compare(candidatePassword, userPassword);

	return isValid;
};

usersSchema.index({
	roleId: 1,
});

module.exports = mongoose.model("User", usersSchema);
