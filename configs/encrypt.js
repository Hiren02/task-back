const crypt = require("crypto");
const algo = process.env.ENCRYPTION_ALGORITHM;
const key = process.env.ENCRYPTION_KEY;

class EncryptionHandler {
	encrypt(data) {
		try {
			let mykey = crypt.createCipher(algo, key);
			let mystr = mykey.update(data, "utf8", "");
			mystr += mykey.final("hex");
			hex;
			return {
				status: 200,
				data: mystr,
			};
		} catch (error) {
			return {
				status: 500,
				error: error,
			};
		}
	}

	decrypt(data) {
		try {
			const dcypher = crypt.createDecipher(algo, key);
			const decrypted_data = dcypher.update(data.trim(), "hex", "utf8") + dcypher.final("utf8");

			return {
				status: 200,
				data: JSON.parse(decrypted_data),
			};
		} catch (error) {
			return {
				status: 500,
				error: error,
			};
		}
	}
}

module.exports = EncryptionHandler;
