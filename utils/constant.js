const FileManager = require("../manager/fileManager");

async function updateprofile_images(userList) {
	if (!userList?.length) return [];
	const updatedUser = await Promise.all(
		userList.map(async (user) => {
			if (user?.profile_image) {
				const imageURL = await FileManager.getUrl(
					`profile-images/${user._id}`,
					user.profile_image
				);

				user.profile_image = imageURL;
			}
			return user;
		})
	);
	return updatedUser;
}

const USER_SUB_ROLES = {
	Director: "Director",
};

module.exports = { updateprofile_images, USER_SUB_ROLES };
