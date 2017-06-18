const utils = require('../utils');

class Account {
	constructor(legacy, userJson) {
		this.legacy = legacy;
		this.userData = userJson;
	}

	json() {
		if (this.legacy)
			return this.legacyJson();

		var profiles = {};
		profiles[this.userData.uuid] = {
			displayName: this.userData.username
		};

		return {
			accessToken: this.userData.accessToken,
			username: this.userData.email,
			profiles: profiles
		};
	}

	legacyJson() {
		return {
			displayName: this.userData.username,
			accessToken: this.userData.accessToken,
			userid: this.userData.userId,
			uuid: utils.partitionToken(this.userData.uuid),
			username: this.userData.email
		};
	}

	accessToken() { return this.userData.accessToken; }
	setAccessToken(accessToken) {
		this.userData.accessToken = accessToken;
		return this;
	}

	email() { return this.userData.email; }
	setEmail(email) {
		this.userData.email = email
		return this;
	}

	username() { return this.userData.username; }
	setUsername(username) {
		this.userData.username = username;
		return this;
	}

	uuid() { return this.userData.uuid; }
	setUuid(uuid) {
		this.userData.uuid = uuid;
		return this;
	}

	userId() { return this.userData.userId; }
	setUserId(userId) {
		this.userData.userId = userId;
		return this;
	}
}

// Make class visible outside
exports.Account = Account;