const utils = require('../utils');

class Account {
	constructor(legacy, userJson) {
		this._legacy = legacy;
		this._userData = userJson;
	}

	json() {
		if (this._legacy)
			return this.legacyJson();

		var profiles = {};
		profiles[this._userData.uuid] = {
			displayName: this._userData.username
		};

		return {
			accessToken: this._userData.accessToken,
			username: this._userData.email,
			profiles: profiles
		};
	}

	legacyJson() {
		return {
			displayName: this._userData.username,
			accessToken: this._userData.accessToken,
			userid: this._userData.userId,
			uuid: utils.partitionToken(this._userData.uuid),
			username: this._userData.email
		};
	}

	accessToken() { return this._userData.accessToken; }
	setAccessToken(accessToken) {
		this._userData.accessToken = accessToken;
		return this;
	}

	email() { return this._userData.email; }
	setEmail(email) {
		this._userData.email = email
		return this;
	}

	username() { return this._userData.username; }
	setUsername(username) {
		this._userData.username = username;
		return this;
	}

	uuid() { return this._userData.uuid; }
	setUuid(uuid) {
		this._userData.uuid = uuid;
		return this;
	}

	userId() { return this._userData.userId; }
	setUserId(userId) {
		this._userData.userId = userId;
		return this;
	}
}

// Make class visible outside
exports.Account = Account;