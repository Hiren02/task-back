module.exports = class {
	checkprofile_imageType(req, res, next) {
		try {
			if (req?.file) {
				if (
					req.file.mimetype !== "image/png" &&
					req.file.mimetype !== "image/jpg" &&
					req.file.mimetype !== "image/jpeg"
				) {
					return res.handler.badRequest(
						"VALIDATION.IMAGE.INVALID_TYPE"
					);
				}
			}
			next();
		} catch (error) {
			console.log(error);
		}
	}
};
